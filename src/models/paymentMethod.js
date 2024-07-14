const mongoose = require("mongoose");

const paymentMethodSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      description:
        "Type of payment method (e.g., Credit Card, Debit Card, E-Wallet, Bank Transfer)",
    },
    configuration: {
      bankAccountNumber: {
        type: [String],
        description: "Bank account number for Bank Transfer",
      },
      walletNumber: {
        type: [String],
        description: "Vodafone Cash number for Vodafone Cash",
      },
      // Add more fields as needed for other payment methods
    },
  },
  {
    timestamps: true,
  }
);

module.exports =
  mongoose.models.PaymentMethod ||
  mongoose.model("PaymentMethod", paymentMethodSchema);
