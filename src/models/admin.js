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
    ref: "Employee",
  },
  isOnline: {
    type: Boolean, // Tracks whether the admin is online or offline
    default: false, // Default is offline
  },
  lastActive: {
    type: Date, // To track the last time the admin was active
  },
}, { timestamps: true });

module.exports = mongoose.models.Admin || mongoose.model("Admin", adminSchema);
