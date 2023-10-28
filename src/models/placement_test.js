const mongoose = require('mongoose');

const placementTestSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student', // Reference to the Student model
    required: true,
  },
  generalPlacementTest: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PlacementTest', // Reference to the Student model
    required: true,
  },
  studentName: {
    type: String, // Reference to the Student model
    required: true,
  },
  assignedLevel: {
    type: String,
  },
  status: {
    type: String, // Reference to the Student model
    required: true,
  },
  studentNationalID: {
    type: String, // Reference to the Student model
    required: true,
  },
  cost: {
    type: Number, // Cost associated with taking the placement test
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  // Add other placement test fields here
  // Example: testScore, examiner, etc.
});

module.exports = mongoose.models.PlacementTest || mongoose.model('PlacementTest', placementTestSchema);
