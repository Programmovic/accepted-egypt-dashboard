const mongoose = require('mongoose');


const instructorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
  },
  phoneNumber: {
    type: String,
  },
  picture: {
    type: String, // You can store the URL or file path of the picture
  },
  batch: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Batch',
  }],
  joinedDate: {
    type: Date,
    default: Date.now, // Set the default value to the current date
  },
  createdByAdmin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
  },
  adminName: {
    type: String,
  },
},
  {
    timestamps: true
  });

module.exports = mongoose.models.Instructor || mongoose.model("Instructor", instructorSchema);
