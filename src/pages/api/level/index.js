import connectDB from "@lib/db";
import Level from "../../../models/level";
import Batch from "../../../models/batch";
import Student from "../../../models/student";

export default async (req, res) => {
  await connectDB();

  if (req.method === "POST") {
    try {
      const levelData = req.body;

      // Create a new Attendance document
      const newLevel = new Level(levelData);

      // Save the new attendance record to the database
      await newLevel.save();

      return res.status(201).json(newLevel);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Could not create Attendance record" });
    }
  } else if (req.method === "GET") {
    try {
      // Fetch all levels
      const allLevels = await Level.find();
  
      // For each level, find batches and count students
      const levelsWithDetails = await Promise.all(
        allLevels.map(async (level) => {
          // Find batches assigned to this level
          const batches = await Batch.find({ level: level._id });
  
          // Extract batch codes
          const batchCodes = batches.map((batch) => batch.code);
  
          // Count total students assigned to those batches
          const studentCount = await Student.countDocuments({
            batch: { $in: batches.map((batch) => batch._id) },
          });
  
          // Count students in each batch
          const studentsPerBatch = await Promise.all(
            batches.map(async (batch) => {
              const count = await Student.countDocuments({ batch: batch._id });
              return {
                batchCode: batch.code,
                studentCount: count,
              };
            })
          );
  
          return {
            ...level._doc, // Spread level document fields
            batchCount: batches.length,
            batchCodes,
            studentCount,
            studentsPerBatch, // Include the student count per batch
          };
        })
      );
  
      return res.status(200).json(levelsWithDetails);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Could not fetch Attendance records" });
    }
  }
  else if (req.method === "DELETE") {
    try {
      // Delete all Attendance documents (clear the attendance data)
      await Level.deleteMany({});
      return res.status(204).send(); // Respond with a 204 status for successful deletion
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Could not delete Attendance records" });
    }
  }

  return res.status(400).json({ error: "Invalid request" });
};
