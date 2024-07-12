const mongoose = require("mongoose");

const assignedItemSchema = new mongoose.Schema(
  {
    itemName: {
      type: String,
      required: true,
    },
    itemCategory: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee", // Reference to the Employee model (replace with your actual employee model name)
      required: true,
    },
    assignedDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports =
  mongoose.models.AssignedItem ||
  mongoose.model("AssignedItem", assignedItemSchema);
