import connectDB from "@lib/db";
import Attendance from "../../../../models/attendance";
import Student from "../../../../models/student"; // Import the Student model
import Lecture from "../../../../models/lecture"; // Import the Lecture model
import Batch from "../../../../models/batch"; // Import the Batch model
import WaitingList from "../../../../models/waiting_list"; // Import the WaitingList model

export default async (req, res) => {
  await connectDB();

  if (req.method === "PUT") {
    try {
      const { studentId } = req.query; // The QR code contains the studentId

      // Find the student by their ID
      const student = await Student.findById(studentId);
      if (!student) {
        return res.status(404).json({ error: "Student not found" });
      }

      // Get the current date
      const currentDate = new Date(); // Get the current date
      const startOfDay = new Date(currentDate.setHours(0, 0, 0, 0)); // Set to the start of the day
      const endOfDay = new Date(currentDate.setHours(23, 59, 59, 999)); // Set to the end of the day

      // Find the lecture for today
      const lecture = await Lecture.findOne({
        batch: student.batch,
        date: { $gte: startOfDay, $lt: endOfDay },
      });
      console.log(lecture);
      if (!lecture) {
        return res.status(404).json({ error: "No lecture found for today" });
      }

      // Calculate lecture start and end time
      const [startHour, startMinute] = lecture.weeklyHours.from.split(":");
      const [endHour, endMinute] = lecture.weeklyHours.to.split(":");

      // Create Date objects for start and end time
      const lectureStartTime = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate(),
        startHour,
        startMinute
      );
      const lectureEndTime = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate(),
        endHour,
        endMinute
      );

      // Calculate the time window for attendance
      const attendanceStartTime = new Date(
        lectureStartTime.getTime() - 3 * 24 * 60 * 60 * 1000 // 3 days before
      ); 
      const attendanceEndTime = new Date(
        lectureEndTime.getTime() + 3 * 24 * 60 * 60 * 1000 // 3 days after
      ); 

      // Check if the current time falls within the attendance window
      if (
        currentDate < attendanceStartTime ||
        currentDate > attendanceEndTime
      ) {
        return res
          .status(404)
          .json({ error: "Attendance not allowed at this time" });
      }

      // Check if an attendance record already exists for this student and lecture
      let attendance = await Attendance.findOne({
        trainee: student._id,
        lecture: lecture._id,
      });

      if (!attendance) {
        // Create new attendance record if none exists
        attendance = new Attendance({
          trainee: student._id,
          lecture: lecture._id,
          status: "Attended",
        });
        await attendance.save();
      } else {
        // Update the existing attendance record if found
        attendance.status = "Attended";
        await attendance.save();
      }

      // Check if this is the student's first attendance in the batch and update status if necessary
      const firstAttendance = await Attendance.findOne({
        trainee: student._id,
        lecture: { $in: student.batch.lectures },
        status: "Attended",
      }).sort({ date: 1 });

      if (
        !firstAttendance ||
        firstAttendance._id.toString() === attendance._id.toString()
      ) {
        student.waitingList = false;
        student.status = "Joined Batch";
        await WaitingList.findOneAndRemove({ student: student._id });
        await student.save();
      }

      return res.status(200).json({ success: true, attendance });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Failed to process attendance" });
    }
  } else if (req.method === "GET") {
    // Other GET logic
    try {
      const { lectureId } = req.query;
      const allAttendances = await Attendance.find({ lecture: lectureId });
      return res.status(200).json(allAttendances);
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ error: "Could not fetch Attendance records" });
    }
  } else if (req.method === "DELETE") {
    // Delete logic
    try {
      await Attendance.deleteMany({});
      return res.status(204).send(); // Respond with a 204 status for successful deletion
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ error: "Could not delete Attendance records" });
    }
  }

  return res.status(400).json({ error: "Invalid request" });
};
