import connectDB from "@lib/db";
import PlacementTestSettings from "../../../../models/placement_test_settings";
import PlacementTest from "../../../../models/placement_test";

export default async (req, res) => {
  await connectDB();

  if (req.method === "PUT") {
    try {
      // Fetch all placement test settings
      const allTests = await PlacementTestSettings.find();

      // Iterate over each test setting
      for (const test of allTests) {
        // Count the number of students for the current test setting
        const studentCount = await PlacementTest.countDocuments({
          generalPlacementTest: test._id,
        });

        // Update the test setting with the student count
        await PlacementTestSettings.findByIdAndUpdate(test._id, {
          studentCount,
        });
      }

      return res.status(200).json({ message: "Student counts updated successfully" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Could not update student counts" });
    }
  } else {
    return res.status(400).json({ error: "Invalid request method" });
  }
};
