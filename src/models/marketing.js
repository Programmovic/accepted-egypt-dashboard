const mongoose = require("mongoose");
const MarketingDataHistory = require("./marketingHistory");

const Employee = require("./employee");
const SalesStatus = require("./salesStatus");
const CandidateSignUpFor = require("./candidateSignUpFor");
const CandidateStatusForSalesPerson = require("./candidateStatusForSalesPerson");
const PaymentMethod = require("./paymentMethod");
const TrainingLocation = require("./trainingLocation");
const PaymentScreenshotStatus = require("./paymentScreenshotStatus");
const PlacementTestSettings = require("./placementTestSettings");
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
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
    },
    assignationDate: {
      type: Date,
    },
    assignedToSales: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
    },
    salesStatus: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SalesStatus",
    },
    candidateSignUpFor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CandidateSignUpFor",
    },
    candidateStatusForSalesPerson: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CandidateStatusForSalesPerson",
    },
    paymentMethod: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PaymentMethod",
    },
    trainingLocation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TrainingLocation",
    },
    recieverNumber: {
      type: String,
    },
    referenceNumber: {
      type: String,
    },
    paymentScreenshotStatus: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PaymentScreenshotStatus",
    },
    paymentScreenshotDate: {
      type: String,
    },
    placementTest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PlacementTestSettings",
    },
    salesRejectionReason: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SalesRejectionReason",
    },
    salesMemberAssignationDate: {
      type: Date,
    },
    candidateStatusForRecruiter: {
      type: String,
    },
    phoneInterviewStatus: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PhoneInterviewStatus",
    },
    phoneInterviewDate: {
      type: String,
    },
    faceToFaceStatus: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FaceToFaceStatus",
    },
    faceToFaceDate: {
      type: String,
    },
    feedbackSessionStatus: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FeedbackSessionStatus",
    },
    feedbackSessionDate: {
      type: String,
    },
    testResultStatus: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FeedbackSessionStatus",
    },
    testResultDate: {
      type: String,
    },
    onBoardingName: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
    },
    recruiterName: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
    },
    placerName: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

// Pre hook to capture the original document before update
marketingDataSchema.pre("findOneAndUpdate", async function (next) {
  try {
    const docToUpdate = await this.model.findOne(this.getQuery());
    this._original = docToUpdate ? docToUpdate.toObject() : null;
    next();
  } catch (error) {
    next(error);
  }
});

// Post hook to create a history record after update
marketingDataSchema.post("findOneAndUpdate", async function (doc) {
  if (this._original) {
    const history = new MarketingDataHistory({
      marketingDataId: doc._id,
      oldData: this._original,
      newData: doc.toObject(),
      editedBy: doc.updatedBy, // Assuming you set updatedBy when updating the document
    });
    await history.save();
  }
});

module.exports =
  mongoose.models.MarketingData ||
  mongoose.model("MarketingData", marketingDataSchema);
