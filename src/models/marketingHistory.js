const mongoose = require("mongoose");
const Admin = require("./admin"); // Import the Prospect model
const MarketingData = require("./Marketing"); // Import the Prospect model
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
      type: String,
      ref: "Admin", 
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
