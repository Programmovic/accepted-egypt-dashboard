// models/salesRejectionReason.js

const mongoose = require("mongoose");

const salesRejectionReasonSchema = new mongoose.Schema(
  {
    reason: {
      type: String,
      required: true,
      description: "Reason for the sales rejection (e.g., Customer unavailable, Wrong product)",
    },
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt fields
  }
);

module.exports =
  mongoose.models.SalesRejectionReason ||
  mongoose.model("SalesRejectionReason", salesRejectionReasonSchema);
