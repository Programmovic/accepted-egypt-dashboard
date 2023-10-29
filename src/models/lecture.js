const mongoose = require('mongoose');

const lectureSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  status: {
    type: String,
    required: true,
  },
  batch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Batch',
  },
  hours: {
    type: Number,
    required: true,
  },
  cost: {
    type: Number,
    required: true,
  },
  limitTrainees: {
    type: Number,
    required: true,
    default: 0,
  },
  weeklyHours:
  {
    day: String, // Day of the week, e.g., "Monday"
    from: String, // Starting time, e.g., "09:00 AM"
    to: String, // Ending time, e.g., "11:00 AM"
  },
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
  },
  level: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Level',
  },
  levelName: {
    type: String,
  },
  description: {
    type: String,
  },
  date: {
    type: Date,
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.models.Lecture || mongoose.model("Lecture", lectureSchema);
