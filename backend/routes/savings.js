const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  getSavingsConfig,
  setSavingsConfig,
  getSavingsBalance,
  getTransactions,
  manualDeposit,
  testConnection,
} = require("../controllers/savingsController");

router.get("/config", protect, getSavingsConfig);
router.post("/config", protect, setSavingsConfig);
router.get("/balance", protect, getSavingsBalance);
router.get("/history", protect, getTransactions);
router.post("/deposit", protect, manualDeposit);

// @route   POST /api/savings/test-connection
// @desc    Tests the mobile money connection for the user
// @access  Private
router.post("/test-connection", protect, testConnection);

module.exports = router;
