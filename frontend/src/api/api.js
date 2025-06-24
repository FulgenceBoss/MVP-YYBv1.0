import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { API_URL } from "./config"; // Import from the new config file

// Détecte si l'app est lancée via un tunnel Expo
const inTunnel =
  __DEV__ && (global.location?.href || "").includes("exp.direct");

// The base URL is now managed in config.js
// const API_URL = "http://192.168.31.154:8080/api";

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor to add the token to every request if it exists
apiClient.interceptors.request.use(
  async (config) => {
    // The most reliable source is the default header, set immediately after login.
    if (apiClient.defaults.headers.common["Authorization"]) {
      config.headers.Authorization =
        apiClient.defaults.headers.common["Authorization"];
      return config;
    }

    // Fallback to checking SecureStore for subsequent app launches.
    try {
      const token = await SecureStore.getItemAsync("userToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
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

export default apiClient;
