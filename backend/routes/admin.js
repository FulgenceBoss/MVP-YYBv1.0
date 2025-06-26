const express = require("express");
const router = express.Router();
const { loginAdmin } = require("../controllers/adminController");

// @route   POST /api/admin/login
// @desc    Authenticate admin user and return token
// @access  Public
router.post("/login", loginAdmin);

module.exports = router;
