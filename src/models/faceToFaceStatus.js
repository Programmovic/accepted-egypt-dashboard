const mongoose = require("mongoose");

const faceToFaceStatusSchema = new mongoose.Schema(
  {
    status: { type: String, required: true },
    description: { type: String },
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt fields
  }
);

module.exports =
  mongoose.models.FaceToFaceStatus ||
  mongoose.model("FaceToFaceStatus", faceToFaceStatusSchema);
