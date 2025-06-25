const express = require("express");
const router = express.Router();
const {
  updateUserProfile,
  savePushToken,
  updateUserAvatar,
  deleteUserAccount,
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");
const multer = require("../middleware/multer-config");

// Route to update user profile
router
  .route("/me")
  .put(protect, updateUserProfile)
  .delete(protect, deleteUserAccount);

// Route to save push notification token
router.route("/save-push-token").post(protect, savePushToken);

// @route   PUT api/users/me/avatar
// @desc    Update user avatar
// @access  Private
router.put("/me/avatar", protect, multer, updateUserAvatar);

module.exports = router;
