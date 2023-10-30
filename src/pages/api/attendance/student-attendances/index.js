import connectDB from "@lib/db";
import Attendance from "../../../../models/attendance";

export default async (req, res) => {
  await connectDB();

  if (req.method === "POST") {
    // Handle creating new attendance records if needed
    // You can add this logic if you want to create new attendance records
  } else if (req.method === "GET") {
    try {
      const { studentId } = req.query;
      const allAttendances = await Attendance.find({ trainee: studentId });
      console.log("studentId")
      return res.status(200).json(allAttendances);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Could not fetch Attendance records" });
    }
  } else if (req.method === "PUT") {
    
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
