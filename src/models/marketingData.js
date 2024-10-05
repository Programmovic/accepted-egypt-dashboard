const mongoose = require("mongoose");
const Level = require("./level"); // Import Level model
const PendingPayment = require("./pendingLeadPayment"); // Import PendingPayment model
const Batch = require("./batch");
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
      default: "TBD",
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
    phoneInterviewComment: {
      type: String,
      default: "", // Optional default empty comment
    },
    faceToFaceStatus: {
      type: String,
      ref: "FaceToFaceStatus",
    },
    faceToFaceDate: {
      type: String,
    },
    faceToFaceComment: {
      type: String,
      default: "", // Optional default empty comment
    },
    feedbackSessionStatus: {
      type: String,
      ref: "FeedbackSessionStatus",
    },
    feedbackSessionDate: {
      type: String,
    },
    feedbackSessionComment: {
      type: String,
      default: "", // Optional default empty comment
    },
    testResultStatus: {
      type: String,
    },
    testResultDate: {
      type: String,
    },
    testResultComment: {
      type: String,
      default: "", // Optional default empty comment
    },
    companyInterviewStatus: {
      type: String,
    },
    companyInterviewDate: {
      type: String,
    },
    companyInterviewComment: {
      type: String,
      default: "", // Optional default empty comment
    },
    companyCommission: {
      type: Number,
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
    placementTestPaidAmount: {
      type: Number,
      default: 0,
    },
    placementTestDiscount: {
      type: Number,
      default: 0,
    },
    placementTestAmountAfterDiscount: {
      type: Number,
      default: 0,
    },
    assignedLevel: {
      type: String,
      ref: "Level", // Reference to the Level model
    },
    assignedLevelComment: {
      type: String,
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
    assignedBatch: {
      type: String,
      ref: "Batch", // Reference to the Level model
    },
    verificationStatus: {
      type: String,
      enum: ["Pending", "Verified", "Rejected"],
      default: "Pending",
    },
    pendingPayments: [
      {
        type: String,
        ref: "PendingPayment",
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports =
  mongoose.models.MarketingData ||
  mongoose.model("MarketingData", marketingDataSchema);
