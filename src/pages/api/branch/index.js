import connectDB from "@lib/db";
import Branch from "../../../models/branch"; // Import the Branch model
import Employee from "../../../models/employee"; // Assuming the Employee model is set up similarly

export default async (req, res) => {
  await connectDB();

  switch (req.method) {
    case "POST":
      try {
        const branchData = req.body;
        const newBranch = new Branch(branchData);
        await newBranch.save();
        return res.status(201).json(newBranch);
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Could not create branch" });
      }

    case "GET":
      try {
        const allBranches = await Branch.find().populate('manager', 'name');
        return res.status(200).json(allBranches);
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Could not fetch branches" });
      }

    case "PUT":
      try {
        const { branchId, ...updateData } = req.body;
        const updatedBranch = await Branch.findByIdAndUpdate(branchId, updateData, { new: true }).populate('manager', 'name');
        if (!updatedBranch) {
          return res.status(404).json({ error: "Branch not found" });
        }
        return res.status(200).json(updatedBranch);
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Failed to update branch" });
      }

    case "DELETE":
      try {
        await Branch.deleteMany({});
        return res.status(204).send();
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Could not delete branches" });
      }

    default:
      return res.status(400).json({ error: "Invalid request" });
  }
};
