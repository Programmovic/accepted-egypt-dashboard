const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
  // You can add other fields as needed for your "Class" entity.
});

module.exports = mongoose.models.Class || mongoose.model("Class", classSchema);
