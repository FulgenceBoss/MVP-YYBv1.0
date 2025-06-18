const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  getSavingsConfig,
  setSavingsConfig,
  getSavingsBalance,
  getTransactions,
  manualDeposit,
} = require("../controllers/savingsController");

router.get("/config", protect, getSavingsConfig);
router.post("/config", protect, setSavingsConfig);
router.get("/balance", protect, getSavingsBalance);
router.get("/history", protect, getTransactions);
router.post("/deposit", protect, manualDeposit);

module.exports = router;
