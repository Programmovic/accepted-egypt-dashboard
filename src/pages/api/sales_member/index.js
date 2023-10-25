// batch.js
import connectDB from "@lib/db";
import SalesMember from "../../../models/sales_member";

export default async (req, res) => {
  await connectDB();

  if (req.method === "POST") {
    try {
      const batchData = req.body;

      

      // Create a new Batch document
      const newMember = new SalesMember(batchData);

      // Save the new batch to the database
      await newMember.save();

      return res.status(201).json(newMember);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Could not create batch" });
    }
  } else if (req.method === "GET") {
    try {
      const allMembers = await SalesMember.find();
      return res.status(200).json(allMembers);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Could not fetch batches" });
    }
  } else if (req.method === "DELETE") {
    try {
      // Delete all Batch documents (clear the batches data)
      await SalesMember.deleteMany({});
      return res.status(204).send(); // Respond with a 204 status for successful deletion
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Could not delete batches" });
    }
  }

  return res.status(400).json({ error: "Invalid request" });
};
