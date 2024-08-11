const mongoose = require("mongoose");
const MarketingDataHistory = require("./MarketingHistory");

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
    paymentMethod: {
      type: String,
      ref: "PaymentMethod",
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
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Assuming you have a User model
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
