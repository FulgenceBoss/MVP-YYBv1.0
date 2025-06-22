const SavingsConfig = require("../models/SavingsConfig");
const SavingsBalance = require("../models/SavingsBalance");
const Transaction = require("../models/Transaction");
const User = require("../models/User");
const { sendPushNotification } = require("../services/pushNotificationService");
const { trackEvent } = require("../services/analyticsService");

// GET /api/savings/history
exports.getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user.id })
      .sort({ createdAt: -1 }) // Sort by newest first
      .limit(20); // Limit to the last 20 for performance

    res.status(200).json({ success: true, transactions });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
};

// GET /api/savings/balance
exports.getSavingsBalance = async (req, res) => {
  try {
    const balance = await SavingsBalance.findOne({ user: req.user.id });

    // If no balance record, it means they haven't had a successful transaction yet.
    if (!balance) {
      return res.status(200).json({ success: true, balance: 0 });
    }

    res.status(200).json({ success: true, balance: balance.balance });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
};

// GET /api/savings/config
exports.getSavingsConfig = async (req, res) => {
  try {
    const config = await SavingsConfig.findOne({ user: req.user.id }).lean(); // Use .lean() for a plain object
    if (!config) {
      return res.status(200).json({ success: true, config: null });
    }

    // --- Data Migration for older users ---
    if (!config.goal) {
      config.goal = {
        key: "default",
        icon: "🎯",
        name: "Mon Premier Objectif",
        amount: 200000,
        bgColor: "#E3F2FD",
      };
    }
    if (config.amount && !config.dailyAmount) {
      // Migrate old 'amount' field to 'dailyAmount'
      config.dailyAmount = config.amount;
    }
    if (!config.dailyAmount) {
      config.dailyAmount = 1000; // Default daily amount if none exists
    }
    // --- End Data Migration ---

    // --- Streak Calculation (Temporarily Disabled) ---
    /*
    const transactions = await Transaction.find({
      user: req.user.id,
      status: "completed",
      type: "auto",
    }).sort({ createdAt: -1 });

    let streak = 0;
    if (transactions.length > 0) {
      let today = new Date();
      today.setHours(0, 0, 0, 0);

      // Check if the most recent transaction was yesterday or today
      const lastTransactionDate = new Date(transactions[0].createdAt);
      lastTransactionDate.setHours(0, 0, 0, 0);

      const diffTime = today - lastTransactionDate;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays <= 1) {
        streak = 1;
        let previousDay = new Date(lastTransactionDate);

        for (let i = 1; i < transactions.length; i++) {
          let currentTransactionDate = new Date(transactions[i].createdAt);
          currentTransactionDate.setHours(0, 0, 0, 0);

          // Correctly calculate the expected previous day without modifying the original
          const expectedPreviousDay = new Date(previousDay);
          expectedPreviousDay.setDate(expectedPreviousDay.getDate() - 1);

          if (
            currentTransactionDate.getTime() === expectedPreviousDay.getTime()
          ) {
            streak++;
            previousDay = currentTransactionDate;
          } else {
            break; // Streak is broken
          }
        }
      }
    }
    config.streak = streak;
    */
    config.streak = 0; // Default to 0 for now
    // --- End Streak Calculation ---

    res.status(200).json({ success: true, config });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur serveur",
      error: error.message,
    });
  }
};

// POST /api/savings/config
exports.setSavingsConfig = async (req, res) => {
  try {
    const { goal, dailyAmount, deductionTime, wallet, active, operator } =
      req.body;

    // Build the update object with only the fields provided in the request
    const updateFields = {};
    if (goal !== undefined) updateFields.goal = goal;
    if (dailyAmount !== undefined) updateFields.dailyAmount = dailyAmount;
    if (deductionTime !== undefined) updateFields.deductionTime = deductionTime;
    if (wallet !== undefined) updateFields.wallet = wallet;
    if (active !== undefined) updateFields.active = active;
    if (operator !== undefined) updateFields.operator = operator;

    if (Object.keys(updateFields).length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Aucun champ à mettre à jour." });
    }

    // Upsert: find existing config and update it, or create a new one
    const config = await SavingsConfig.findOneAndUpdate(
      { user: req.user.id },
      { $set: updateFields, $setOnInsert: { user: req.user.id } },
      { new: true, upsert: true, runValidators: true }
    );

    // Track event
    if (dailyAmount && deductionTime) {
      trackEvent(req.user.id, "savings_configured", {
        amount: config.dailyAmount,
        deductionTime: config.deductionTime,
        goal: config.goal,
      });
    }

    res
      .status(200)
      .json({ success: true, config, message: "Configuration sauvegardée." });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// POST /api/savings/deposit
exports.manualDeposit = async (req, res) => {
  const { amount } = req.body;
  const userId = req.user.id;

  if (!amount || amount < 100) {
    return res
      .status(400)
      .json({ success: false, message: "Le montant est invalide." });
  }

  try {
    // Track event
    trackEvent(userId, "manual_deposit_initiated", { amount });

    // 1. Mettre à jour (ou créer) le solde
    const balanceUpdate = await SavingsBalance.findOneAndUpdate(
      { user: userId },
      { $inc: { balance: amount } },
      { new: true, upsert: true }
    );

    // 2. Créer l'enregistrement de la transaction
    const transaction = await Transaction.create({
      user: userId,
      amount: amount,
      type: "manual",
      status: "completed",
    });

    // 3. Envoyer une notification de confirmation (fire and forget)
    // Nous ne bloquons pas la réponse de l'API pour cela.
    const user = await User.findById(userId);
    if (user && user.pushToken) {
      console.log(`Sending push notification to token: ${user.pushToken}`);
      sendPushNotification(
        user.pushToken,
        "Épargne Réussie ! 🎉",
        `Félicitations ! Vous venez d'épargner ${amount} FCFA.`
      );
    }

    res.status(201).json({
      success: true,
      message: "Dépôt manuel réussi.",
      transaction: transaction,
      newBalance: balanceUpdate.balance,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Erreur serveur lors du dépôt." });
  }
};
