const mongoose = require('mongoose');
const Level = require('./level');
const Room = require('./Room');
const Class = require('./Class');

const batchSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  code: {
    type: String,
  },
  class: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
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
  shouldStartAt: {
    type: Date,
    default: Date.now,
  },
  shouldEndAt: {
    type: Date,
    default: Date.now,
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
  weeklyHours: [
    {
      day: String, // Day of the week, e.g., "Monday"
      from: String, // Starting time, e.g., "09:00 AM"
      to: String, // Ending time, e.g., "11:00 AM"
    }
  ],
  description: {
    type: String,
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
  createdByAdmin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
  },
  adminName: {
    type: String,
  },
});

module.exports = mongoose.models.Batch || mongoose.model('Batch', batchSchema);
