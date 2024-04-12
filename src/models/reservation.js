const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  title: {
    type: String, 
  },
  date: {
    type: Date,
    required: true,
  },
  daysOfWeek: [String], // An array of days, e.g., ["Monday", "Wednesday"]
  startTime: {
    type: String, // Store time as a string, e.g., "09:00 AM"
    required: true,
  },
  endTime: {
    type: String, // Store time as a string, e.g., "11:00 AM"
    required: true,
  },
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
  },
  batch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Batch',
  },
  createdByAdmin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
  },
  adminName: {
    type: String,
  },
});
module.exports = mongoose.models.Reservation || mongoose.model('Reservation', reservationSchema);
