const mongoose = require('mongoose');

const waitingListSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student', // Reference to the Student model
    required: true,
  },
  studentName: {
    type: String,
    required: true,
  },
  studentNationalID: {
    type: String,
  },
  assignedLevel: {
    type: String,
  },
  isArchived: {
    type: Boolean,
    default: false,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  createdByAdmin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
  },
  adminName: {
    type: String,
  },
  // You can add other waiting list fields here
  // Example: priority, reason, etc.
});

module.exports = mongoose.models.WaitingList || mongoose.model('WaitingList', waitingListSchema);
