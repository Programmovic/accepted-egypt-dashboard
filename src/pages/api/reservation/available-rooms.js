import connectDB from "@lib/db";
import Reservation from "../../../models/reservation"; // Make sure to import the Room model
import Room from "../../../models/room";

export default async (req, res) => {
  await connectDB();
  if (req.method === "POST") {
    // Handle POST request
  } else if (req.method === "GET") {
    try {
      // Check if the 'date' parameter is provided, otherwise use the current date
      const { date } = req.query;
      const currentDate = new Date(date) //date ? new Date(date) : new Date();
      const offsetMinutes = currentDate.getTimezoneOffset();
      const adjustedDate = new Date(currentDate.getTime() - offsetMinutes * 60000);
      // Find all reservations that overlap with the specified date and time range
      const checkedDate = date ? date : adjustedDate
      console.log(checkedDate)
      const overlappingReservations = await Reservation.find({
        date: checkedDate,
      });

      // Find all rooms that are not reserved during the specified time range
      const reservedRoomIds = overlappingReservations.map(
        (reservation) => reservation.room
      );
      const availableRooms = await Room.find({
        _id: { $nin: reservedRoomIds },
      });

      res.json(availableRooms);
    } catch (error) {
      console.error("Error fetching available rooms:", error);
      res.status(500).json({ error: error.message });
    }
  } else {
    return res.status(400).json({ error: "Invalid request" });
  }
};
