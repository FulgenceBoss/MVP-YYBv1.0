const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

// @desc    Authenticate admin
// @route   POST /api/admin/login
// @access  Public
const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Récupérer les identifiants depuis les variables d'environnement
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    res.status(500);
    throw new Error(
      "Les identifiants d'administration ne sont pas configurés sur le serveur."
    );
  }

  // Vérifier les identifiants
  if (email === adminEmail && password === adminPassword) {
    // Créer un token JWT spécifique pour l'admin
    const token = jwt.sign({ role: "admin" }, process.env.JWT_SECRET, {
      expiresIn: "8h", // Une durée de session plus courte pour la sécurité
    });

    res.json({
      success: true,
      token: token,
    });
  } else {
    res.status(401);
    throw new Error("Identifiants d'administration invalides.");
  }
});

module.exports = {
  loginAdmin,
};
