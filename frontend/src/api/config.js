// This file is for local development configuration and should not be committed to Git.
// 1. Find your computer's local IP address.
//    - On Windows, open Command Prompt and type `ipconfig`. Look for the "IPv4 Address".
//    - On macOS, go to System Preferences > Network and find your IP address.
// 2. Replace the IP address below with your computer's local IP address.
// 3. Make sure your backend server is running on port 8080.

import { Platform } from "react-native";

// Mettez cette variable à true si vous utilisez `npx expo start --tunnel`
// const IS_IN_TUNNEL_MODE = true;

// Remplacez par votre IP locale pour les tests sur appareil physique sans tunnel
// const LOCAL_API_URL = "http://192.168.1.67:8080/api";

// L'URL de base est conditionnelle
// export const API_URL = IS_IN_TUNNEL_MODE ? "" : LOCAL_API_URL;

// --- CONFIGURATION DE L'API ---
// Choisissez UNE des deux configurations ci-dessous en fonction de votre situation.

// --- OPTION 1: Développement au bureau (Réseau local fiable) ---
// 1. Trouvez votre IP locale avec `ipconfig` ou dans les préférences réseau.
// 2. Décommentez la ligne ci-dessous et mettez votre IP.
// const API_BASE_URL = "http://192.168.1.67:8080";

// --- OPTION 2: Développement sur un réseau externe/restrictif (Hôtel, etc.) ---
// Utilisez `ngrok http 8080` ou `npx localtunnel --port 8080` dans un terminal.
// Copiez l'URL fournie et collez-la ci-dessous.
const API_BASE_URL = "https://tasty-dragons-sit.loca.lt";

// Ne pas modifier la ligne ci-dessous.
export const API_URL = `${API_BASE_URL}/api`;
