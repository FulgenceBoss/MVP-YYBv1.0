import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Or Expo SecureStore

// Configure this to your backend's URL
// For local development with an Android emulator, use 'http://10.0.2.2:PORT'
// For local development with an iOS simulator or web, and when using expo tunnel, use 'http://localhost:PORT'
// For local development on a physical device, use your machine's local IP address
const API_URL = "http://192.168.1.81:8080/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor to add the token to every request if it exists
api.interceptors.request.use(
  async (config) => {
    // We will use AsyncStorage for now, but switch to SecureStore for production
    const token = await AsyncStorage.getItem("userToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
