const mongoose = require('mongoose');
const Employee = require('./employee');


const branchSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  manager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
  },
  // Other fields as needed
}, {
  timestamps: true // Automatically manage createdAt and updatedAt fields
});

module.exports = mongoose.models.Branch || mongoose.model('Branch', branchSchema);
