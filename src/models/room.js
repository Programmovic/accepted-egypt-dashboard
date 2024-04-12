const mongoose = require('mongoose');
const Branch = require('./branch');


const roomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  capacity: {
    type: Number,
  },
  location: {
    type: mongoose.Schema.Types.ObjectId, // Reference to Branch model
    ref: 'Branch', // Referencing the Branch model
  },
  description: {
    type: String,
  },
  isReserved: {
    type: Boolean,
    default: false,
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
}, {
  timestamps: true, // Automatically manage createdAt and updatedAt fields
});

module.exports = mongoose.models.Room || mongoose.model('Room', roomSchema);
