const cron = require("node-cron");
const SavingsConfig = require("../models/SavingsConfig");
const SavingsBalance = require("../models/SavingsBalance");
const Transaction = require("../models/Transaction");
const { initiateDebit } = require("./transactionService");

const MAX_RETRIES = 3;

const processDailySavings = async () => {
  console.log("🚀 Starting daily savings processing...");

  try {
    const activeConfigs = await SavingsConfig.find({ active: true }).populate(
      "user"
    );

    if (activeConfigs.length === 0) {
      console.log("No active savings configurations to process.");
      return;
    }

    for (const config of activeConfigs) {
      console.log(
        `-> Found active user: ${config.user.phoneNumber}. Preparing to process ${config.amount} FCFA.`
      );

      const balance = await SavingsBalance.findOne({ user: config.user._id });

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (
        balance &&
        balance.lastTransactionDate &&
        balance.lastTransactionDate >= today
      ) {
        console.log(
          `   - User ${config.user.phoneNumber} already processed today. Skipping.`
        );
        continue; // Skip to the next user
      }

      const transactionResult = await initiateDebit(
        config.user,
        config.amount,
        "automatic"
      );

      if (transactionResult.success) {
        // Find or create the savings balance for the user
        const updatedBalance = await SavingsBalance.findOneAndUpdate(
          { user: config.user._id },
          {
            $inc: { balance: config.amount },
            $set: { lastTransactionDate: new Date() },
          },
          { upsert: true, new: true }
        );
        console.log(
          `   - Balance updated for ${config.user.phoneNumber}. New balance: ${updatedBalance.balance} FCFA.`
        );
      }
    }
  } catch (error) {
    console.error("Error during savings processing:", error);
  }
};

const processFailedTransactions = async () => {
  console.log("🔄 Starting failed transaction processing...");

  const failedTransactions = await Transaction.find({
    status: "pending",
    retries: { $gt: 0, $lt: MAX_RETRIES },
  }).populate("user");

  if (failedTransactions.length === 0) {
    console.log("No failed transactions to retry.");
    return;
  }

  for (const transaction of failedTransactions) {
    console.log(
      ` -> Retrying transaction ${transaction._id} for user ${
        transaction.user.phoneNumber
      }. Attempt: ${transaction.retries + 1}`
    );

    const transactionResult = await initiateDebit(
      transaction.user,
      transaction.amount,
      transaction.type
    );

    if (transactionResult.success) {
      const balance = await SavingsBalance.findOneAndUpdate(
        { user: transaction.user._id },
        {
          $inc: { balance: transaction.amount },
          $set: { lastTransactionDate: new Date() },
        },
        { upsert: true, new: true }
      );
      console.log(
        `   - SUCCESS on retry. New balance: ${balance.balance} FCFA.`
      );
    } else if (transaction.retries >= MAX_RETRIES - 1) {
      const failedTx = await Transaction.findById(transaction._id);
      failedTx.status = "failed";
      await failedTx.save();
      console.log(`   - FAILED permanently after ${MAX_RETRIES} attempts.`);
    }
  }
};

const initScheduledJobs = () => {
  // CRON for new daily savings
  cron.schedule("* * * * *", processDailySavings);

  // CRON for retrying failed transactions (e.g., every 5 minutes)
  cron.schedule("*/5 * * * *", processFailedTransactions);

  console.log("✅ CRON jobs initialized (Daily Savings & Retries).");
};

module.exports = initScheduledJobs;
