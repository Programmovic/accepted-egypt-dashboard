import connectDB from "@lib/db";
import Employee from "../../../models/employee";
import Department from "../../../models/department";

export default async (req, res) => {
  await connectDB();

  if (req.method === "GET") {
    try {
      // Find all employees and populate their position and department details
      const allEmployees = await Employee.find()
        .populate("position") // Populate position details
        .populate("department"); // Populate department details


      // Filter employees to get only those in the "Teaching" department
      const teachingEmployees = allEmployees.filter(
        (employee) => employee.department && employee.department.name === "Teaching"
      );

      return res.status(200).json(teachingEmployees);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Could not fetch employees" });
    }
  }

  return res.status(400).json({ error: "Invalid request" });
};
