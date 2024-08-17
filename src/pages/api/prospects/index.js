import connectDB from "@lib/db";
import Prospect from "../../../models/prospect";

export default async (req, res) => {
  await connectDB();

  if (req.method === "POST") {
    try {
      const prospectData = req.body;

      // Check if a prospect with the same phoneNumber or email already exists
      const existingProspect = await Prospect.findOne({
        $or: [
          { phoneNumber: prospectData.phoneNumber },
          { email: prospectData.email },
        ],
      });

      if (existingProspect) {
        return res.status(400).json({ error: "Prospect with this phone number or email already exists" });
      }

      // Create a new Prospect document
      const newProspect = new Prospect(prospectData);

      // Save the new prospect to the database
      await newProspect.save();

      return res.status(201).json(newProspect);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Could not create prospect" });
    }
  } else if (req.method === "GET") {
    try {
      const allProspects = await Prospect.find();
      return res.status(200).json(allProspects);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Could not fetch prospects" });
    }
  } else if (req.method === "DELETE") {
    try {
      // Drop the Prospect collection (delete the entire schema and its data)
      await Prospect.collection.drop();
      return res.status(204).send(); // Respond with a 204 status for successful deletion
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Could not delete the Prospect schema" });
    }
  }

  return res.status(400).json({ error: "Invalid request" });
};
