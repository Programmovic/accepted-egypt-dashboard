import connectDB from "@lib/db";
import PlacementTestSettings from "../../../../models/placement_test_settings";

export default async (req, res) => {
  await connectDB();

  if (req.method === "GET") {
    try {
      const allTests = await PlacementTestSettings.find();
      return res.status(200).json(allTests);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Could not fetch placement tests" });
    }
  } else {
    return res.status(400).json({ error: "Invalid request" });
  }
};
