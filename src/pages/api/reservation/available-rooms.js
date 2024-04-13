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
      // Find all reservations that overlap with the specified date and time range
      const checkedDate = date
      const overlappingReservations = await Reservation.find({
        date: new Date(convertDateFormat(checkedDate)),
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
function convertDateFormat(inputDate) {
  const parts = inputDate?.split('/');
  if (parts.length === 3) {
    const month = parts[0].padStart(2, '0'); // Ensure 2-digit month
    const day = parts[1].padStart(2, '0');   // Ensure 2-digit day
    const year = parts[2];
    const isoDate = `${year}-${month}-${day}T00:00:00.000Z`;
    return isoDate;
  } else {
    // Handle invalid input
    return null;
  }
}
