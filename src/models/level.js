const mongoose = require('mongoose');

const levelSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  // Add other fields as needed for your admin entity
},
  { timestamps: true });
module.exports = mongoose.models.Level || mongoose.model("Level", levelSchema);
