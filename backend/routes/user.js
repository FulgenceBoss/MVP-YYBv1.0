const express = require("express");
const router = express.Router();
const { savePushToken } = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

// @route   POST /api/users/save-push-token
router.post("/save-push-token", protect, savePushToken);

module.exports = router;
