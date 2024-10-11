const mongoose = require("mongoose");
const StudentHistory = require("./studentHistory"); // Adjust the path as needed
const ElsaAccount = require("./ElsaAccount"); // Adjust the path as needed

const studentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    email: { type: String },
    nationalId: { type: String },
    interestedInCourse: { type: String },
    status: { type: String, default: "Just Registered" },
    paid: { type: Number, default: 0 },
    level: { type: String },
    waitingList: { type: Boolean, default: false },
    placementTest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PlacementTest",
    },
    elsaAccount: {
      type: String,
      ref: "ElsaAccount",
    },
    batch: { type: mongoose.Schema.Types.ObjectId, ref: "Batch" },
    placementTestDate: { type: Date },
    due: { type: Number, default: 0 },
    balance: { type: Number, default: 0 },
    joinedDate: { type: Date, default: Date.now },
    createdByAdmin: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
    adminName: { type: String },
    salesMember: { type: mongoose.Schema.Types.ObjectId, ref: "SalesMember" },
  },
  { timestamps: true }
);

// Middleware to track changes and store them in StudentHistory
studentSchema.pre("findOneAndUpdate", async function (next) {
  const query = this; // `this` is the query
  const Student = mongoose.model("Student");

  // Fetch the original document before the update
  const original = await Student.findOne(query.getQuery());

  if (!original) {
    return next(); // If no original document is found, proceed without tracking changes
  }

  const changes = {};
  const updatedData = this.getUpdate();

  // Compare each field and detect changes
  original.schema.eachPath((path) => {
    if (
      updatedData[path] !== undefined &&
      updatedData[path] !== original[path]
    ) {
      changes[path] = { oldValue: original[path], newValue: updatedData[path] };
    }
  });

  // If there are changes, create a new StudentHistory entry
  if (Object.keys(changes).length > 0) {
    await StudentHistory.create({
      student: original._id,
      changes: changes,
      changedBy: original.createdByAdmin, // Assume admin is modifying
      changeDate: new Date(),
      action: "Updated",
    });
  }

  next();
});

module.exports =
  mongoose.models.Student || mongoose.model("Student", studentSchema);
