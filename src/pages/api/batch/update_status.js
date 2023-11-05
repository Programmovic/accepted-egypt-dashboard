// batch.js
import connectDB from "@lib/db";
import Batch from "../../../models/batch";
import Lecture from "../../../models/lecture";
import Reservation from "../../../models/reservation";

export default async (req, res) => {
  await connectDB();

  if (req.method === "POST" && req.body.action === "updateBatchStatus") {
    try {
      // Calculate the current date
      const currentDate = new Date();
  
      // Find all batches
      const allBatches = await Batch.find();
  
      // Loop through batches to check and update their statuses
      for (const batch of allBatches) {
        const startDate = new Date(batch.shouldStartAt);
        const endDate = new Date(batch.shouldEndAt);
  
        if (currentDate < startDate) {
          // If the current date is before the start date, set the status to "Not Started Yet"
          await Batch.updateOne({ _id: batch._id }, { status: 'Not Started Yet' });
        } else if (currentDate > endDate) {
          // If the current date is after the end date, set the status to "Ended"
          await Batch.updateOne({ _id: batch._id }, { status: 'Ended' });
        } else {
          // If the current date is within the range, you can set the status to "Ongoing" or any appropriate value
          await Batch.updateOne({ _id: batch._id }, { status: 'Ongoing' });
        }
      }
  
      return res.status(200).json({ message: "Batch statuses updated" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Could not update batch statuses" });
    }
  }
  

  return res.status(400).json({ error: "Invalid request" });
};
