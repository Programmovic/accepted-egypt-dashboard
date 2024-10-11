import connectDB from "@lib/db";
import Level from "../../../models/level";
import Batch from "../../../models/batch";

export default async (req, res) => {
  await connectDB();

  if (req.method === "POST") {
    try {
      // Fetch all levels
      const levels = await Level.find();

      if (levels.length === 0) {
        return res.status(404).json({ error: "No levels found" });
      }

      const updatedBatches = []; // Array to hold updated batches

      // Loop through each level and update batch codes
      for (const level of levels) {
        // Fetch all batches for this level
        const batches = await Batch.find({ level: level._id });

        if (batches.length === 0) {
          console.log(`No batches found for level ${level._id}`);
          continue; // Skip to the next level if no batches are found
        }

        // Sort batches by their current code to maintain order
        batches.sort((a, b) => a.code - b.code);

        // Ensure codes are incremented based on level code
        let expectedCode = +level.code + 1; // Start from level code + 1

        for (const batch of batches) {
          // Update the batch code if it doesn't match the expected code
          if (batch.code !== expectedCode) {
            batch.code = expectedCode;
            await batch.save(); // Save the updated batch
            updatedBatches.push(batch); // Add to updated batches
          }
          expectedCode++; // Increment the expected code for the next batch
        }
      }

      return res.status(200).json({
        message: "Batch codes updated successfully for all levels.",
        updatedBatches, // Return the updated batches
      });
    } catch (error) {
      console.error("Error updating batch codes:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  return res.status(400).json({ error: "Invalid request method" });
};
