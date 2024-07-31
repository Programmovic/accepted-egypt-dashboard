const mongoose = require("mongoose");

// Define a schema for tracking the history of changes to the MarketingData schema
const marketingDataHistorySchema = new mongoose.Schema(
  {
    marketingDataId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MarketingData",
      required: true,
    },
    oldData: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    newData: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    editedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Assuming you have a User model to track who made the change
      required: true,
    },
    editedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports =
  mongoose.models.MarketingDataHistory ||
  mongoose.model("MarketingDataHistory", marketingDataHistorySchema);
