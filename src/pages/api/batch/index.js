// batch.js
import connectDB from "@lib/db";
import Batch from "../../../models/batch";

export default async (req, res) => {
  await connectDB();

  if (req.method === "POST") {
    try {
      const batchData = req.body;

      

      // Create a new Batch document
      const newBatch = new Batch(batchData);

      // Save the new batch to the database
      await newBatch.save();

      return res.status(201).json(newBatch);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Could not create batch" });
    }
  } else if (req.method === "GET") {
    try {
      const allBatches = await Batch.find();
      return res.status(200).json(allBatches);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Could not fetch batches" });
    }
  } else if (req.method === "DELETE") {
    try {
      // Delete all Batch documents (clear the batches data)
      await Batch.deleteMany({});
      return res.status(204).send(); // Respond with a 204 status for successful deletion
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Could not delete batches" });
    }
  }

  return res.status(400).json({ error: "Invalid request" });
};
