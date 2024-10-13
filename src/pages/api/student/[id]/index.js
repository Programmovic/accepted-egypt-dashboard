import connectDB from "@lib/db";
import Student from "../../../../models/student";
import Attendance from "../../../../models/attendance";
import Assessment from "../../../../models/progress_exit_test";
import Lecture from "../../../../models/lecture";
import Level from "../../../../models/level";
import Transaction from "../../../../models/transaction";


export default async (req, res) => {
  try {
    await connectDB();

    if (req.method === "POST") {
      // Handle POST requests (if any additional logic is required)
    } else if (req.method === "PUT") {
      const { id } = req.query;
      const updateData = req.body;

      // Find the student by ID and update the data
      const updatedStudent = await Student.findOneAndUpdate(
        { _id: id },
        updateData,
        { new: true }
      );

      if (!updatedStudent) {
        return res.status(404).json({ error: "Student not found" });
      }

      // Check if the batch has changed
      if (updateData.batch && updateData.batch !== updatedStudent.batch) {
        // Fetch the lectures of the new batch
        const newBatchLectures = await Lecture.find({
          batch: updateData.batch,
        });

        // Create attendances for the student in the new batch's lectures
        newBatchLectures.forEach(async (lecture) => {
          const newAttendance = new Attendance({
            lecture: lecture._id,
            trainee: updatedStudent._id,
            date: new Date(),
            status: "Not Assigned",
          });

          await newAttendance.save();
        });
      }

      return res.status(200).json({ student: updatedStudent });
    } else if (req.method === "GET") {
      const { id } = req.query;

      try {
        // Find the student by ID
        const student = await Student.findById(id).populate("elsaAccount").populate('batch');

        if (!student) {
          return res.status(404).json({ message: "Student not found" });
        }

        // Fetch associated assessments for the student and level information
        const assessments = await Assessment.findOne({
          student: id,
          batch: student.batch,
        });
        const level = await Level.findOne({ name: assessments?.newLevel });

        // Find transactions associated with the student ID
        const transactions = await Transaction.find({ student: id })
          .populate("student")
          .populate("batch");

        if (!transactions || transactions.length === 0) {
          return res
            .status(404)
            .json({ message: "Transactions not found for the student" });
        }
        const batchLectures = await Lecture.find({ batch: student.batch });
        const allAttendances = await Attendance.find({ trainee: id });
        // Return structured response including student data, assessments, level, and transactions
        return res.status(200).json({ student, level, transactions, batchLectures, allAttendances });
      } catch (error) {
        console.error("Error fetching student or assessments:", error);
        return res.status(500).json({ message: "Server error" });
      }
    } else {
      return res.status(400).json({ error: "Invalid request" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};
