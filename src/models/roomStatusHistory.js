const mongoose = require("mongoose");
const Room = require('./room');
const Admin = require('./admin');

const roomStatusHistorySchema = new mongoose.Schema(
  {
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: true,
    },
    status: {
      type: String,
      enum: ["disabled", "enabled"],
      required: true,
    },
    changedAt: {
      type: Date,
      default: Date.now,
    },
    changedByAdmin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.models.RoomStatusHistory || mongoose.model("RoomStatusHistory", roomStatusHistorySchema);

