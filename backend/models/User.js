const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema(
  {
    phoneNumber: {
      type: String,
      required: [true, "Please add a phone number"],
      unique: true,
      // Regex to validate a Gabonese phone number format (e.g., 06xxxxxxx, 07xxxxxxx)
      match: [
        /^(06|07)\d{7}$/,
        "Please add a valid Gabonese phone number starting with 06 or 07",
      ],
    },
    fullName: {
      type: String,
      required: false, // Will be set during OTP verification
    },
    pin: {
      type: String,
      required: false, // Not required on initial creation
      select: false, // Do not return pin by default on queries
    },
    verificationStatus: {
      type: String,
      enum: ["pending", "verified"],
      default: "pending",
    },
    otpCode: String,
    otpExpiry: Date,
    savingsBalance: {
      type: Number,
      default: 0,
    },
    pushToken: {
      type: String,
      default: null, // To store the Expo Push Token
    },
    // You can add more fields for savings configuration later
    // savingAmount: Number,
    // savingTime: String,
    // savingStatus: { type: String, enum: ['active', 'paused'], default: 'paused' }
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

// Encrypt PIN using bcrypt before saving
UserSchema.pre("save", async function (next) {
  if (!this.isModified("pin")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.pin = await bcrypt.hash(this.pin, salt);
});

// Method to match entered PIN to hashed PIN in database
UserSchema.methods.matchPin = async function (enteredPin) {
  return await bcrypt.compare(enteredPin, this.pin);
};

module.exports = mongoose.model("User", UserSchema);
