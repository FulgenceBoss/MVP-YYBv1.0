const express = require("express");
const router = express.Router();
const rateLimit = require("express-rate-limit");
const {
  registerUser,
  verifyOtp,
  loginUser,
} = require("../controllers/authController");
const {
  validateRegister,
  validateVerify,
  validateLogin,
} = require("../middleware/validators/authValidator");

// Rate Limiter for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message:
    "Trop de tentatives de connexion depuis cette IP, veuillez réessayer après 15 minutes.",
});

// Apply the limiter to all auth routes
router.use(authLimiter);

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
router.post("/register", validateRegister, registerUser);

// @desc    Verify OTP and create user session
// @route   POST /api/auth/verify
// @access  Public
router.post("/verify", validateVerify, verifyOtp);

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
router.post("/login", validateLogin, loginUser);

module.exports = router;
