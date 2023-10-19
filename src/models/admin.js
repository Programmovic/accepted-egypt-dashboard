const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: 'admin',
  },
  dateOfJoin: {
    type: Date,
    default: Date.now,
  },
  // Add other fields as needed for your admin entity
});
module.exports = mongoose.models.Admin || mongoose.model("Admin", adminSchema);
