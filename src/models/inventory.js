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
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
    },
    assignedDate: {
      type: Date,
      default: Date.now,
    },
    history: [
      {
        employeeId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Employee",
          required: true,
        },
        assignedDate: {
          type: Date,
          required: true,
        },
        unassignedDate: {
          type: Date, // This will be updated when the item is unassigned
          default: null,
        },
      },
    ], // Add history field directly in the main schema
  },
  {
    timestamps: true,
  }
);

module.exports =
  mongoose.models.AssignedItem ||
  mongoose.model("AssignedItem", assignedItemSchema);
