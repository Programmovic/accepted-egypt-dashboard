import connectDB from "@lib/db";
import Admin from "@models/admin";
import Employee from "@models/employee";
import bcrypt from "bcrypt";
const { v4: uuidv4 } = require("uuid"); // Import UUID for token generation

export default async (req, res) => {
  await connectDB();
  if (req.method === "POST") {
    // Create a new admin
    try {
      const { username, password, role, token, tokenExpiration, employee } =
        req.body;
      // Check if an admin with the same username already exists
      const existingAdmin = await Admin.findOne({ username });
      if (existingAdmin) {
        return res
          .status(400)
          .json({ error: "Admin with this username already exists" });
      }
      // Hash the password
      const hashedPassword = await bcrypt.hash(
        password || "admin@accepted",
        10
      );
      // Create a new Admin document with the hashed password
      const newAdmin = new Admin({
        username,
        password: hashedPassword,
        role,
        token,
        tokenExpiration,
        employee,
      });
      // Save the new admin to the database
      await newAdmin.save();
      await Employee.findByIdAndUpdate(employee, { admin: newAdmin._id });

      return res.status(201).json(newAdmin);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Could not create admin" });
    }
  } else if (req.method === "GET") {
    // Fetch all admins
    try {
      const allAdmins = await Admin.find().populate({
        path: "employee",
        populate: [{ path: "position" }, { path: "department" }],
      });
      return res.status(200).json(allAdmins);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Could not fetch admins" });
    }
  } else if (req.method === "PUT") {
    // Update an admin
    try {
      const { id } = req.query;
      const updatedUser = req.body;
      const updatedAdmin = await Admin.findByIdAndUpdate(id, updatedUser, {
        new: true,
      });
      if (!updatedAdmin) {
        return res.status(404).json({ error: "Admin not found" });
      }
      return res.status(200).json(updatedAdmin);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Could not update admin" });
    }
  } else if (req.method === "DELETE") {
    // Delete all admins
    try {
      await Admin.deleteMany({});
      return res.status(204).send(); // Respond with a 204 status for a successful deletion
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Could not delete admins" });
    }
  }
  return res.status(400).json({ error: "Invalid request" });
};
