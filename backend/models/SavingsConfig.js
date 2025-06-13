const mongoose = require("mongoose");

const SavingsConfigSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    operator: {
      type: String,
      required: true,
      enum: ["Moov", "Airtel"],
    },
    amount: {
      type: Number,
      required: true,
      min: 100,
      max: 5000,
    },
    deductionTime: {
      type: String, // Format HH:mm ou ISO string
      required: true,
    },
    wallet: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          // Simple validation: doit être un numéro de téléphone gabonais (ex: 06xxxxxxx)
          return /^0[12567]\d{7}$/.test(v);
        },
        message: (props) =>
          `${props.value} n'est pas un numéro de wallet valide !`,
      },
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("SavingsConfig", SavingsConfigSchema);
