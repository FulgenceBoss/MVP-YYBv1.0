const AnalyticsEvent = require("../models/AnalyticsEvent");
const User = require("../models/User");

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

/**
 * Calculates the user activation rate.
 * Activation is defined as the percentage of registered users
 * who have successfully configured their savings plan.
 * @returns {Promise<number>} The activation rate as a percentage (0-100).
 */
const getActivationRate = async () => {
  try {
    // 1. Compter le nombre total d'utilisateurs
    const totalUsers = await User.countDocuments();
    if (totalUsers === 0) {
      return 0;
    }

    // 2. Compter le nombre d'utilisateurs uniques qui ont configuré l'épargne
    const activatedUsersCount = await AnalyticsEvent.distinct("userId", {
      eventName: "savings_configured",
    });

    // 3. Calculer le taux
    const activationRate = (activatedUsersCount.length / totalUsers) * 100;
    return activationRate;
  } catch (error) {
    console.error("[Analytics] Failed to calculate activation rate:", error);
    return 0; // Retourner 0 en cas d'erreur
  }
};

module.exports = {
  trackEvent,
  getActivationRate,
};
