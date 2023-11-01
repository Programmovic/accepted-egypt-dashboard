// attendance.js
import connectDB from "@lib/db";
import Student from "../../../models/student";
import Lecture from "../../../models/lecture";
import Attendance from "../../../models/attendance";

export default async (req, res) => {
  try {
    await connectDB();

    if (req.method === "GET") {
      const studentsWithoutAttendance = await Student.find({
        batch: { $exists: true }, // Filter students who are in a batch
      });

      for (const student of studentsWithoutAttendance) {
        // Find the batch lectures for the student
        const lectures = await Lecture.find({ batch: student.batch });

        // Find the lectures for which the student has no attendance records
        const lecturesWithoutAttendance = lectures.filter((lecture) => {
          return !Attendance.exists({ lecture: lecture._id, trainee: student._id });
        });

        // Create attendance records for the lectures without attendance
        for (const lecture of lecturesWithoutAttendance) {
          const attendanceRecord = new Attendance({
            lecture: lecture._id,
            trainee: student._id,
            date: new Date(), // Set the date as the current date
            status: 'Not Assigned', // Set an initial status as needed
            // Add remarks or other details if necessary
          });

          await attendanceRecord.save();
          console.log("attendanceRecord")
        }
      }

      return res.status(200).json({ message: "Attendance records created" });
    } else {
      return res.status(400).json({ error: "Invalid request" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};
