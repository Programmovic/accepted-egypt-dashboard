import connectDB from "@lib/db";
import PlacementTest from "../../../models/placement_test";

export default async (req, res) => {
  await connectDB();
  if (req.method === "POST") {
    
  } else if (req.method === "GET") {
    try {
      const allTests = await PlacementTest.find();
      return res.status(200).json(allTests);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Could not fetch instructors" });
    }
  } else {
    return res.status(400).json({ error: "Invalid request" });
  }
};

