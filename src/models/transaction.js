const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    description: 'The student associated with the transaction',
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
  amount: {
    type: Number,
    required: true,
    description: 'The amount of the transaction',
  },
  description: {
    type: String,
    description: 'Additional description or notes for the transaction',
  }
}, {
  timestamps: true, // Automatically manage createdAt and updatedAt fields
});

module.exports = mongoose.models.Transaction || mongoose.model('Transaction', transactionSchema);
