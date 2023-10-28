import connectDB from "@lib/db";
import Student from "../../../../../models/student";
import PlacementTest from "../../../../../models/placement_test";

export default async (req, res) => {
  try {
    await connectDB();

    if (req.method === "POST") {

    } if (req.method === "PUT") {
      const { studentId } = req.query; // Assuming you pass the studentId as a query parameter
      const { assignedLevel, placementTestID, status } = req.body;

      if (!studentId) {
        return res.status(400).json({ error: "Student ID is required" });
      }

      // Find the student by ID
      const student = await Student.findById(studentId);

      if (!student) {
        return res.status(404).json({ error: "Student not found" });
      }

      const updatedStudent = await Student.findByIdAndUpdate(
        studentId,
        { level: assignedLevel },
        { new: true }
      );
      const updatedPlacementTest = await PlacementTest.findByIdAndUpdate(
        placementTestID,
        {
          status: status,
          assignedLevel: assignedLevel
        },
        { new: true }
      );
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
