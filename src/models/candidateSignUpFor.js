const mongoose = require("mongoose");

const candidateSignUpForSchema = new mongoose.Schema(
  {
    order: { type: Number },
    status: {
      type: String,
      required: true,
      description:
        "",
    },
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt fields
  }
);

module.exports =
  mongoose.models.CandidateSignUpFor ||
  mongoose.model("CandidateSignUpFor", candidateSignUpForSchema);
