import connectDB from "@lib/db";
import Branch from "../../../models/branch"; // Import the Branch model

export default async (req, res) => {
  await connectDB();

  if (req.method === "POST") {
    try {
      const branchData = req.body;

      // Create a new Branch document
      const newBranch = new Branch(branchData);

      // Save the new branch to the database
      await newBranch.save();

      return res.status(201).json(newBranch);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Could not create branch" });
    }
  } else if (req.method === "GET") {
    try {
      const allBranches = await Branch.find();
      return res.status(200).json(allBranches);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Could not fetch branches" });
    }
  } else if (req.method === "PUT") {
    // Update the branch
    const { branchId, ...updateData } = req.body;
    try {
      const updatedBranch = await Branch.findByIdAndUpdate(branchId, updateData, { new: true });
      if (!updatedBranch) {
        return res.status(404).json({ error: "Branch not found" });
      }
      return res.status(200).json(updatedBranch);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Failed to update branch" });
    }
  } else if (req.method === "DELETE") {
    try {
      // Delete all Branch documents (clear the branches data)
      await Branch.deleteMany({});
      return res.status(204).send(); // Respond with a 204 status for successful deletion
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Could not delete branches" });
    }
  }

  return res.status(400).json({ error: "Invalid request" });
};
