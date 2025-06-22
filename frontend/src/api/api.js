import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { API_URL } from "./config"; // Import from the new config file

// Détecte si l'app est lancée via un tunnel Expo
const inTunnel =
  __DEV__ && (global.location?.href || "").includes("exp.direct");

// The base URL is now managed in config.js
// const API_URL = "http://192.168.31.154:8080/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor to add the token to every request if it exists
api.interceptors.request.use(
  async (config) => {
    console.log(`[DEBUG] Interceptor: URL de la requête -> ${config.url}`);
    // The most reliable source is the default header, set immediately after login.
    if (api.defaults.headers.common["Authorization"]) {
      console.log(
        "[DEBUG] Interceptor: Token trouvé dans les en-têtes par défaut. Ajouté."
      );
      config.headers.Authorization =
        api.defaults.headers.common["Authorization"];
      return config;
    }

    // Fallback to checking SecureStore for subsequent app launches.
    console.log(
      "[DEBUG] Interceptor: Pas de token dans les en-têtes par défaut. Vérification du SecureStore."
    );
    try {
      const token = await SecureStore.getItemAsync("userToken");
      if (token) {
        console.log(
          "[DEBUG] Interceptor: Token trouvé dans SecureStore et ajouté."
        );
        config.headers.Authorization = `Bearer ${token}`;
      } else {
        console.log(
          "[DEBUG] Interceptor: Aucun token trouvé dans SecureStore."
        );
      }
    } catch (e) {
      console.error("Failed to get token from storage", e);
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
