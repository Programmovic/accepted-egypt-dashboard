import connectDB from "@lib/db";
import Reservation from "../../../models/reservation";
import Batch from "../../../models/batch"; // Import the Batch model
import mongoose from "mongoose";

export default async (req, res) => {
  await connectDB();

  if (req.method === "POST") {
    // Handle POST request (if applicable)
  } else if (req.method === "GET") {
    // Handle fetching all reservations with optional filters
    try {
      const { room, instructor } = req.query;

      let query = {};

      // Add filter by room if provided
      if (room) {
        query.room = new mongoose.Types.ObjectId(room); // Use `new` with `ObjectId`
      }
      const batch = await Batch.find({ instructor: query.instructor });
      console.log(batch);
      // Add filter by instructor if provided
      if (instructor) {
        query["batch"] = new mongoose.Types.ObjectId(batch._id); // Use `new` with `ObjectId`
      }

      const allReservations = await Reservation.find(query)
        .populate({
          path: "batch",
          populate: {
            path: "instructor", // Assuming the Batch model has an 'instructor' field
            model: "Employee", // Populate the instructor data from the Employee model (adjust if needed)
          },
        })
        .populate("room").populate({
          path: "placementTest",
          populate: {
            path: "instructor", // Assuming the Batch model has an 'instructor' field
            model: "Employee", // Populate the instructor data from the Employee model (adjust if needed)
          },
        }); // Populate room data

      return res.status(200).json(allReservations);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Could not fetch reservations" });
    }
  } else {
    return res.status(400).json({ error: "Invalid request" });
  }
};
