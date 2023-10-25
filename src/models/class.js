const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  code: {
    type: String,
  },
  description: {
    type: String,
  },
  cost: {
    type: Number,
    required: true,
  },
  hours: {
    type: Number,
    required: true,
  },
  instructors: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Instructor',
  },

  createdDate: {
    type: Date,
    default: Date.now,
  },
  // You can add other fields as needed for your "Class" entity.
});

module.exports = mongoose.models.Class || mongoose.model("Class", classSchema);
