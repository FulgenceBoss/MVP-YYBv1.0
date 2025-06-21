const AnalyticsEvent = require("../models/AnalyticsEvent");

/**
 * Tracks an analytics event and saves it to the database.
 * This is designed to be a "fire-and-forget" operation from the perspective
 * of the calling code, so it handles its own errors internally.
 *
 * @param {string} userId - The ID of the user associated with the event.
 * @param {string} eventName - The name of the event (e.g., 'user_registered').
 * @param {object} [eventData={}] - Optional data associated with the event.
 */
const trackEvent = async (userId, eventName, eventData = {}) => {
  try {
    console.log(`[Analytics] Tracking event: ${eventName} for user ${userId}`);
    const event = new AnalyticsEvent({
      userId,
      eventName,
      eventData,
    });
    await event.save();
  } catch (error) {
    console.error(
      `[Analytics] Failed to track event ${eventName} for user ${userId}:`,
      error
    );
  }
};

module.exports = {
  trackEvent,
};
