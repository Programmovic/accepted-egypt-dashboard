import connectDB from "@lib/db";
import Employee from "../../../models/employee";
import authMiddleware from "../../../middlewares/authorization"; // Import your middleware

export default async (req, res) => {
  await connectDB();

  // Run the authorization check
  await new Promise((resolve, reject) => {
    authMiddleware(req, res, (err) => {
      if (err) return reject(err);
      resolve();
    });
  });

  // Check if the user role is super_admin
  if (req.user.role !== "super_admin") {
    console.log(req.user.adminId)
    if (req.method === "GET") {
      try {
        const employees = await Employee.find({_id: req.user.employee})
          .populate("position")
          .populate("department");
          console.log(employees)
        if (!employees) {
          return res.status(404).json({ error: "Employee not found" });
        }
        return res.status(200).json(employees); // Return only the user's own data
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Failed to fetch employee data" });
      }
    }
    

    return res.status(403).json({
      error:
        "Access denied. You do not have permission to perform this action.",
    });
  }
  if (req.method === "POST") {
    // Create a new employee
    try {
      const newEmployee = new Employee(req.body);
      await newEmployee.save();
      return res.status(201).json({
        message: "Employee created successfully",
        employee: newEmployee,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Failed to create employee" });
    }
  } 

  else if (req.method === "GET") {
    // Retrieve all employees
    try {
      const employees = await Employee.find()
        .populate("position")
        .populate("department");
      return res.status(200).json(employees);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Failed to fetch employees" });
    }
  } else if (req.method === "PUT") {
    // Update an employee
    try {
      const updatedEmployeeData = req.body;
      const { id } = updatedEmployeeData;

      // Check if the provided employee ID is valid
      if (!id) {
        return res
          .status(400)
          .json({ error: "Employee ID is required for updating" });
      }

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
    // Delete an employee
    const { id } = req.query;

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
