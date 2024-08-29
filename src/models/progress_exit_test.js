const mongoose = require('mongoose');

// Create a schema for Progress and Exit tests
const assessmentSchema = new mongoose.Schema({
  assessmentType: {
    type: String, // Assessment type (e.g., Progress, Exit)
    required: true,
  },
  batch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Batch',
  },
  classLevel: {
    type: String, // Class level
    required: true,
  },
  classCode: {
    type: String, // Class code
    required: true,
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
  },
  name: {
    type: String, // Name of the student
    required: true,
  },
  phoneNumber: {
    type: String, // Phone number
  },
  attendanceStatus: {
    type: String, // Attendance status (e.g., Present, Absent)
  },
  attendanceDate: {
    type: Date, // Timestamp of when the assessment document was created
    default: Date.now, // Set the default value to the current date and time
  },
  assessmentFeedback: {
    type: String, // Assessment feedback
  },
  movedToHigherLevel: {
    type: Boolean, // Specify the level if moved to a higher level
  },
  newLevel:{
    type: String, // Assessment feedback
  },
  stayAtTheSame: {
    type: Boolean, // Specify the level if moved to a higher level
  },
  languageComment: {
    type: String, // Language comment
  },
  languageFeedback: {
    type: String, // Language feedback
  },
  date: {
    type: Date, // Timestamp of when the assessment document was created
    default: Date.now, // Set the default value to the current date and time
  },
  // Add more fields as needed for your application
}, {
  timestamps: true
});

module.exports = mongoose.models.Assessment || mongoose.model('Assessment', assessmentSchema);
