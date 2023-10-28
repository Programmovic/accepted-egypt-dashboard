const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  capacity: {
    type: Number,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  isReserved: {
    type: Boolean,
    default: false, // Initialize as not reserved
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.models.Room || mongoose.model('Room', roomSchema);
