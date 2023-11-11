// Example for adding a batch to an instructor
// routes/api/instructor/addBatch.js

import connectDB from "@lib/db";
import Instructor from "../../../models/instructor";

export default async function handler(req, res) {
  await connectDB();

  if (req.method === "POST") {
    const { instructorId } = req.query;
    const { batchId } = req.body;
    try {
      const instructor = await Instructor.findById(instructorId);
      console.log(instructorId)

      if (!instructor) {
        return res.status(404).json({ error: "Instructor not found" });
      }

      if (!instructor.batch.includes(batchId)) {
        instructor.batch.push(batchId);
        await instructor.save();
        return res.status(200).json({ message: "Batch added to instructor" });
      } else {
        return res.status(400).json({ error: "Batch already associated with the instructor" });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Could not add batch to instructor" });
    }
  }

  return res.status(400).json({ error: "Invalid request" });
}
