import connectDB from "@lib/db";
import MarketingDataHistory from "../../../../models/marketingHistory";
import cookie from 'cookie';

export default async (req, res) => {
  await connectDB();

  // Log all cookies
  const cookies = req.headers.cookie ? cookie.parse(req.headers.cookie) : {};
  console.log('Stored Cookies:', cookies);

  if (req.method === "GET") {
    try {
      const { marketingDataId, userId } = req.query;

      // Fetch history based on the marketingDataId or userId if provided
      const query = {};
      if (marketingDataId) query.marketingDataId = marketingDataId;
      if (userId) query.editedBy = userId;

      const history = await MarketingDataHistory.find(query)
        .populate("marketingDataId")
        .populate("editedBy")
        .sort({ editedAt: -1 }); // Sort by most recent edits

      return res.status(200).json(history);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }
  } else if (req.method === "POST") {
    try {
      const { marketingDataId, oldData, newData, editedBy } = req.body;

      // Validate the input data
      if (!marketingDataId || !oldData || !newData || !editedBy) {
        return res.status(400).json({ error: "All fields are required" });
      }

      // Create a new history entry
      const historyEntry = new MarketingDataHistory({
        marketingDataId,
        oldData,
        newData,
        editedBy,
      });

      await historyEntry.save();

      return res.status(201).json(historyEntry);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }
  } else if (req.method === "DELETE") {
    try {
      const { marketingDataId } = req.query;

      if (!marketingDataId) {
        return res.status(400).json({ error: "MarketingData ID is required" });
      }

      // Delete all history related to a specific MarketingData document
      await MarketingDataHistory.deleteMany({ marketingDataId });

      return res.status(204).send(); // Respond with no content
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }
  }

  return res.status(400).json({ error: "Invalid request method" });
};
