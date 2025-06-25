const User = require("../models/User");
const asyncHandler = require("express-async-handler");
const cloudinary = require("../config/cloudinary");
const Datauri = require("datauri");
const path = require("path");

// @desc    Update user profile
// @route   PUT /api/users/me
// @access  Private
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (user) {
      user.fullName = req.body.fullName || user.fullName;

      await user.save();

      // On renvoie l'objet utilisateur complet (sans le PIN) pour une mise à jour fluide du frontend
      const userToReturn = await User.findById(req.user.id).select("-pin");

      res.status(200).json({
        success: true,
        user: userToReturn,
      });
    } else {
      res.status(404);
      throw new Error("User not found");
    }
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message });
  }
};

// @desc    Save Expo Push Token
// @route   POST /api/users/save-push-token
// @access  Private
const savePushToken = async (req, res) => {
  const { token } = req.body;
  if (!token) {
    return res
      .status(400)
      .json({ success: false, message: "Token is required" });
  }

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    user.pushToken = token;
    await user.save();
    res.json({ success: true, message: "Push token saved successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message });
  }
};

// @desc    Update user avatar
// @route   PUT /api/users/me/avatar
// @access  Private
const updateUserAvatar = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error("Veuillez fournir une image.");
  }

  // Création manuelle et robuste du Data URI
  const b64 = Buffer.from(req.file.buffer).toString("base64");
  const dataURI = "data:" + req.file.mimetype + ";base64," + b64;

  try {
    const result = await cloudinary.uploader.upload(dataURI, {
      folder: "yessi-yessi-avatars",
      public_id: `avatar_${req.user.id}`,
      overwrite: true,
    });

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { avatarUrl: result.secure_url },
      { new: true }
    ).select("-pin");

    if (!updatedUser) {
      res.status(404);
      throw new Error("Utilisateur non trouvé.");
    }

    res.status(200).json({
      success: true,
      message: "Avatar mis à jour avec succès.",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    res.status(500);
    throw new Error("Erreur lors de l'upload de l'image.");
  }
});

module.exports = {
  updateUserProfile,
  savePushToken,
  updateUserAvatar,
};
