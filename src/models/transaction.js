const mongoose = require('mongoose');
const Student = require('./student');
const Batch = require('./batch');
const PaymentMethod = require('./paymentMethod'); // Import the PaymentMethod model
const Level = require('./level'); // Import the PaymentMethod model
const PlacementTestSettings = require('./placement_test_settings'); // Import the PaymentMethod model

const transactionSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    description: 'The student associated with the transaction',
  },
  level: {
    type: String,
    ref: 'Level',
    description: 'The course or class related to the transaction',
  },
  placementTest: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PlacementTestSettings',
    description: 'The course or class related to the transaction',
  },
  batch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Batch',
    description: 'The course or class related to the transaction',
  },
  type: {
    type: String, // Paid, Received, Due, refund 
    required: true,
    description: 'The type of transaction (e.g., payment, refund, etc.)',
  },
  expense_type: {
    type: String,
    description: 'The type of transaction (e.g., payment, refund, etc.)',
  },
  amount: {
    type: Number,
    required: true,
    description: 'The amount of the transaction',
  },
  description: {
    type: String,
    description: 'Additional description or notes for the transaction',
  },
  createdByAdmin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
  },
  adminName: {
    type: String,
  },
  paymentMethod: { // Reference to PaymentMethod model
    type: String,
    description: 'The payment method used for the transaction',
  },
}, {
  timestamps: true, // Automatically manage createdAt and updatedAt fields
});

module.exports = mongoose.models.Transaction || mongoose.model('Transaction', transactionSchema);
