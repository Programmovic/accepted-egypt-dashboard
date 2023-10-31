const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  capacity: {
    type: Number,
  },
  location: {
    type: String,
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
  createdByAdmin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
  },
  adminName: {
    type: String,
  },
});

module.exports = mongoose.models.Room || mongoose.model('Room', roomSchema);
