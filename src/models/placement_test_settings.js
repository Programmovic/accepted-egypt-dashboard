const mongoose = require('mongoose');

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
  createdAt: {
    type: Date, // Timestamp of when the placement test settings document was created
    default: Date.now, // Set the default value to the current date and time
  },
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Instructor',
  },
  createdByAdmin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
  },
  adminName: {
    type: String,
  },
  // You can add more fields based on your application's requirements
  // Example: testDate, location, maximumAttempts, etc.
});

module.exports = mongoose.models.PlacementTestSettings || mongoose.model('PlacementTestSettings', placementTestSettingsSchema);
