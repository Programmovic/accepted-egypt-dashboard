const mongoose = require("mongoose");

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
      ref: "Employee", // Example reference to a moderation entity
    },
    assignationDate: {
      type: Date,
    },
    assignedToSales: {
      type: String,
      ref: "Employee", // Example reference to a senior sales entity
    },
    salesStatus: {
      type: String,
      ref: "SalesStatus", // Example reference to a senior sales entity
    },
    candidateSignUpFor: {
      type: String,
      ref: "CandidateSignUpFor", // Example reference to a senior sales entity
    },
    candidateStatusForSalesPerson: {
      type: String,
      ref: "CandidateStatusForSalesPerson", // Example reference to a senior sales entity
    },
    paymentScreenshotStatus: {
      type: String,
      ref: "PaymentScreenshotStatus", // Example reference to a senior sales entity
    },
    salesRejectionReason: {
      type: String,
      ref: "SalesRejectionReason", // Example reference to a senior sales entity
    },
    salesMemberAssignationDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

module.exports =
  mongoose.models.MarketingData ||
  mongoose.model("MarketingData", marketingDataSchema);
