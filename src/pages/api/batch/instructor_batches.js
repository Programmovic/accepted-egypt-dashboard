// batch.js
import connectDB from "@lib/db";
import Batch from "../../../models/batch";
import Instructor from "../../../models/instructor";

export default async (req, res) => {
  await connectDB();

  if (req.method === "GET") {
    const { instructorId } = req.query;

    try {
      // Find the instructor by ID
      const instructor = await Instructor.findById(instructorId);

      if (!instructor) {
        return res.status(404).json({ error: "Instructor not found" });
      }

      // Find batches taught by the instructor
      const batches = await Batch.find({ _id: { $in: instructor.batch } });

      return res.status(200).json(batches);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Could not fetch batches" });
    }
  }

  return res.status(400).json({ error: "Invalid request" });
};
