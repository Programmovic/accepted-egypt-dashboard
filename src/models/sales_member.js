const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
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
}
  , {
    timestamps: true
  });

module.exports = mongoose.models.SalesMember || mongoose.model('SalesMember', employeeSchema);
