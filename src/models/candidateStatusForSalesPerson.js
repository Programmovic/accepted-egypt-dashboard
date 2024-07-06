const mongoose = require("mongoose");

const candidateStatusForSalesPersonSchema = new mongoose.Schema(
  {
    status: { type: String, required: true, description: "" },
    description: { type: String, description: "" },
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt fields
  }
);

module.exports =
  mongoose.models.CandidateStatusForSalesPerson ||
  mongoose.model("CandidateStatusForSalesPerson", candidateStatusForSalesPersonSchema);
