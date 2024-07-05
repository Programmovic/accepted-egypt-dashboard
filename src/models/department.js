// models/department.js
const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      description: "Name of the department",
    },
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt fields
  }
);

module.exports = mongoose.models.Department || mongoose.model('Department', departmentSchema);
