import connectDB from "@lib/db";
import Instructor from "../../../../models/instructor";


export default async (req, res) => {
  await connectDB();

  if (req.method === "POST") {
    // ... (existing POST logic) ...
  } else if (req.method === "GET") {
    const { instructorId } = req.query;

    try {
      // Find classes taught by any of the specified instructors and populate
      const instructor = await Instructor.find({ _id: instructorId });

      return res.status(200).json(instructor);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Could not fetch classes" });
    }
  } else if (req.method === "PUT") {
    try {
      const updatedInstructorData = req.body;

      // Check if the provided instructor ID is valid
      if (!updatedInstructorData._id) {
        return res.status(400).json({ error: "Instructor ID is required for updating" });
      }

      // Find the instructor by ID
      const instructor = await Instructor.findOne({ _id: updatedInstructorData._id });

      if (!instructor) {
        return res.status(404).json({ error: "Instructor not found" });
      }

      // Update all fields of the instructor with the new data
      instructor.set(updatedInstructorData);

      // Save the updated instructor to the database
      await instructor.save();

      return res.status(200).json({ message: "Instructor data updated successfully" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Failed to update instructor data" });
    }
  } else if (req.method === "DELETE") {
    const { instructorId } = req.query;

    try {
      // Find the instructor by ID
      const instructor = await Instructor.findOne({ _id: instructorId });

      if (!instructor) {
        return res.status(404).json({ error: "Instructor not found" });
      }

      // Delete the instructor
      await instructor.deleteOne();

      return res.status(204).send(); // Respond with a 204 status for successful deletion
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Failed to delete instructor" });
    }
  }

  return res.status(400).json({ error: "Invalid request" });
};
