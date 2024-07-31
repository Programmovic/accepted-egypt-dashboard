// models/recruitmentTestResultStatus.js
const mongoose = require("mongoose");

const recruitmentTestResultStatusSchema = new mongoose.Schema(
  {
    status: { type: String, required: true },
    description: { type: String, default: "" },
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt fields
  }
);

module.exports =
  mongoose.models.RecruitmentTestResultStatus ||
  mongoose.model("RecruitmentTestResultStatus", recruitmentTestResultStatusSchema);
