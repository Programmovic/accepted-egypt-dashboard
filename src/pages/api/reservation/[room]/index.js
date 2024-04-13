import connectDB from "@lib/db";
import Reservation from "../../../../models/reservation"; // Make sure to import the Room model


export default async (req, res) => {
  await connectDB();
  if (req.method === "POST") {
    
  } else if (req.method === "GET") {
    // Handle fetching all rooms
    try {
      const {room} = req.query
      const allReservations = await Reservation.find({room: room}).populate('batch room'); // Populate batch data
      return res.status(200).json(allReservations);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }
  } else {
    return res.status(400).json({ error: "Invalid request" });
  }
};
