const mongoose = require("mongoose");
const MarketingDataHistory = require("./marketingHistory");
const Prospect = require("./prospect"); // Import the Prospect model
const Employee = require("./employee");
const SalesStatus = require("./salesStatus");
const CandidateSignUpFor = require("./candidateSignUpFor");
const CandidateStatusForSalesPerson = require("./candidateStatusForSalesPerson");
const PaymentMethod = require("./paymentMethod");
const TrainingLocation = require("./trainingLocation");
const PaymentScreenshotStatus = require("./paymentScreenShotStatus");
const PlacementTestSettings = require("./placement_test_settings");
const SalesRejectionReason = require("./salesRejectionReason");
const PhoneInterviewStatus = require("./phoneInterviewStatus");
const FaceToFaceStatus = require("./faceToFaceStatus");
const FeedbackSessionStatus = require("./feedbackSessionStatus");

const marketingDataSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phoneNo1: {
      type: String,
      required: true,
    },
    phoneNo2: {
      type: String,
    },
    nationalId: {
      type: String,
    },
    assignTo: {
      type: String,
    },
    chatSummary: {
      type: String,
    },
    source: {
      type: String,
    },
    languageIssues: {
      type: String,
    },
    assignedToModeration: {
      type: String,
      ref: "Employee",
    },
    assignationDate: {
      type: Date,
    },
    assignedToSales: {
      type: String,
      ref: "Employee",
    },
    salesStatus: {
      type: String,
      ref: "SalesStatus",
    },
    candidateSignUpFor: {
      type: String,
      ref: "CandidateSignUpFor",
    },
    candidateStatusForSalesPerson: {
      type: String,
      ref: "CandidateStatusForSalesPerson",
    },
    interestedInCourse: {
      type: String,
      default: "TBD", // "TBD" (To Be Determined) or leave empty if you prefer
    },
    paymentMethod: {
      type: String,
      ref: "PaymentMethod",
    },
    trainingLocation: {
      type: String,
      ref: "TrainingLocation",
    },
    recieverNumber: {
      type: String,
    },
    referenceNumber: {
      type: String,
    },
    paymentScreenshotStatus: {
      type: String,
      ref: "PaymentScreenshotStatus",
    },
    paymentScreenshotDate: {
      type: String,
    },
    placementTest: {
      type: String,
      ref: "PlacementTestSettings",
    },
    salesRejectionReason: {
      type: String,
      ref: "SalesRejectionReason",
    },
    salesMemberAssignationDate: {
      type: Date,
    },
    candidateStatusForRecruiter: {
      type: String,
    },
    phoneInterviewStatus: {
      type: String,
      ref: "PhoneInterviewStatus",
    },
    phoneInterviewDate: {
      type: String,
    },
    faceToFaceStatus: {
      type: String,
      ref: "FaceToFaceStatus",
    },
    faceToFaceDate: {
      type: String,
    },
    feedbackSessionStatus: {
      type: String,
      ref: "FeedbackSessionStatus",
    },
    feedbackSessionDate: {
      type: String,
    },
    testResultStatus: {
      type: String,
      ref: "FeedbackSessionStatus",
    },
    testResultDate: {
      type: String,
    },
    onBoardingName: {
      type: String,
      ref: "Employee",
    },
    recruiterName: {
      type: String,
      ref: "Employee",
    },
    placerName: {
      type: String,
      ref: "Employee",
    },
    updatedBy: {
      type: String,
      ref: "User",
    },
    paidAmount: {
      type: Number,
      default: 0, // Default value can be set to 0 or adjust as needed
    },
    verificationStatus: {
      type: String,
      enum: ["Pending", "Verified", "Rejected"], // Enum to limit values
      default: "Pending", // Default status
    },
  },
  {
    timestamps: true,
  }
);

module.exports =
  mongoose.models.MarketingData ||
  mongoose.model("MarketingData", marketingDataSchema);
