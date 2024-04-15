import connectDB from "@lib/db";
import Room from "../../../../models/room";

export default async (req, res) => {
  await connectDB();

  const { method, query } = req;
  const { id } = query;

  switch (method) {
    case "GET":
      try {
        // Fetch room data by ID
        const room = await Room.findById(id);
        if (!room) {
          return res.status(404).json({ error: "Room not found" });
        }
        return res.status(200).json(room);
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
      }
    case "PUT":
      try {
        // Update room data by ID
        const updatedRoom = await Room.findByIdAndUpdate(id, req.body, {
          new: true, // Return the updated document
          runValidators: true, // Run validators on update
        });
        if (!updatedRoom) {
          return res.status(404).json({ error: "Room not found" });
        }
        return res.status(200).json(updatedRoom);
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
      }
    case "DELETE":
      try {
        // Delete room by ID
        const deletedRoom = await Room.findByIdAndDelete(id);
        if (!deletedRoom) {
          return res.status(404).json({ error: "Room not found" });
        }
        return res.status(204).send();
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
      }
    default:
      return res.status(405).json({ error: "Method not allowed" });
  }
};
