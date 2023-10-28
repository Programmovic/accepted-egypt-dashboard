import connectDB from "@lib/db";
import Student from "../../../../../models/student";
import Batch from "../../../../../models/batch";
import Transaction from "../../../../../models/transaction";
import Attendance from "../../../../../models/attendance";
import Lecture from "../../../../../models/lecture";

export default async (req, res) => {
  try {
    await connectDB();

    if (req.method === "PUT") {
      const { studentId } = req.query; // Assuming you pass the studentId as a query parameter
      const { batch, paidAmount } = req.body;

      if (!studentId) {
        return res.status(400).json({ error: "Student ID is required" });
      }

      // Find the student by ID
      const student = await Student.findById(studentId);

      if (!student) {
        return res.status(404).json({ error: "Student not found" });
      }

      if (student.batch) {
        return res.status(400).json({ error: "Student is already assigned to a batch" });
      }

      // Find the batch by ID
      const batchData = await Batch.findById(batch);

      if (!batchData) {
        return res.status(404).json({ error: "Batch not found" });
      }

      // Calculate the due amount
      const dueAmount = batchData.cost - paidAmount;

      // Assign the student to the batch
      student.batch = batch;
      student.placementTestDate = new Date(); // Set the placement test date as the current date
      student.paid += paidAmount;
      student.due = dueAmount;

      // Create a transaction for the received amount
      const receivedTransaction = new Transaction({
        student: student._id,
        batch: batch,
        type: "Income",
        amount: paidAmount,
        description: "Course Fee",
      });

      receivedTransaction.save()
      // Save the updated student
      await student.save();
      const lectures = await Lecture.find({ batch: batch });
      console.log(req.body)
      for (const lectureId of lectures) {
        const attendanceRecord = new Attendance({
          lecture: lectureId,
          trainee: student._id,
          date: new Date(), // You can set the date as the current date
          status: 'Not Assigned', // You can set an initial status as needed
          // Add remarks or other details if necessary
        });
        await attendanceRecord.save();
      }
      return res.status(200).json({ student });
    } else if (req.method === "GET") {
      const students = await Student.find();
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
