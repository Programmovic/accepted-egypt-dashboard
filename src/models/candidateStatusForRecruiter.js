const mongoose = require("mongoose");

const candidateStatusForRecruiterSchema = new mongoose.Schema(
  {
    status: { type: String, required: true, description: "" },
    description: { type: String, description: "" },
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt fields
  }
);

module.exports =
  mongoose.models.CandidateStatusForRecruiter ||
  mongoose.model("CandidateStatusForRecruiter", candidateStatusForRecruiterSchema);
