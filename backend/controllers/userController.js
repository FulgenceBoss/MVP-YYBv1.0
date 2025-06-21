const User = require("../models/User");

// @desc    Save Expo Push Token
// @route   POST /api/users/save-push-token
// @access  Private
const savePushToken = async (req, res) => {
  const { token } = req.body;
  const userId = req.user.id; // From protect middleware

  if (!token) {
    return res
      .status(400)
      .json({ success: false, message: "Push token is required" });
  }

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    user.pushToken = token;
    await user.save();

    res
      .status(200)
      .json({ success: true, message: "Push token saved successfully" });
  } catch (error) {
    console.error("Error saving push token:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

module.exports = {
  savePushToken,
};
