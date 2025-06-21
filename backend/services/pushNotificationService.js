const { Expo } = require("expo-server-sdk");

// Créer un nouveau client Expo
const expo = new Expo();

const sendPushNotification = async (pushToken, title, body, data = {}) => {
  // Vérifier si le token est un token Expo valide
  if (!Expo.isExpoPushToken(pushToken)) {
    console.error(`Push token ${pushToken} is not a valid Expo push token`);
    return;
  }

  // Construire le message de la notification
  const message = {
    to: pushToken,
    sound: "default",
    title: title,
    body: body,
    data: data,
  };

  try {
    // Envoyer la notification via le serveur Expo
    const ticket = await expo.sendPushNotificationsAsync([message]);
    console.log("Notification ticket sent:", ticket);
    // Note: Plus tard, nous pourrions gérer les reçus pour vérifier la livraison
    return ticket;
  } catch (error) {
    console.error("Error sending push notification:", error);
  }
};

module.exports = { sendPushNotification };
