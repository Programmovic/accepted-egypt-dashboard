import connectDB from "@lib/db";
import Student from "../../../../models/student";
import Attendance from "../../../../models/attendance";
import Lecture from "../../../../models/lecture";


export default async (req, res) => {
  try {
    await connectDB();

    if (req.method === "POST") {

    } else if (req.method === "PUT") {
      const { id } = req.query;
      const updateData = req.body; // Assuming your request body contains the updated data

      // Find the student by ID and update the batch
      const updatedStudent = await Student.findOneAndUpdate(
        { _id: id },
        updateData,
        { new: true }
      );
console.log(updateData)
      if (!updatedStudent) {
        return res.status(404).json({ error: "Student not found" });
      }

      // Check if the batch has changed
      if (updateData.batch && updateData.batch !== updatedStudent.batch) {
        // Fetch the lectures of the new batch
        const newBatchLectures = await Lecture.find({ batch: updateData.batch });

        // Create attendances for the student in the new batch's lectures
        newBatchLectures.forEach(async (lecture) => {
          const newAttendance = new Attendance({
            lecture: lecture._id,
            trainee: updatedStudent._id,
            date: new Date(), // Set the current date or specify a date
            status: "Not Assigned", // Set the default status or specify one
            // You can add more details to the attendance entry if needed
          });

          // Save the new attendance entry
          await newAttendance.save();
        });
      }

      return res.status(200).json({ student: updatedStudent });
    } else if (req.method === "GET") {
      const { id } = req.query;
      const students = await Student.find({ _id: id });
      // You can also fetch associated placement test and transaction data here if needed
      return res.status(200).json({ students });
    } else if (req.method === "GET") {
      const { id } = req.query
      const students = await Student.find({ _id: id });
      // You can also fetch associated placement test and transaction data here if needed
      return res.status(200).json({ students });
    } else {
      return res.status(400).json({ error: "Invalid request" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};
