const mongoose = require('mongoose');

const prospectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  email: {
    type: String,
  },
  nationalId: {
    type: String,
  },
  interestedInCourse: {
    type: String,
  },
  status: {
    type: String, // Can be 'Marketing Lead' or 'Current Student'
    required: true,
  },
  level: {
    type: String,
  },
  source: {
    type: String, // e.g., Marketing, Progress Test, Exit Test
  },
  marketingDataId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MarketingData', // Link to the marketing data if applicable
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student', // Link to the student if applicable
  },
  addedDate: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.models.Prospect || mongoose.model('Prospect', prospectSchema);
