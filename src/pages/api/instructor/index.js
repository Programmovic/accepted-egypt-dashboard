import connectDB from "@lib/db";
import Instructor from "../../../models/instructor";

export default async (req, res) => {
  await connectDB();

  if (req.method === "POST") {
    try {
      const instructorData = req.body;

      // Check if an instructor with the same name already exists
      const existingInstructor = await Instructor.findOne({ name: instructorData.name });

      if (existingInstructor) {
        return res.status(400).json({ error: "Instructor with this name already exists" });
      }

      // Create a new Instructor document
      const newInstructor = new Instructor(instructorData);

      // Save the new instructor to the database
      await newInstructor.save();

      return res.status(201).json(newInstructor);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Could not create instructor" });
    }
  } else if (req.method === "GET") {
    try {
      const allInstructors = await Instructor.find();
      return res.status(200).json(allInstructors);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Could not fetch instructors" });
    }
  } else if (req.method === "PUT") {
    // Update the instructor's assigned batch
    const { instructorId, batchId } = req.body;
    console.log({ error: instructorId });
    try {
      // Update the instructor's assigned batch
      const instructor = await Instructor.findOne({ _id: instructorId });
      if (!instructor) {
        console.log({ error: "Instructor not found" });
        return res.status(404).json({ error: "Instructor not found" });

      }

      instructor.batch = batchId; // Assuming you have a field 'batch' in your Instructor model
      await instructor.save();

      return res.status(200).json({ message: "Instructor assigned to the batch successfully" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Failed to assign instructor to the batch" });
    }
  }
   else if (req.method === "DELETE") {
    try {
      // Delete all Instructor documents (clear the instructors data)
      await Instructor.deleteMany({});
      return res.status(204).send(); // Respond with a 204 status for successful deletion
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Could not delete instructors" });
    }
  }

  return res.status(400).json({ error: "Invalid request" });
};
