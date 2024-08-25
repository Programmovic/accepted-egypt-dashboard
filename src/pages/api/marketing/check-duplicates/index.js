import connectDB from "@lib/db";
import MarketingData from "../../../../models/marketingData";

export default async (req, res) => {
  await connectDB();

  if (req.method === "POST") {
    try {
      const { phoneNo1, phoneNo2 } = req.body;

      // Validate the input data
      if (!phoneNo1) {
        return res.status(400).json({ error: "PhoneNo1 is required" });
      }

      // Query to check if the phone numbers exist in any record
      const duplicateItem = await MarketingData.findOne({
        $or: [
          { phoneNo1 },
          { phoneNo2 },
          { phoneNo1: phoneNo2 }, // Check if phoneNo1 in the current item matches phoneNo2 in any record
          { phoneNo2: phoneNo1 }  // Check if phoneNo2 in the current item matches phoneNo1 in any record
        ]
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
