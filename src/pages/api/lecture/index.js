// batch.js
import connectDB from "@lib/db";
import Lecture from "../../../models/lecture";

export default async (req, res) => {
  await connectDB();

  if (req.method === "POST") {
    try {
      const lectureData = req.body;

      

      // Create a new Batch document
      const newLecture = new Lecture(lectureData);

      // Save the new batch to the database
      await newLecture.save();

      return res.status(201).json(newLecture);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Could not create Lecture" });
    }
  } else if (req.method === "GET") {
    try {
      const allLectures = await Lecture.find();
      return res.status(200).json(allLectures);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Could not fetch Lecture" });
    }
  } else if (req.method === "DELETE") {
    try {
      // Delete all Batch documents (clear the batches data)
      await Lecture.deleteMany({});
      return res.status(204).send(); // Respond with a 204 status for successful deletion
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Could not delete Lecture" });
    }
  }

  return res.status(400).json({ error: "Invalid request" });
};
