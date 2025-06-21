const express = require("express");
const router = express.Router();
const { trackFrontendEvent } = require("../controllers/analyticsController");
const { protect } = require("../middleware/authMiddleware");

// @route   POST /api/analytics/track
router.post("/track", protect, trackFrontendEvent);

module.exports = router;
