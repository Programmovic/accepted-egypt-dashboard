import connectDB from "@lib/db";
import Attendance from "../../../../models/attendance";

export default async (req, res) => {
  await connectDB();

  if (req.method === "POST") {
    // Handle creating new attendance records if needed
    // You can add this logic if you want to create new attendance records
  } else if (req.method === "GET") {
    try {
      const { lectureId } = req.query;
      const allAttendances = await Attendance.find({ lecture: lectureId });
      return res.status(200).json(allAttendances);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Could not fetch Attendance records" });
    }
  } else if (req.method === "PUT") {
    try {
      // Assuming you pass the updated status and the attendance record ID in the request body
      const { status, attendanceId } = req.body;

      // Find the attendance record by ID and update the status
      const updatedAttendance = await Attendance.findByIdAndUpdate(attendanceId, { status }, { new: true });

      if (!updatedAttendance) {
        return res.status(404).json({ error: "Attendance record not found" });
      }

      return res.status(200).json(updatedAttendance);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Could not update Attendance record" });
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
