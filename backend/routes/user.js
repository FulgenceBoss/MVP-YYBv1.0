const express = require("express");
const router = express.Router();
const {
  updateUserProfile,
  savePushToken,
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

// Route to update user profile
router.route("/me").put(protect, updateUserProfile);

// Route to save push notification token
router.route("/save-push-token").post(protect, savePushToken);

module.exports = router;
