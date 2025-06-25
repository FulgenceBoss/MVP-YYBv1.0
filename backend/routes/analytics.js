const express = require("express");
const router = express.Router();
const { trackFrontendEvent } = require("../controllers/analyticsController");
const { protect } = require("../middleware/authMiddleware");
const asyncHandler = require("express-async-handler");
const { getActivationRate } = require("../services/analyticsService");

// @route   POST /api/analytics/track
router.post("/track", protect, trackFrontendEvent);

// @route   GET /api/analytics/overview
// @desc    Get an overview of key metrics (activation rate, etc.)
// @access  Private (ou Admin plus tard)
router.route("/overview").get(
  protect,
  asyncHandler(async (req, res) => {
    const activationRate = await getActivationRate();

    res.status(200).json({
      success: true,
      data: {
        activationRate: activationRate.toFixed(2), // Formatter à 2 décimales
      },
    });
  })
);

module.exports = router;
