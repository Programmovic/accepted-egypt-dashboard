import connectDB from "@lib/db";
import Attendance from "../../../../models/attendance";
import Student from "../../../../models/student"; // Import the Student model
import Lecture from "../../../../models/lecture"; // Import the Lecture model
import Batch from "../../../../models/batch"; // Import the Batch model
import WaitingList from "../../../../models/waiting_list"; // Import the WaitingList model

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
      const { status, attendanceId } = req.body;

      // Find the attendance record by ID and update the status
      const updatedAttendance = await Attendance.findByIdAndUpdate(
        attendanceId,
        { status },
        { new: true }
      );

      if (!updatedAttendance) {
        return res.status(404).json({ error: "Attendance record not found" });
      }

      // Check if the attendance status is "Attended"
      if (status === "Attended") {
        // Find the lecture related to this attendance
        const lecture = await Lecture.findById(updatedAttendance.lecture);

        if (lecture) {
          // Find the student related to this attendance
          const student = await Student.findById(updatedAttendance.trainee);

          if (student && student.batch) {
            // Find the batch related to this student
            const batch = await Batch.findById(student.batch);

            if (batch && lecture.batch.toString() === batch._id.toString()) {
              // Check if this is the student's first attendance in the batch
              const firstAttendance = await Attendance.findOne({
                trainee: student._id,
                lecture: { $in: batch.lectures }, // Assume batch has an array of lecture IDs
                status: "Attended",
              }).sort({ date: 1 });

              if (!firstAttendance || firstAttendance._id.toString() === updatedAttendance._id.toString()) {
                // Update the student's waiting list status and save changes
                student.waitingList = false;
                student.status = "Joined Batch";
                await WaitingList.findOneAndRemove({ student: student._id });
                await student.save();
              }
            }
          }
        }
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
