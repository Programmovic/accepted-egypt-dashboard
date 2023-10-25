import connectDB from "@lib/db";
import Group from "../../../../models/group";

export default async (req, res) => {
  await connectDB();

  if (req.method === "DELETE") {
    try {
      const groupId = req.query.id; // Access the group ID from the route parameter

      // Check if the group with the given ID exists
      const group = await Group.findById(groupId);

      if (!group) {
        return res.status(404).json({ error: "Group not found" });
      }

      // Delete the group from the database
      await group.deleteOne();

      return res.status(204).send(); // Respond with a 204 status for successful deletion
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }
  }

  return res.status(400).json({ error: "Invalid request" });
};
