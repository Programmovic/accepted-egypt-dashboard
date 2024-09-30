const mongoose = require("mongoose");
import Student from "./student";
import Admin from "./admin";
import PaymentMethod from "./paymentMethod";

const elsaAccountSchema = new mongoose.Schema(
  {
    student: {
      type: String,
      ref: "Student",
    },
    email: {
      type: String,
    },
    subscriptionStatus: {
      type: String, // active, inactive, canceled, etc.
      required: true,
      default: "active",
    },
    subscriptionStartDate: {
      type: Date,
    },
    subscriptionEndDate: {
      type: Date,
    },
    monthlyCost: {
      type: Number, 
    },
    createdByAdmin: {
      type: String,
      ref: "Admin", // Reference to the Admin model
    },
    adminName: {
      type: String,
    },
    paymentDetails: {
      lastPaymentDate: {
        type: Date,
      },
      nextPaymentDate: {
        type: Date,
      },
      paymentMethod: {
        type: String,
        ref: "PaymentMethod", // Reference to the Admin model
      },
    },
    comment: {
      type: String,
    },
    history: [
      {
        student: {
          type: String,
          ref: "Student", // Reference to the student
        },
        subscriptionPeriod: {
          startDate: {
            type: Date,
          },
          endDate: {
            type: Date,
          },
        },
        monthlyCost: {
          type: Number,
        },
        assignedAt: {
          type: Date, // Date when this history record was created/assigned
          default: Date.now,
        },
      }
    ],
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.ElsaAccount ||
  mongoose.model("ElsaAccount", elsaAccountSchema);
