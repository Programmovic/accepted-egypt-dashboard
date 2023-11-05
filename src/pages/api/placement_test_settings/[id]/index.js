import connectDB from "@lib/db";
import Student from "../../../../models/student";
import PlacementTestSettings from "../../../../models/placement_test_settings";

export default async (req, res) => {
  await connectDB();
  if (req.method === "POST") {
    // Handle POST requests (e.g., creating a new test)
    try {
      const newPlacementTest = new PlacementTestSettings(req.body);
      await newPlacementTest.save();
      return res.status(201).json(newPlacementTest);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Could not create placement test" });
    }
  } else if (req.method === "GET") {
    try {
      const { id } = req.query;

      // Find the placement test settings
      const placementTestSettings = await PlacementTestSettings.findById(id);

      if (!placementTestSettings) {
        return res.status(404).json({ error: "Placement test not found" });
      }

      // Find all students with this test
      const allStudentsWithThisTest = await Student.find({ placementTest: id });

      return res.status(200).json({ placementTestSettings, students: allStudentsWithThisTest });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Could not fetch data" });
    }
  } else if (req.method === "PUT") {
    // Handle PUT requests (update placement test settings)
    try {
      const { id } = req.query;
      const updatedPlacementTest = req.body;

      // Find and update the placement test settings
      const result = await PlacementTestSettings.findByIdAndUpdate(id, updatedPlacementTest, { new: true });

      if (!result) {
        return res.status(404).json({ error: "Placement test not found" });
      }

      return res.status(200).json(result);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Could not update placement test" });
    }
  } else if (req.method === "DELETE") {
    // Handle DELETE requests (delete placement test settings)
    try {
      const { id } = req.query;

      // Delete the placement test settings
      const result = await PlacementTestSettings.findByIdAndRemove(id);

      if (!result) {
        return res.status(404).json({ error: "Placement test not found" });
      }

      return res.status(204).end(); // Respond with no content for successful deletion
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Could not delete placement test" });
    }
  } else {
    return res.status(400).json({ error: "Invalid request" });
  }
};
