import connectDB from "@lib/db";
import MarketingData from "../../../models/marketing";
import Employee from "../../../models/employee"; // Import Employee model

export default async (req, res) => {
  await connectDB();

  if (req.method === "POST") {
    try {
      let marketingData = req.body;

      if (!Array.isArray(marketingData)) {
        // If marketingData is not an array, convert it to an array with a single object
        marketingData = [marketingData];
      }

      // Map over each item in marketingData to create new documents
      const newMarketingData = await Promise.all(
        marketingData.map(async (data) => {
          const newDocument = new MarketingData(data);
          await newDocument.save();
          return newDocument.toJSON();
        })
      );

      return res.status(201).json(newMarketingData);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }
  } else if (req.method === "GET") {
    try {
      const {
        id,
        assignedToModerator,
        assignedToMember,
        pending,
        recruitment,
      } = req.query;

      if (id) {
        // Fetch specific MarketingData record by ID
        const marketingData = await MarketingData.findById(id);

        if (!marketingData) {
          return res.status(404).json({ error: "Marketing data not found" });
        }

        return res.status(200).json(marketingData.toJSON());
      } else {
        let allMarketingData = [];
        if (assignedToModerator) {
          // Fetch all MarketingData records assigned to moderators and sort by creation date (newest first)
          allMarketingData = await MarketingData.find({
            assignedToModeration: { $exists: true, $ne: null, $ne: "" },
          }).sort({ createdAt: -1 });
        } else if (assignedToMember) {
          // Fetch all MarketingData records assigned to members and sort by creation date (newest first)
          allMarketingData = await MarketingData.find({
            assignedToSales: { $exists: true, $ne: null, $ne: "" },
          }).sort({ createdAt: -1 });
        } else if (pending) {
          allMarketingData = await MarketingData.find({
            paymentMethod: { $ne: null },
          })
            .sort({ createdAt: -1 })
            .populate([{ path: "placementTest", strictPopulate: false }]);
        } else if (recruitment) {
          allMarketingData = await MarketingData.find({
            candidateSignUpFor: "Recruitment",
          }).sort({ createdAt: -1 });
        } else {
          // Fetch all MarketingData records and sort by creation date (newest first)
          allMarketingData = await MarketingData.find().sort({ createdAt: -1 });
        }

        // Fetch employees in sales department with position matching 'member' or 'moderator' (case-insensitive)
        const salesModerators = await Employee.find({
          department: { $regex: new RegExp("^Sales$", "i") }, // Case-insensitive match for department
          position: { $regex: new RegExp("^Sales Supervisor$", "i") }, // Case-insensitive match for position
        });
        const salesMembers = await Employee.find({
          department: { $regex: new RegExp("^Sales$", "i") }, // Case-insensitive match for department
          position: { $regex: new RegExp("^Sales Agent$", "i") }, // Case-insensitive match for position
        });

        return res.status(200).json({
          marketingData: allMarketingData,
          salesModerators: salesModerators,
          salesMembers: salesMembers,
        });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }
  } else if (req.method === "PUT") {
    try {
      const { id } = req.query;
      const updates = req.body;

      // Update MarketingData document by ID
      const updatedMarketingData = await MarketingData.findByIdAndUpdate(
        id,
        updates,
        { new: true }
      );

      if (!updatedMarketingData) {
        return res.status(404).json({ error: "Marketing data not found" });
      }

      return res.status(200).json(updatedMarketingData.toJSON());
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }
  } else if (req.method === "DELETE") {
    try {
      // Delete all MarketingData documents
      await MarketingData.deleteMany({});
      return res.status(204).send(); // Respond with a 204 status code for successful deletion
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }
  }

  return res.status(400).json({ error: "Invalid request" });
};
