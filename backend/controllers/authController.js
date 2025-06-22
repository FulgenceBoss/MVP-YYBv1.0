const User = require("../models/User");
const { generateOTP, sendSms } = require("../services/smsService");
const { generateToken } = require("../middleware/authMiddleware");
const { trackEvent } = require("../services/analyticsService");

// @desc    Register a new user / Send OTP
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res, next) => {
  const { phoneNumber, fullName } = req.body;
  console.log(`[Auth] Tentative d'inscription pour : ${phoneNumber}`);

  if (!phoneNumber) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide a phone number" });
  }

  try {
    let user = await User.findOne({ phoneNumber });

    // If user exists and is already verified, they should log in.
    if (user && user.verificationStatus === "verified") {
      return res.status(409).json({
        success: false,
        message:
          "Ce numéro de téléphone est déjà utilisé. Veuillez vous connecter.",
        errorCode: "USER_ALREADY_EXISTS",
      });
    }

    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

    if (user) {
      // User exists, just update OTP
      user.otpCode = otp;
      user.otpExpiry = otpExpiry;
      await user.save();
    } else {
      // Create a new user if not found
      user = await User.create({
        phoneNumber,
        fullName,
        otpCode: otp,
        otpExpiry: otpExpiry,
      });
    }

    // Send the OTP via our mock SMS service
    // In a real app, you would handle potential errors from the SMS service
    await sendSms(
      user.phoneNumber,
      `Your Yessi-Yessi verification code is: ${otp}. It will expire in 10 minutes.`
    );

    res
      .status(200)
      .json({ success: true, message: `OTP sent to ${user.phoneNumber}` });
  } catch (error) {
    // Here you can handle specific errors, e.g., validation errors
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message });
  }
};

// @desc    Verify OTP and create user session
// @route   POST /api/auth/verify
// @access  Public
const verifyOtp = async (req, res, next) => {
  const { phoneNumber, otpCode, pin, fullName } = req.body;
  console.log(`[Auth] Tentative de vérification OTP pour : ${phoneNumber}`);

  if (!phoneNumber || !otpCode || !pin) {
    return res.status(400).json({
      success: false,
      message: "Données manquantes (téléphone, OTP ou PIN).",
    });
  }

  try {
    const user = await User.findOne({
      phoneNumber,
      otpCode: otpCode,
      otpExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "OTP invalide ou expiré." });
    }

    if (pin.length !== 4) {
      return res
        .status(400)
        .json({ success: false, message: "Le PIN doit contenir 4 chiffres." });
    }

    // Update user with PIN and fullName
    user.pin = pin;
    user.fullName = fullName || user.fullName; // Use new fullName if provided
    user.verificationStatus = "verified";
    user.otpCode = undefined;
    user.otpExpiry = undefined;

    await user.save();

    // Track user registration event
    trackEvent(user._id, "user_registered");

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: "Utilisateur vérifié et enregistré avec succès",
      token: token,
      user: {
        phoneNumber: user.phoneNumber,
        fullName: user.fullName,
      },
    });
  } catch (error) {
    console.error("Erreur interne lors de la vérification OTP:", error);
    res.status(500).json({
      success: false,
      message: "Une erreur interne est survenue.",
      error: error.message,
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res, next) => {
  const { phoneNumber, pin } = req.body;
  console.log(`[Auth] Tentative de connexion pour : ${phoneNumber}`);

  if (!phoneNumber || !pin) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide phone number and PIN" });
  }

  try {
    // Find user by phone number and explicitly select the pin
    const user = await User.findOne({ phoneNumber }).select("+pin");

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    // Check if pin matches
    const isMatch = await user.matchPin(pin);

    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    // Track user login event
    trackEvent(user._id, "user_loggedIn");

    // User is logged in, send token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      token: token,
      user: {
        phoneNumber: user.phoneNumber,
        fullName: user.fullName,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message });
  }
};

// GET /api/auth/me - Get current user data based on token
const getMe = async (req, res) => {
  try {
    // req.user is populated by the 'protect' middleware from the token
    const user = await User.findById(req.user.id).select("-pin"); // Exclude PIN from response
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Utilisateur non trouvé." });
    }
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
};

// @desc    Change user PIN
// @route   PUT /api/auth/change-pin
// @access  Private
const changePin = async (req, res) => {
  const { oldPin, newPin } = req.body;

  if (!oldPin || !newPin || newPin.length !== 4) {
    return res.status(400).json({
      success: false,
      message: "Veuillez fournir l'ancien et le nouveau PIN (4 chiffres).",
    });
  }

  try {
    const user = await User.findById(req.user.id).select("+pin");

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Utilisateur non trouvé." });
    }

    const isMatch = await user.matchPin(oldPin);

    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Ancien PIN incorrect." });
    }

    user.pin = newPin;
    await user.save();

    res.json({ success: true, message: "PIN mis à jour avec succès." });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Erreur serveur",
        error: error.message,
      });
  }
};

module.exports = {
  registerUser,
  verifyOtp,
  loginUser,
  getMe,
  changePin,
};
