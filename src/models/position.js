const mongoose = require('mongoose');

const positionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      description: "Name of the position",
    },
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt fields
  }
);

module.exports = mongoose.models.Position || mongoose.model('Position', positionSchema);
