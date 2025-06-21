// This file is for local development configuration and should not be committed to Git.
// 1. Find your computer's local IP address.
//    - On Windows, open Command Prompt and type `ipconfig`. Look for the "IPv4 Address".
//    - On macOS, go to System Preferences > Network and find your IP address.
// 2. Replace the IP address below with your computer's local IP address.
// 3. Make sure your backend server is running on port 8080.

const API_BASE_URL = "http://192.168.1.86:8080"; // <-- IMPORTANT: CHANGE THIS IP

export const API_URL = `${API_BASE_URL}/api`;
