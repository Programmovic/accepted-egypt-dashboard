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
    enum: ['Attended', 'Absent', 'Late', 'Excused', "Not Assigned"], // Add more options as needed
  },
  remarks: {
    type: String,
  },
  // You can add more fields as needed, e.g., location, additional details, etc.
});

module.exports = mongoose.models.Attendance || mongoose.model('Attendance', attendanceSchema);
