const cron = require("node-cron");
const SavingsConfig = require("../models/SavingsConfig");
const SavingsBalance = require("../models/SavingsBalance");
const Transaction = require("../models/Transaction");
const { initiateDebit } = require("./transactionService");
const { sendPushNotification } = require("./pushNotificationService");
const { trackEvent } = require("../services/analyticsService");

const MAX_RETRIES = 3;

const processScheduledSavings = async () => {
  const now = new Date();
  const currentHour = now.getUTCHours();
  const currentMinute = now.getUTCMinutes();
  // Format HH:MM en UTC
  const currentTimeUTC = `${String(currentHour).padStart(2, "0")}:${String(
    currentMinute
  ).padStart(2, "0")}`;

  console.log(
    `🚀 CRON job running at UTC: ${currentTimeUTC}. Checking for scheduled savings.`
  );

  try {
    // Trouver les configs actives qui correspondent à l'heure actuelle (en UTC)
    // Note: Pour une app en prod, il faudrait une conversion de timezone plus robuste.
    // Ici, on suppose que deductionTime est stocké en UTC.
    const configsToProcess = await SavingsConfig.find({
      active: true,
      deductionTime: currentTimeUTC,
    }).populate("user");

    if (configsToProcess.length === 0) {
      console.log("No savings scheduled for this minute.");
      return;
    }

    for (const config of configsToProcess) {
      // Vérifier si l'utilisateur a déjà été traité aujourd'hui
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const balance = await SavingsBalance.findOne({ user: config.user._id });
      if (
        balance &&
        balance.lastTransactionDate &&
        balance.lastTransactionDate >= today
      ) {
        console.log(
          `-> User ${config.user.phoneNumber} already processed today. Skipping.`
        );
        continue;
      }

      console.log(
        `-> Processing user: ${config.user.phoneNumber} for ${config.amount} FCFA.`
      );

      // 1. Envoyer une notification de rappel
      if (config.user.pushToken) {
        sendPushNotification(
          config.user.pushToken,
          "Rappel d'Épargne Yessi-Yessi",
          `Nous allons tenter de prélever ${config.amount} FCFA dans un instant.`
        );
      }

      // 2. Tenter le débit
      const transactionResult = await initiateDebit(
        config.user,
        config.amount,
        "automatic"
      );

      // 3. Envoyer une notification de succès ou d'échec
      if (transactionResult.success) {
        await SavingsBalance.findOneAndUpdate(
          { user: config.user._id },
          {
            $inc: { balance: config.amount },
            $set: { lastTransactionDate: new Date() },
          },
          { upsert: true, new: true }
        );

        // Track event
        trackEvent(config.user._id, "automatic_deposit_success", {
          amount: config.amount,
        });

        if (config.user.pushToken) {
          sendPushNotification(
            config.user.pushToken,
            "Épargne Automatique Réussie ! ✅",
            `Super ! ${config.amount} FCFA ont été ajoutés à votre cagnotte.`
          );
        }
      } else {
        // Track event
        trackEvent(config.user._id, "automatic_deposit_failure", {
          amount: config.amount,
        });

        if (config.user.pushToken) {
          sendPushNotification(
            config.user.pushToken,
            "Échec de l'Épargne Automatique ❌",
            `Nous n'avons pas pu prélever ${config.amount} FCFA. Veuillez vérifier votre solde.`
          );
        }
      }
    }
  } catch (error) {
    console.error("Error during scheduled savings processing:", error);
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
  // --- NOUVELLE LOGIQUE ---
  // Remplacer la tâche quotidienne par une tâche qui s'exécute toutes les minutes
  // pour une planification plus précise.
  console.log(
    "CRON jobs setup. Scheduled savings check will run every minute."
  );

  // Exécuter le job toutes les minutes.
  cron.schedule("* * * * *", processScheduledSavings);

  // Le CRON pour les transactions échouées peut rester le même (ex: toutes les 5 mins)
  // cron.schedule("*/5 * * * *", processFailedTransactions); // Toujours désactivé pour le moment

  console.log(
    "✅ CRON jobs initialized (Scheduled Savings every minute & Retries disabled)."
  );
};

module.exports = initScheduledJobs;
