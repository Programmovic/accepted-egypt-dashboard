const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  lecture: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lecture',
    required: true,
  },
  trainee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trainee',
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: ['Attended', 'Absent', 'Late', 'Excused', 'Not Assigned'],
  },
  remarks: {
    type: String,
  },
  createdByAdmin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
  },
  adminName: {
    type: String,
  },
  // Other fields as needed
});

module.exports = mongoose.models.Attendance || mongoose.model('Attendance', attendanceSchema);
