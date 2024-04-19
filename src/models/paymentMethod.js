const mongoose = require("mongoose");

const paymentMethodSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      description:
        "Type of payment method (e.g., Credit Card, Debit Card, E-Wallet, Bank Transfer)",
    },
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt fields
  }
);

module.exports =
  mongoose.models.PaymentMethod ||
  mongoose.model("PaymentMethod", paymentMethodSchema);
