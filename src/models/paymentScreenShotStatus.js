// models/paymentScreenshotStatus.js
const mongoose = require("mongoose");

const paymentScreenshotStatusSchema = new mongoose.Schema(
  {
    status: { type: String, required: true },
    description: { type: String },
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt fields
  }
);

module.exports =
  mongoose.models.PaymentScreenshotStatus ||
  mongoose.model("PaymentScreenshotStatus", paymentScreenshotStatusSchema);
