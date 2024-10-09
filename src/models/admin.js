const mongoose = require('mongoose');
const Employee = require("./employee"); // Import the Admin model

const adminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: 'admin',
  },
  dateOfJoin: {
    type: Date,
    default: Date.now,
  },
  token: {
    type: String, // Temporary token for password setup
  },
  tokenExpiration: {
    type: Date, // Expiration time for the token
  },
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee", // Reference to Admin model
    required: true, // Ensures that each employee has an admin
  },
  // Add other fields as needed for your admin entity
}, { timestamps: true });

module.exports = mongoose.models.Admin || mongoose.model("Admin", adminSchema);
