const mongoose = require("mongoose");

const GoalSchema = new mongoose.Schema(
  {
    key: { type: String, required: true },
    icon: { type: String, required: true },
    name: { type: String, required: true },
    amount: { type: Number, required: true },
    bgColor: { type: String },
  },
  { _id: false }
);

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
    goal: {
      type: GoalSchema,
      required: false, // Not required immediately on user creation
    },
    dailyAmount: {
      type: Number,
      required: true,
      min: 100,
    },
    deductionTime: {
      type: String, // Format HH:mm en UTC
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

// We remove the old 'amount' field as it's replaced by 'dailyAmount'
SavingsConfigSchema.remove("amount");

module.exports = mongoose.model("SavingsConfig", SavingsConfigSchema);
