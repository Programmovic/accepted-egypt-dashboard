import connectDB from "@lib/db";
import Student from "../../../models/student";
import PlacementTest from "../../../models/placement_test";
import Transaction from "../../../models/transaction";

export default async (req, res) => {
  try {
    await connectDB();

    if (req.method === "POST") {
      const studentData = req.body;

      if (!studentData.name || !studentData.phoneNumber) {
        return res.status(400).json({ error: "Name and phone number are required" });
      }
      const existingStudent = await Student.findOne({
        phoneNumber: studentData.phoneNumber,
      });

      if (existingStudent) {
        return res
          .status(409)
          .json({ error: "Student with the same phone number already exists" });
      }

      // Create a new Student document
      const newStudent = new Student(studentData);

      // Calculate the due amount
      const dueAmount = studentData.due;

      // Create a transaction for the paid amount
      const paidTransaction = new Transaction({
        student: newStudent._id,
        batch: studentData.batch, // You need to provide the batch ID
        type: "Income",
        amount: studentData.paid,
        description: "Placement Test"

      });

      // Create a transaction for the due amount (if there is a due amount)
      if (dueAmount > 0) {
        const dueTransaction = new Transaction({
          student: newStudent._id,
          batch: studentData.batch, // You need to provide the batch ID
          type: "Due",
          amount: dueAmount,
        });

        // Save both transactions
        await Promise.all([paidTransaction.save(), dueTransaction.save()]);
      } else {
        // Save only the paid transaction
        await paidTransaction.save();
      }

      await newStudent.save();
      const placementTestData = {
        student: newStudent._id,
        studentName: newStudent.name,
        studentNationalID: newStudent.nationalId,
        generalPlacementTest: newStudent.placementTest,
        status: "Not Started Yet!",
        assignedLevel: "N/A",
        cost: newStudent.paid,
        date: new Date(studentData.placementTestDate),
        // Add any other placement test fields here
      }
      // Create a placement test for the new student
      const newPlacementTest = new PlacementTest(placementTestData);

      await newPlacementTest.save();
      console.log(placementTestData)
      return res.status(201).json({ newStudent });
    } else if (req.method === "GET") {
      const students = await Student.find();
      return res.status(200).json({ students });
    } else if (req.method === "DELETE") {
      // Handle student deletion
      const studentId = req.query.id; // Assuming you pass the student ID in the request query parameters

      // Find the student by ID
      
      // Delete the student document
      await Student.deleteOne({_id: studentId})

      // Optionally, you can also delete associated placement test and transactions
      await PlacementTest.deleteMany({ student: studentId });
      await Transaction.deleteMany({ student: studentId });

      return res.status(200).json({ message: "Student deleted successfully" });
    } else {
      return res.status(400).json({ error: "Invalid request" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};
