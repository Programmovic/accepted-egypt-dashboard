const mongoose = require("mongoose");
import PlacementTestSettings from "./placement_test_settings";

const placementTestSchema = new mongoose.Schema({
  student: {
    type: String,
    ref: "Student", // Reference to the Student model
    required: true,
  },
  generalPlacementTest: {
    type: String,
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
    type: String,
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
