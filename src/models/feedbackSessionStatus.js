const mongoose = require("mongoose");

const feedbackSessionStatusSchema = new mongoose.Schema(
  {
    status: { type: String, required: true },
    description: { type: String },
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt fields
  }
);

module.exports =
  mongoose.models.FeedbackSessionStatus ||
  mongoose.model("FeedbackSessionStatus", feedbackSessionStatusSchema);
