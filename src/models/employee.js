const mongoose = require("mongoose");
const Position = require("./position");
const Department = require("./department");
const Admin = require("./admin"); // Import the Admin model

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
      type: mongoose.Schema.Types.ObjectId,
      ref: "Position", // Reference to Position model
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department", // Reference to Department model
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
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin", // Reference to Admin model
      required: true, // Ensures that each employee has an admin
    },
    // Other fields as needed
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt fields
  }
);

module.exports =
  mongoose.models.Employee || mongoose.model("Employee", employeeSchema);
