// batch.js
import connectDB from "@lib/db";
import Batch from "../../../models/batch";
import Lecture from "../../../models/lecture";
import Reservation from "../../../models/reservation";
import Student from "../../../models/student";

export default async (req, res) => {
  await connectDB();

  if (req.method === "GET") {
    try {
      const { status } = req.query;
console.log(status)
      // Check if the status parameter is provided
      const batches = await Batch.find({ status });
      const batchsWithStudentCount = await Promise.all(
        batches.map(async (batch) => {
          const studentCount = await Student.countDocuments({ batch: batch._id });
          return { ...batch.toObject(), studentCount };
        })
      );
      return res.status(200).json(batchsWithStudentCount);

    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Could not fetch batches" });
    }
  }

  // Handle other HTTP methods or invalid requests
  return res.status(400).json({ error: "Invalid request" });
};
