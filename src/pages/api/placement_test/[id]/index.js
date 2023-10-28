import connectDB from "@lib/db";
import PlacementTest from "../../../../models/placement_test";
import Student from "../../../../models/student";

export default async (req, res) => {
  await connectDB();
  if (req.method === "PUT") {
    try {
      const { id } = req.query; // Get the placement test ID from the URL parameter
      const { selectedLevel, status, student } = req.body;
      console.log(id);

      // Find the placement test by ID and update the assignedLevel field
      const updatedTest = await PlacementTest.findByIdAndUpdate(
        id,
        {
          assignedLevel: selectedLevel,
          status: status,
        },
        { new: true }
      );
      console.log(selectedLevel);
      if (!updatedTest) {
        return res.status(404).json({ error: "Placement test not found" });
      }
      
      const updatedStudent = await Student.findOneAndUpdate(
        { _id: student }, // Make sure this matches the student's _id
        { status: "Assigned Level", level: selectedLevel },
        { new: true }
      );
      
      if (!updatedStudent) {
        return res.status(404).json({ error: "Student not found" });
      }
      
      return res.status(200).json({ test: updatedTest, student: updatedStudent });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Could not update the placement test or student" });
    }
  } else {
    return res.status(400).json({ error: "Invalid request" });
  }
};
