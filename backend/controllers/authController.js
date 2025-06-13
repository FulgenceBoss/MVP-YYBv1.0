const User = require("../models/User");
const { generateOTP, sendSms } = require("../services/smsService");
const { generateToken } = require("../middleware/authMiddleware");

// @desc    Register a new user / Send OTP
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  const { phoneNumber } = req.body;

  if (!phoneNumber) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide a phone number" });
  }

  try {
    let user = await User.findOne({ phoneNumber });

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
exports.verifyOTP = async (req, res, next) => {
  console.log("BODY REÇU :", req.body);
  const { phoneNumber, otpCode, pin } = req.body;

  if (!phoneNumber || !otpCode) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide phone number and OTP" });
  }

  try {
    const user = await User.findOne({
      phoneNumber,
      otpCode: otpCode,
      otpExpiry: { $gt: Date.now() }, // Check if OTP is not expired
    });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid OTP or OTP has expired" });
    }

    // At this point, the user is real. Now they need to set a PIN.
    // For now, let's assume they set a PIN on the client and send it.
    // In a real flow, you'd have a separate `set-pin` endpoint.
    if (!pin || pin.length !== 4) {
      return res
        .status(400)
        .json({ success: false, message: "Please provide a 4-digit PIN" });
    }

    user.pin = pin;
    user.verificationStatus = "verified";
    user.otpCode = undefined; // Invalidate OTP
    user.otpExpiry = undefined;
    await user.save();

    res.status(201).json({
      success: true,
      message: "User verified and registered successfully",
      token: generateToken(user._id),
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  const { phoneNumber, pin } = req.body;

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

    // User is logged in, send token
    res.status(200).json({
      success: true,
      token: generateToken(user._id),
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message });
  }
};
