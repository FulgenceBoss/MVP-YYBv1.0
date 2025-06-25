const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// Protect routes
const protect = async (req, res, next) => {
  let token;
  console.log("[DEBUG AUTH] Entrée dans le middleware 'protect'.");
  console.log("[DEBUG AUTH] Headers:", JSON.stringify(req.headers));

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(" ")[1];
      console.log("[DEBUG AUTH] Token extrait:", token);

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("[DEBUG AUTH] Token décodé:", decoded);

      // Get user from the token
      req.user = await User.findById(decoded.id).select("-pin");
      console.log(
        "[DEBUG AUTH] Utilisateur trouvé:",
        req.user ? req.user.id : "null"
      );

      next();
    } catch (error) {
      console.error("[DEBUG AUTH] ERREUR CATCH:", error.message);
      res
        .status(401)
        .json({ success: false, message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    console.log("[DEBUG AUTH] Aucun token trouvé dans les headers.");
    res
      .status(401)
      .json({ success: false, message: "Not authorized, no token" });
  }
};

module.exports = { generateToken, protect };
