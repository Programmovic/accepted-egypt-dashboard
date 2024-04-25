import connectDB from "@lib/db";
import Reservation from "../../../models/reservation";
import Batch from "../../../models/batch"; // Import the Batch model
import mongoose from "mongoose";

export default async (req, res) => {
  await connectDB();
  if (req.method === "POST") {
    // Handle POST request
  } else if (req.method === "GET") {
    // Handle fetching all reservations
    try {
      const allReservations = await Reservation.find().populate('batch').populate('room'); // Populate batch data
      return res.status(200).json(allReservations);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Could not fetch reservations" });
    }
  } else {
    return res.status(400).json({ error: "Invalid request" });
  }
};
