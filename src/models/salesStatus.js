const mongoose = require("mongoose");

const salesStatusSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      required: true,
      description:
        "Status of the sale (e.g., Pending, Completed, Cancelled, Refunded)",
    },
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt fields
  }
);

module.exports =
  mongoose.models.SalesStatus ||
  mongoose.model("SalesStatus", salesStatusSchema);
