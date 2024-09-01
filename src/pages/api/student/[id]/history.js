import connectDB from "@lib/db";
import StudentHistory from "../../../../models/studentHistory"; // Import the StudentHistory model

export default async (req, res) => {
  try {
    await connectDB();

    const { id } = req.query;
    console.log(id)

    if (req.method === "GET") {
      if (!id) {
        return res.status(400).json({ error: "Student ID is required" });
      }

      // Fetch the history records for the student
      const historyRecords = await StudentHistory.find({ student: id })
        .populate('changedBy', 'name') // Populate changedBy with admin/sales member names
        .exec();

      return res.status(200).json({ history: historyRecords });
    } else {
      return res.status(400).json({ error: "Invalid request method" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};
