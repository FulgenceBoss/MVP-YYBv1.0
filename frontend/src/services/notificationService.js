import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Platform, Alert } from "react-native";
import Constants from "expo-constants";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export const registerForPushNotificationsAsync = async () => {
  let token;

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      const errorMessage = "Permission de notification non accordée !";
      console.log(errorMessage);
      return { error: errorMessage };
    }

    try {
      // --- C'est la ligne la plus importante ---
      const projectId = Constants.expoConfig?.extra?.eas?.projectId;
      if (!projectId) {
        throw new Error(
          "L'identifiant du projet n'a pas été trouvé. Assurez-vous que eas.json est configuré."
        );
      }
      token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
    } catch (e) {
      const errorMessage = `Erreur lors de la récupération du token : ${e.message}`;
      console.error(errorMessage);
      return { error: errorMessage };
    }
  } else {
    const errorMessage =
      "Les notifications Push ne sont supportées que sur des appareils physiques.";
    console.log(errorMessage);
    return { error: errorMessage };
  }

  return { token };
};
