import connectDB from "@lib/db";
import WaitingList from "../../../models/waiting_list";
import Student from "../../../models/student";

export default async (req, res) => {
  try {
    await connectDB();

    if (req.method === "POST") {
      // Get all waiting list entries
      const waitingListEntries = await WaitingList.find();

      // Update the assignedLevel for each waiting list entry to match the student's level
      for (const entry of waitingListEntries) {
        const student = await Student.findById(entry.student);

        if (student) {
          // Update the assignedLevel in the waiting list entry
          entry.assignedLevel = student.level;

          // Save the updated waiting list entry
          await entry.save();
        }
      }

      return res.status(200).json({ message: "Assigned levels updated in waiting list." });
    } else {
      return res.status(400).json({ error: "Invalid request" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};
