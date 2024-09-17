const mongoose = require("mongoose");

// Create a schema for Progress and Exit tests
const assessmentSchema = new mongoose.Schema(
  {
    assessmentType: {
      type: String, // Assessment type (e.g., Progress, Exit)
      required: true,
    },
    batch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Batch",
    },
    classLevel: {
      type: String, // Class level
      required: true,
    },
    classCode: {
      type: String, // Class code
      required: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
    },
    name: {
      type: String, // Name of the student
      required: true,
    },
    phoneNumber: {
      type: String, // Phone number
    },
    attendanceStatus: {
      type: String, // Attendance status (e.g., Present, Absent)
    },
    attendanceDate: {
      type: Date, // Timestamp of when the assessment document was created
      default: Date.now, // Set the default value to the current date and time
    },
    assessmentFeedback: {
      type: String, // Assessment feedback
    },
    movedToHigherLevel: {
      type: Boolean, // Specify if moved to a higher level
    },
    newLevel: {
      type: String, // New level the student moved to
    },
    stayAtTheSame: {
      type: Boolean, // Specify if staying at the same level
    },
    languageComment: {
      type: String, // Language comment
    },
    languageFeedback: {
      type: String, // Language feedback
    },
    date: {
      type: Date, // Timestamp of when the assessment document was created
      default: Date.now, // Set the default value to the current date and time
    },
    levelPaidAmount: {
      type: Number,
      default: 0,
    },
    levelDiscount: {
      type: Number,
      default: 0,
    },
    isLevelFullPayment: {
      type: Boolean,
      default: false,
    },
    levelPaidRemainingAmount: {
      type: Number,
      default: 0,
    },
    newAssignedBatch: {
      type: String,
      ref: "Batch", // Reference to the Batch model
    },
  },
  {
    timestamps: true,
  }
);

module.exports =
  mongoose.models.Assessment || mongoose.model("Assessment", assessmentSchema);
