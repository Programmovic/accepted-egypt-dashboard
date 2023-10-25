import connectDB from "@lib/db";
import Batch from "../../../../../models/batch";
import Class from "../../../../../models/class";

export default async (req, res) => {
  await connectDB();

  if (req.method === "POST") {
    // ... (existing POST logic) ...
  } else if (req.method === "GET") {
    const { instructorIds } = req.query;

    try {
      // Find classes taught by any of the specified instructors and populate
      const batches = await Batch.find({ _id: instructorIds });
      console.log(batches);

      return res.status(200).json(batches);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Could not fetch classes" });
    }
  } else if (req.method === "DELETE") {
    // ... (existing DELETE logic) ...
  }

  return res.status(400).json({ error: "Invalid request" });
};
