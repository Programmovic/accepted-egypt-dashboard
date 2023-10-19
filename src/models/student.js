const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  // Add other student-related fields as needed
  groups: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group',
  }],
  cost: {
    type: Number,
    default: 0,
  },
  // Define a serial number field
  serialNumber: {
    type: Number,
    unique: true, // Ensure uniqueness
  },
});

// Check if the sequence is already defined for the model
if (!mongoose.models.Student) {
  // Add the AutoIncrement plugin to generate the serial number
  studentSchema.plugin(AutoIncrement, { id: 'custom_seqI', inc_field: 'serialNumber' });
}

module.exports = mongoose.models.Student || mongoose.model('Student', studentSchema);

