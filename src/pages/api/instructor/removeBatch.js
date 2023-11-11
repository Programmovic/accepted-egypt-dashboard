// Example for removing a batch from an instructor
// routes/api/instructor/removeBatch.js

import connectDB from "@lib/db";
import Instructor from "../../../models/instructor";

export default async function handler(req, res) {
  await connectDB();

  if (req.method === "DELETE") {
    const { instructorId, batchId } = req.query;

    try {
      const instructor = await Instructor.findById(instructorId);

      if (!instructor) {
        return res.status(404).json({ error: "Instructor not found" });
      }

      const batchIndex = instructor.batch.indexOf(batchId);

      if (batchIndex !== -1) {
        instructor.batch.splice(batchIndex, 1);
        await instructor.save();
        return res.status(200).json({ message: "Batch removed from instructor" });
      } else {
        return res.status(404).json({ error: "Batch not associated with the instructor" });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Could not remove batch from instructor" });
    }
  }

  return res.status(400).json({ error: "Invalid request" });
}
