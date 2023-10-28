// attendance.js
import connectDB from "@lib/db";
import Attendance from "../../../models/attendance";

export default async (req, res) => {
  await connectDB();

  if (req.method === "POST") {
    try {
      const attendanceData = req.body;

      // Create a new Attendance document
      const newAttendance = new Attendance(attendanceData);

      // Save the new attendance record to the database
      await newAttendance.save();

      return res.status(201).json(newAttendance);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Could not create Attendance record" });
    }
  } else if (req.method === "GET") {
    try {
      const allAttendances = await Attendance.find();
      return res.status(200).json(allAttendances);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Could not fetch Attendance records" });
    }
  } else if (req.method === "DELETE") {
    try {
      // Delete all Attendance documents (clear the attendance data)
      await Attendance.deleteMany({});
      return res.status(204).send(); // Respond with a 204 status for successful deletion
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Could not delete Attendance records" });
    }
  }

  return res.status(400).json({ error: "Invalid request" });
};
