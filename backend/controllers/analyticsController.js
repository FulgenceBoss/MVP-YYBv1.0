const { trackEvent } = require("../services/analyticsService");
const asyncHandler = require("express-async-handler");

// @desc    Track a custom event from the frontend
// @route   POST /api/analytics/track
// @access  Private
const trackFrontendEvent = async (req, res) => {
  const { eventName, eventData } = req.body;
  const userId = req.user.id;

  if (!eventName) {
    return res
      .status(400)
      .json({ success: false, message: "Event name is required" });
  }

  // Fire and forget
  trackEvent(userId, eventName, eventData);

  // Respond immediately so we don't slow down the frontend
  res.status(202).json({ success: true, message: "Event is being tracked" });
};

module.exports = {
  trackFrontendEvent,
};
