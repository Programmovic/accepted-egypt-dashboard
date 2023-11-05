// getBatchStudentCounts.js
import connectDB from "@lib/db";
import Batch from "../../../models/batch";
import Student from "../../../models/student";
import mongoose from 'mongoose';

export default async (req, res) => {
  await connectDB();

  if (req.method === "POST") {
    try {
      const { batchId } = req.body;

      // Validate that the batchId is provided
      if (!batchId) {
        return res.status(400).json({ error: "Batch ID is required in the request body" });
      }

      // Check if the batch exists
      const batch = await Batch.findOne({ _id: batchId });

      if (!batch) {
        return res.status(404).json({ error: "Batch not found" });
      }

      // Count the number of students in the specified batch
      const studentCount = await Student.countDocuments({ batch: new mongoose.Types.ObjectId(batchId) });

      return res.status(200).json({ batchId, studentCount });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Could not retrieve student count for the batch" });
    }
  }

  return res.status(400).json({ error: "Invalid request" });
};
