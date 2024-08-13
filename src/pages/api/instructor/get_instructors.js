import connectDB from "@lib/db";
import Employee from "../../../models/employee";
import Department from "../../../models/department";

export default async (req, res) => {
  await connectDB();

  if (req.method === "GET") {
    try {
      // Find the "Teaching" department
      const teachingDepartment = await Department.findOne({ name: "Teaching" });

      if (!teachingDepartment) {
        return res.status(404).json({ error: "Teaching department not found" });
      }

      // Find all employees in the "Teaching" department
      const teachingEmployees = await Employee.find({ department: teachingDepartment._id })
        .populate("position") // Assuming you want to populate the position details
        .populate("department"); // Populate department details as well

      return res.status(200).json(teachingEmployees);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Could not fetch employees" });
    }
  }

  return res.status(400).json({ error: "Invalid request" });
};
