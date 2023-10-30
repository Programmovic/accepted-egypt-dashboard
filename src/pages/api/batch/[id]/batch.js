import connectDB from "@lib/db";
import Batch from "../../../../models/batch"; // Import the Batch model

export default async (req, res) => {
  await connectDB();
  if (req.method === "GET") {
    try {
      const { id } = req.query; // Adjust the query parameter as needed
      const batchData = await Batch.findOne({ _id: id }); // Query batch data based on the batch ID or other criteria
      return res.status(200).json(batchData);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Could not fetch batch data" });
    }
  } else {
    return res.status(400).json({ error: "Invalid request" });
  }
};
