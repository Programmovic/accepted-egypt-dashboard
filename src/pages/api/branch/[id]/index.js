import connectDB from "@lib/db";
import Branch from "../../../../models/branch";

export default async (req, res) => {
  await connectDB();

  const branchId = req.query.id;

  switch (req.method) {
    case "GET":
      try {
        const branch = await Branch.findById(branchId).populate(
          "manager",
          "name"
        );
        if (!branch) {
          return res.status(404).json({ error: "Branch not found" });
        }
        return res.status(200).json(branch);
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Could not fetch branch" });
      }

    case "PUT":
      try {
        const updateData = req.body;
        const updatedBranch = await Branch.findByIdAndUpdate(
          branchId,
          updateData,
          { new: true }
        ).populate("manager", "name");
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
        const deletedBranch = await Branch.findByIdAndDelete(branchId);
        if (!deletedBranch) {
          return res.status(404).json({ error: "Branch not found" });
        }
        return res.status(204).send();
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Could not delete branch" });
      }

    default:
      return res.status(400).json({ error: "Invalid request" });
  }
};
