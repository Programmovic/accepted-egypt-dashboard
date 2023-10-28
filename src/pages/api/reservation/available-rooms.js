import connectDB from "@lib/db";
import Reservation from "../../../models/reservation"; // Make sure to import the Room model
import Room from "../../../models/room";

export default async (req, res) => {
  await connectDB();
  if (req.method === "POST") {
    
  } else if (req.method === "GET") {
    // Handle fetching all rooms
    try {
      const { date, fromTime, toTime } = req.query;
 
      // Find all reservations that overlap with the specified date and time range
      const reservationDate = new Date(date);
      console.log(reservationDate)
      const overlappingReservations = await Reservation.find({
        date: reservationDate,
      });
      console.log(overlappingReservations)
      // Find all rooms that are not reserved during the specified time range
      const reservedRoomIds = overlappingReservations.map((reservation) => reservation.room);
      const availableRooms = await Room.find({
        _id: { $nin: reservedRoomIds },
      });
  
      res.json(availableRooms);
    } catch (error) {
      console.error('Error fetching available rooms:', error);
      res.status(500).json({ error: 'Failed to fetch available rooms.' });
    }
  } else {
    return res.status(400).json({ error: "Invalid request" });
  }
};
