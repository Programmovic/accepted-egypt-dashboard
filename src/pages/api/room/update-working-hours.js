import connectDB from "@lib/db";
import Room from "../../../models/room";

export default async (req, res) => {
  await connectDB();
  if (req.method === "POST") {
    try {
      // Define default working hours
      const defaultWorkingHours = {
        from: "09:00",
        to: "17:00",
      };

      // Update rooms with no working hours to have the default working hours
      await Room.updateMany(
        { actualWorkingHours: { $exists: false } },
        { $set: { actualWorkingHours: defaultWorkingHours } }
      );

      return res.status(200).json({ message: "Default working hours set for rooms without working hours." });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "An error occurred while setting default working hours for rooms." });
    }
  } else {
    return res.status(400).json({ error: "Invalid request" });
  }
};
