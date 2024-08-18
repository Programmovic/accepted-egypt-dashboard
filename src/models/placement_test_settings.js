const mongoose = require('mongoose');
import Employee from './employee';

const placementTestSettingsSchema = new mongoose.Schema({
  cost: {
    type: Number, // Cost associated with taking the placement test
  },
  instructions: {
    type: String, // Any special instructions for the test
  },
  date: {
    type: Date, // Date of the placement test settings
  },
  startTime: {
    type: String, // Store time as a string, e.g., "09:00 AM"
    required: true,
  },
  endTime: {
    type: String, // Store time as a string, e.g., "11:00 AM"
    required: true,
  },
  limitTrainees: {
    type: Number,
    required: true,
    default: 0,
  },
  createdAt: {
    type: Date, // Timestamp of when the placement test settings document was created
    default: Date.now, // Set the default value to the current date and time
  },
  room: {
    type: String,
    ref: 'Room',
  },
  instructor: {
    type: String,
    ref: 'Employee',
  },
  createdByAdmin: {
    type: String,
    ref: 'Admin',
  },
  adminName: {
    type: String,
  },
  studentCount: {
    type: Number,
    default: 0,
  }
  // You can add more fields based on your application's requirements
  // Example: testDate, location, maximumAttempts, etc.
},
  {
    timestamps: true
  });

module.exports = mongoose.models.PlacementTestSettings || mongoose.model('PlacementTestSettings', placementTestSettingsSchema);
