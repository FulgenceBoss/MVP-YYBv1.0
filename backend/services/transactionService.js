const Transaction = require("../models/Transaction");

/**
 * Initiates a mock debit transaction.
 * This service simulates an API call to a Mobile Money provider.
 *
 * @param {object} user - The user object from whom to debit.
 * @param {number} amount - The amount to debit.
 * @param {string} type - The type of transaction ('automatic' or 'manual').
 * @returns {Promise<{success: boolean, transactionId: string}>} The result of the transaction attempt.
 */
const initiateDebit = async (user, amount, type) => {
  const transaction = await Transaction.create({
    user: user._id,
    amount,
    type,
    status: "pending",
  });

  console.log(`--- MOCK TRANSACTION SERVICE ---`);
  console.log(
    `Initiating debit of ${amount} FCFA for user ${user.phoneNumber}...`
  );
  await new Promise((resolve) => setTimeout(resolve, 1500));

  const isSuccess = Math.random() < 0.9; // 90% success rate

  if (isSuccess) {
    transaction.status = "completed";
    transaction.providerTransactionId = `mock_success_${Date.now()}`;
    await transaction.save();
    console.log(`✅ Debit successful for transaction ${transaction._id}`);
    return { success: true, transactionId: transaction._id };
  } else {
    transaction.retries += 1;
    await transaction.save();
    console.log(
      `❌ Debit FAILED for transaction ${transaction._id}. Attempt: ${transaction.retries}.`
    );
    return { success: false, transactionId: transaction._id };
  }
};

module.exports = {
  initiateDebit,
};
