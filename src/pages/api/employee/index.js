// employee.js
import connectDB from "@lib/db";
import Employee from "../../../models/employee";

export default async (req, res) => {
  await connectDB();

  if (req.method === "POST") {
    try {
      const employeeData = req.body;

      // Create a new Employee document
      const newEmployee = new Employee(employeeData);

      // Save the new employee to the database
      await newEmployee.save();

      return res.status(201).json(newEmployee);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Could not create employee" });
    }
  } else if (req.method === "GET") {
    try {
      const allEmployees = await Employee.find();
      return res.status(200).json(allEmployees);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Could not fetch employees" });
    }
  } else if (req.method === "DELETE") {
    try {
      // Delete all Employee documents (clear the employees data)
      await Employee.deleteMany({});
      return res.status(204).send(); // Respond with a 204 status for successful deletion
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Could not delete employees" });
    }
  }

  return res.status(400).json({ error: "Invalid request" });
};
