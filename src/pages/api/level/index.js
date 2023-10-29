// attendance.js
import connectDB from "@lib/db";
import Level from "../../../models/level";

export default async (req, res) => {
  await connectDB();

  if (req.method === "POST") {
    try {
      const levelData = req.body;

      // Create a new Attendance document
      const newLevel = new Level(levelData);

      // Save the new attendance record to the database
      await newLevel.save();

      return res.status(201).json(newLevel);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Could not create Attendance record" });
    }
  } else if (req.method === "GET") {
    try {
      const allLevels = await Level.find();
      return res.status(200).json(allLevels);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Could not fetch Attendance records" });
    }
  } else if (req.method === "DELETE") {
    try {
      // Delete all Attendance documents (clear the attendance data)
      await Level.deleteMany({});
      return res.status(204).send(); // Respond with a 204 status for successful deletion
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Could not delete Attendance records" });
    }
  }

  return res.status(400).json({ error: "Invalid request" });
};
