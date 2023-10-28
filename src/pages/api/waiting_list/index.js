import connectDB from "@lib/db";
import WaitingList from "../../../models/waiting_list";
import Student from "../../../models/student";
import PlacementTest from "../../../models/placement_test";

export default async (req, res) => {
  try {
    await connectDB();

    if (req.method === "POST") {
      const student = req.body;

      // Create a new Student document
      const newStudent = new WaitingList(student);
      await newStudent.save()
      const updatedStudent = await Student.findByIdAndUpdate(
        student.student,
        { status: "Waiting List"},
        { new: true }
      );
      const updatedPlacementTest = await PlacementTest.findByIdAndUpdate(
        student.placementTestID,
        { status: "Finished, Moved to Waiting List"},
        { new: true }
      );
      console.log(student.placementTestID)
      return res.status(201).json({ newStudent });

    } else if (req.method === "GET") {


      const waiting_list = await WaitingList.find();

      // You can also fetch associated placement test and transaction data here if needed

      return res.status(200).json({ waiting_list });
    } else {
      return res.status(400).json({ error: "Invalid request" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};
