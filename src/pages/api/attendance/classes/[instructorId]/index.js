import connectDB from "@lib/db";
import Instructor from "../../../../../models/instructor";
import Class from "../../../../../models/class";

export default async (req, res) => {
  await connectDB();

  if (req.method === "POST") {
    // ... (existing POST logic) ...
  } else if (req.method === "GET") {
    const { instructorId } = req.query;

    try {
      // Find the instructor by ID
      const instructor = await Instructor.findById(instructorId);

      if (!instructor) {
        return res.status(404).json({ error: "Instructor not found" });
      }

      // Fetch classes taught by the instructor
      const classes = await Class.find({ instructors: { $in: [instructorId] } });
console.log(classes)
      return res.status(200).json(classes);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Could not fetch classes" });
    }
  } else if (req.method === "DELETE") {
    // ... (existing DELETE logic) ...
  }

  return res.status(400).json({ error: "Invalid request" });
};
