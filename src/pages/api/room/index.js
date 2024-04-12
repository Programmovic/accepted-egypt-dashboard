import connectDB from "@lib/db";
import Room from "../../../models/room";
import Reservation from "../../../models/reservation";
import cron from 'node-cron';

// Schedule the task to run every minute at the top level of your module
cron.schedule('* * * * *', async () => {
  // Find reservations that have ended
  const now = new Date();
  const endedReservations = await Reservation.find({ endDate: { $lt: now } });

  // Update the isReserved field for rooms associated with ended reservations
  for (const reservation of endedReservations) {
    await Room.findByIdAndUpdate(reservation.room, { isReserved: false });
  }
});

export default async (req, res) => {
  await connectDB();
  if (req.method === "POST") {
    // Handle creating a new room
    try {
      const {
        name,
        capacity,
        location,
        description,
      } = req.body;

      const newRoom = new Room({
        name,
        capacity,
        location,
        description,
      });

      await newRoom.save();

      return res.status(201).json(newRoom);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Could not create a new room" });
    }
  } else if (req.method === "GET") {
    try {
      const allRooms = await Room.find().populate("location", "name");
      return res.status(200).json(allRooms);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Could not fetch rooms" });
    }
  } else {
    return res.status(400).json({ error: "Invalid request" });
  }
};
