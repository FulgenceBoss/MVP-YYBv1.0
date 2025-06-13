const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { initiateDebit } = require("../services/paymentService");
const User = require("../models/User");

// @desc    Test basic API connectivity
// @route   GET /api/test/ping
// @access  Public
router.get("/ping", (req, res) => {
  res.status(200).json({ success: true, message: "pong" });
});

// @desc    Test debit functionality
// @route   POST /api/test/debit
// @access  Private
router.post("/debit", protect, async (req, res) => {
  try {
    // In a real scenario, the amount would come from savings config or manual input
    const amount = 1000;
    const type = "manual";

    // Get the logged-in user from the 'protect' middleware
    const user = await User.findById(req.user.id);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const result = await initiateDebit(user, amount, type);

    res.status(200).json(result);
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message });
  }
});

module.exports = router;
