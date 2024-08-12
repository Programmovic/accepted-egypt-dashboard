const mongoose = require("mongoose");
const Position = require("./position");
const Department = require("./department");
const employeeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    position: {
      type: String,
      required: true,
      ref: "Position", // Example reference to a moderation entity
    },
    department: {
      type: String,
      ref: "Department", // Example reference to a moderation entity
    },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    salary: {
      type: Number,
      required: true,
    },
    emergencyContact: {
      name: String,
      phoneNumber: String,
      relationship: String,
    },
    // Other fields as needed
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt fields
  }
);

module.exports =
  mongoose.models.Employee || mongoose.model("Employee", employeeSchema);
