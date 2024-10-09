import connectDB from "@lib/db";
import Employee from "../../../../models/employee";
import authMiddleware from "../../../../middlewares/authorization"; // Import your middleware

export default async (req, res) => {
  await connectDB();

  // Run the authorization check
  await new Promise((resolve, reject) => {
    authMiddleware(req, res, (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
  // Retrieve a single employee
  const { id } = req.query;
  // Check if the user role is super_admin or admin
  const { role, employee } = req.user;
  console.log(employee, id)
  if (role !== "super_admin" && employee.toString() !== id) {
    return res.status(403).json({
      error:
        "Access denied. You do not have permission to perform this action.",
    });
  }

  if (req.method === "GET") {
    try {
      const employee = await Employee.findById(id).populate("admin");

      if (!employee) {
        return res.status(404).json({ error: "Employee not found" });
      }

      return res.status(200).json(employee);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Failed to fetch employee" });
    }
  } else if (req.method === "PUT") {
    try {
      const updatedEmployeeData = req.body;

      // Find the employee by ID
      const employee = await Employee.findById(id);

      if (!employee) {
        return res.status(404).json({ error: "Employee not found" });
      }

      // Update all fields of the employee with the new data
      Object.assign(employee, updatedEmployeeData);

      // Save the updated employee to the database
      await employee.save();

      return res
        .status(200)
        .json({ message: "Employee data updated successfully", employee });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Failed to update employee data" });
    }
  } else if (req.method === "DELETE") {
    try {
      // Find the employee by ID
      const employee = await Employee.findById(id);

      if (!employee) {
        return res.status(404).json({ error: "Employee not found" });
      }

      // Delete the employee
      await employee.deleteOne();

      return res.status(204).send(); // Respond with a 204 status for successful deletion
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Failed to delete employee" });
    }
  }

  return res.status(400).json({ error: "Invalid request" });
};
