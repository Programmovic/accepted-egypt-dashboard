const mongoose = require("mongoose");
import PlacementTestSettings from "./PlacementTestSettings";

const placementTestSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student", // Reference to the Student model
    required: true,
  },
  generalPlacementTest: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PlacementTest", // Reference to the Student model
    required: true,
  },
  studentName: {
    type: String, // Reference to the Student model
    required: true,
  },
  assignedLevel: {
    type: String,
  },
  status: {
    type: String, // Reference to the Student model
    required: true,
  },
  studentNationalID: {
    type: String,
  },
  studentPhoneNumber: {
    type: String,
  },
  cost: {
    type: Number, // Cost associated with taking the placement test
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  createdByAdmin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
  },
  adminName: {
    type: String,
  },
  // Add other placement test fields here
  // Example: testScore, examiner, etc.
});
placementTestSchema.post("save", async function (doc) {
  await PlacementTestSettings.findByIdAndUpdate(doc.generalPlacementTest, {
    $inc: { studentCount: 1 },
  });
});
module.exports =
  mongoose.models.PlacementTest ||
  mongoose.model("PlacementTest", placementTestSchema);
