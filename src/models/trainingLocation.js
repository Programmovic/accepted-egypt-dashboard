const mongoose = require("mongoose");

const trainingLocationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    address: { type: String},
    description: { type: String, description: "" },
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt fields
  }
);

module.exports =
  mongoose.models.TrainingLocation ||
  mongoose.model("TrainingLocation", trainingLocationSchema);
