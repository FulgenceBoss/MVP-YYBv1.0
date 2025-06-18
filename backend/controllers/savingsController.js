const SavingsConfig = require("../models/SavingsConfig");
const SavingsBalance = require("../models/SavingsBalance");
const Transaction = require("../models/Transaction");

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
    const config = await SavingsConfig.findOne({ user: req.user.id });
    if (!config) {
      return res.status(200).json({ success: true, config: null });
    }
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
    const { amount, deductionTime, wallet, active, operator } = req.body;

    // Build the update object with only the fields provided in the request
    const updateFields = {};
    if (amount !== undefined) updateFields.amount = amount;
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
