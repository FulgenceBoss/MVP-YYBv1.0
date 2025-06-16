import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Or Expo SecureStore
import { API_URL } from "./config"; // Import from the new config file

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
    // List of routes that don't require authentication
    const publicRoutes = ["/auth/login", "/auth/register", "/auth/verify"];

    // For public routes, we don't need to do anything with tokens.
    // Return the config immediately.
    if (publicRoutes.includes(config.url)) {
      return config;
    }

    // For protected routes, get the token and add it to the header.
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (e) {
      // Handle potential errors from AsyncStorage
      console.error("Failed to get token from storage", e);
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
