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
  lectureSchedule: [
    {
      day: {
        type: String, // You can use a specific type for days (e.g., 'Monday', 'Tuesday')
        required: true,
      },
      time: {
        type: String, // You can use a specific type for clock times (e.g., '09:00 AM')
        required: true,
      },
    },
  ],
  lab: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.models.Lecture || mongoose.model("Lecture", lectureSchema);
