import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
// import "./index.css"; // Cette ligne est maintenant inutile
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
