const mongoose = require("mongoose");
const Admin = require("./admin"); // Adjust the path as needed
const Student = require("./student"); // Adjust the path as needed

// Update the StudentHistory schema
const studentHistorySchema = new mongoose.Schema(
  {
    student: {
      type: String,
      ref: "Student",
      required: true,
    },
    changedBy: {
      type: String,
      ref: "Admin", // or 'SalesMember' or 'User' depending on who makes the changes
    },
    changeDate: {
      type: Date,
      default: Date.now,
    },
    changes: {
      type: Map,
      of: mongoose.Schema.Types.Mixed, // Allow storing objects in the map
    },
    action: {
      type: String, // e.g., "Updated", "Deleted"
      required: true,
    },
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.StudentHistory ||
  mongoose.model("StudentHistory", studentHistorySchema);
