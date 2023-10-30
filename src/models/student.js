const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  email: {
    type: String,
  },
  nationalId: {
    type: String,
  },
  interestedInCourse: {
    type: String,
  },
  status: {
    type: String,
    default: "Just Registered"
  },
  paid: {
    type: Number,
    default: 0,
  },
  level: {
    type: String,
  },
  waitingList: {
    type: Boolean,
    default: false,
  },
  placementTest: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PlacementTest'
  },
  batch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Batch'
  },
  placementTestDate: {
    type: Date,
  },
  due: {
    type: Number,
    default: 0,
  },
  joinedDate: {
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


module.exports = mongoose.models.Student || mongoose.model('Student', studentSchema);
