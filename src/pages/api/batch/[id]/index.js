import connectDB from "@lib/db";
import Lecture from "../../../../models/lecture"; // Make sure to import the Lecture model

export default async (req, res) => {
  await connectDB();
  if (req.method === "GET") {
    try {
      const { id } = req.query; // Adjust the query parameter as needed
      const allBatchLectures = await Lecture.find({ batch: id }); // Query batch lectures based on the batch ID or other criteria
      return res.status(200).json(allBatchLectures);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Could not fetch batch lectures" });
    }
  } else {
    return res.status(400).json({ error: "Invalid request" });
  }
};
