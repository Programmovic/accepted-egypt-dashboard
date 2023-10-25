const mongoose = require('mongoose');

const batchSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
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
  lab: {
    type: String,
    required: true,
  },
  lecturesTimes: [
    {
      type: String,
    },
  ],
  description: {
    type: String,
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.models.Batch || mongoose.model("Batch", batchSchema);
