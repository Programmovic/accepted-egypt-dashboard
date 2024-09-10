import connectDB from "@lib/db";
import MarketingData from "../../../../models/marketingData";

export default async (req, res) => {
  await connectDB();

  if (req.method === "POST") {
    try {
      const { phoneNo1, phoneNo2 } = req.body;

      // Validate the input data
      if (!phoneNo1 && !phoneNo2) {
        return res.status(400).json({ error: "At least one phone number is required" });
      }

      // Prepare query conditions
      const queryConditions = [];

      if (phoneNo1) {
        queryConditions.push({ phoneNo1 });
      }
      if (phoneNo2) {
        queryConditions.push({ phoneNo2 });
      }

      // Query to check if any phone number exists in the database
      const duplicateItem = await MarketingData.findOne({
        $or: queryConditions
      });

      if (duplicateItem) {
        return res.json({ exists: true, duplicateItem });
      } else {
        return res.json({ exists: false });
      }
    } catch (error) {
      console.error("Error checking for duplicate phone numbers:", error.message);
      return res.status(500).json({ error: error.message });
    }
  } else {
    return res.status(400).json({ error: "Invalid request method" });
  }
};
