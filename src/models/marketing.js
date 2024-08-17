const mongoose = require("mongoose");
const MarketingDataHistory = require("./marketingHistory");
const Prospect = require("./prospect"); // Import the Prospect model
const Employee = require("./employee");
const SalesStatus = require("./salesStatus");
const CandidateSignUpFor = require("./candidateSignUpFor");
const CandidateStatusForSalesPerson = require("./candidateStatusForSalesPerson");
const PaymentMethod = require("./paymentMethod");
const TrainingLocation = require("./trainingLocation");
const PaymentScreenshotStatus = require("./paymentScreenshotStatus");
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
// Middleware to add a lead to the Prospect schema after saving if they're interested
marketingDataSchema.post("save", async function (doc, next) {
  const candidateStatus = doc.candidateStatusForSalesPerson;

  if (candidateStatus && candidateStatus.toLowerCase() === "interested") {
    const prospect = new Prospect({
      name: doc.name,
      phoneNumber: doc.phoneNo1,
      email: doc.email,
      nationalId: doc.nationalId,
      status: "Marketing Lead",
      source: "Marketing",
      marketingDataId: doc._id,
      interestedInCourse: doc.interestedInCourse, // Will be 'TBD' or empty initially
    });

    try {
      await prospect.save();
    } catch (error) {
      console.error("Error adding to prospect:", error);
    }
  }

  next(); // Call the next middleware in the chain
});

// Later, when the course of interest is determined after a placement test
async function updateProspectWithCourse(prospectId, courseId) {
  try {
    const prospect = await Prospect.findById(prospectId);
    if (prospect) {
      prospect.interestedInCourse = courseId; // Update with the actual course ID or name
      await prospect.save();
    }
  } catch (error) {
    console.error("Error updating prospect with course:", error);
  }
}

module.exports =
  mongoose.models.MarketingData ||
  mongoose.model("MarketingData", marketingDataSchema);
