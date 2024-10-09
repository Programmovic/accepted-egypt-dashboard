import connectDB from "@lib/db";
import Admin from "@models/admin";
import bcrypt from "bcrypt";

export default async (req, res) => {
  await connectDB();

  // Handle GET requests to fetch admin data
  if (req.method === "GET") {
    const { token } = req.query; // Token is passed as a query parameter

    if (!token) {
      return res.status(400).json({ error: "Token is required" });
    }

    try {
      const admin = await Admin.findOne({ token }).populate('employee').populate({
        path: 'employee',
        populate: [
            { path: 'position' },
            { path: 'department' }
        ]
    });
      if (!admin) {
        return res.status(404).json({ error: "Admin not found" });
      }

      // Return admin data (excluding the password)
      const { password, ...adminData } = admin.toObject(); // Convert admin document to a plain object and omit password
      console.log(adminData)
      return res.status(200).json(adminData);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Failed to fetch admin data. Please try again." });
    }
  }

  // Handle POST requests to set password
  if (req.method === "POST") {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({ error: "Token and password are required" });
    }

    try {
      const admin = await Admin.findOne({ token });
      if (!admin) {
        return res.status(404).json({ error: "Admin not found" });
      }

      // Hash the new password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Update the admin's password
      admin.password = hashedPassword;
      await admin.save();

      return res.status(200).json({ message: "Password set successfully" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Failed to set password. Please try again." });
    }
  }

  return res.status(400).json({ error: "Invalid request" });
};
