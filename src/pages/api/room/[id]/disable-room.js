import connectDB from "@lib/db";
import Room from "../../../../models/room";
import RoomStatusHistory from "../../../../models/roomStatusHistory"; // Ensure this import path is correct

export default async (req, res) => {
  await connectDB();

  const { method, query } = req;
  const { id } = query;

  switch (method) {
    case "GET":
      // Handle GET method to fetch room data
      break;
    case "PUT":
      try {
        // Check if the room is currently disabled
        const existingRoom = await Room.findById(id);
        if (!existingRoom) {
          return res.status(404).json({ error: "Room not found" });
        }

        if (existingRoom.disabled) {
          // If room is disabled, enable it
          const updatedRoom = await Room.findByIdAndUpdate(
            id,
            { disabled: false, enabledAt: new Date() },
            { new: true }
          );
          // Create and save the history record
          const historyEntry = new RoomStatusHistory({
            room: id,
            status: "enabled",
            changedByAdmin: req.body.userId, // Assumes user ID is in the request, adjust accordingly
          });
          await historyEntry.save();
          return res.status(200).json(updatedRoom);
        } else {
          // If room is enabled, disable it
          const updatedRoom = await Room.findByIdAndUpdate(
            id,
            { disabled: true, disabledAt: new Date() },
            { new: true }
          );
          // Create and save the history record
          const historyEntry = new RoomStatusHistory({
            room: id,
            status: "disabled",
            changedByAdmin: req.body.userId, // Assumes user ID is in the request, adjust accordingly
          });
          await historyEntry.save();
          return res.status(200).json(updatedRoom);
        }
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
      }
    default:
      return res.status(405).json({ error: "Method not allowed" });
  }
};
