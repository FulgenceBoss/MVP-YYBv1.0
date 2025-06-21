const mongoose = require("mongoose");

const AnalyticsEventSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  eventName: {
    type: String,
    required: true,
    enum: [
      "user_registered",
      "user_loggedIn",
      "savings_configured",
      "savings_toggled_on",
      "savings_toggled_off",
      "manual_deposit_initiated",
      "automatic_deposit_success",
      "automatic_deposit_failure",
    ],
  },
  eventData: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Index pour des requêtes plus rapides sur les événements d'un utilisateur
AnalyticsEventSchema.index({ userId: 1 });
// Index pour des requêtes plus rapides sur les noms d'événements
AnalyticsEventSchema.index({ eventName: 1 });

module.exports = mongoose.model("AnalyticsEvent", AnalyticsEventSchema);
