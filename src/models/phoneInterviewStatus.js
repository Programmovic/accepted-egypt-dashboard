const mongoose = require("mongoose");

const phoneInterviewStatusSchema = new mongoose.Schema(
  {
    status: { type: String, required: true },
    description: { type: String },
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt fields
  }
);

module.exports =
  mongoose.models.PhoneInterviewStatus ||
  mongoose.model("PhoneInterviewStatus", phoneInterviewStatusSchema);
