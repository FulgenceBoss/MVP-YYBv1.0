// For the MVP, we will use a mock service.
// In a real-world scenario, you would integrate a third-party SMS provider like Twilio, Vonage, etc.

/**
 * Generates a random 6-digit OTP (One-Time Password).
 * @returns {string} The 6-digit OTP.
 */
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * "Sends" an SMS by logging it to the console.
 * In a real application, this function would make an API call to an SMS provider.
 * @param {string} phoneNumber The recipient's phone number.
 * @param {string} message The message to send.
 * @returns {Promise<{success: boolean, message: string, messageId: string}>} A promise that resolves with the result of the operation.
 */
const sendSms = async (phoneNumber, message) => {
  console.log("--- MOCK SMS SERVICE ---");
  console.log(`Sending SMS to: ${phoneNumber}`);
  console.log(`Message: ${message}`);
  console.log("------------------------");

  // Simulate a network delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Simulate a successful API call
  return {
    success: true,
    message: "SMS sent successfully (mocked)",
    messageId: `mock_${Date.now()}`,
  };
};

module.exports = {
  generateOTP,
  sendSms,
};
