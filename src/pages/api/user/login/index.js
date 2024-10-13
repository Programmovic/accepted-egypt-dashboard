import connectDB from "@lib/db";
import Admin from "@models/admin";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { serialize } from "cookie";

export default async (req, res) => {
  if (req.method === "POST") {
    try {
      await connectDB(); // Connect to the database

      const { username, password } = req.body;

      // Find the admin by username
      const admin = await Admin.findOne({ username });

      if (!admin) {
        console.warn(`Login attempt failed: No admin found for username: ${username}`);
        return res.status(401).json({ error: "Invalid username or password" });
      }

      // Verify the password
      const passwordMatch = await bcrypt.compare(password, admin.password);

      if (!passwordMatch) {
        console.warn(`Login attempt failed: Password mismatch for username: ${username}`);
        return res.status(401).json({ error: "Invalid username or password" });
      }

      // Mark admin as online and set last active timestamp
      admin.isOnline = true; // Set admin status to online
      admin.lastActive = new Date(); // Set last active time to now
      await admin.save(); // Save changes to the database

      // Generate a JWT token with admin ID and username
      const token = jwt.sign(
        {
          adminId: admin._id,
          username: admin.username,
          role: admin.role,
          employee: admin.employee,
        },
        process.env.JWT_SECRET,
        { expiresIn: "365d" } // Consider using a shorter expiration for security reasons
      );

      // Set the token as a cookie in the response
      res.setHeader(
        "Set-Cookie",
        serialize("token", token, {
          httpOnly: true,
          maxAge: 3600, // 1 hour
          sameSite: "strict",
          secure: process.env.NODE_ENV === "production",
        })
      );

      // Set the username and admin ID as cookies
      res.setHeader(
        "Set-Cookie",
        serialize("username", admin.username, {
          httpOnly: false,
          maxAge: 3600, // 1 hour
          sameSite: "strict",
          secure: process.env.NODE_ENV === "production",
        })
      );
      res.setHeader(
        "Set-Cookie",
        serialize("adminId", admin._id.toString(), {
          httpOnly: false,
          maxAge: 3600, // 1 hour
          sameSite: "strict",
          secure: process.env.NODE_ENV === "production",
        })
      );

      return res.status(200).json({ success: "Logged in", token });
    } catch (error) {
      console.error("Error during login:", error);
      return res.status(500).json({ error: "Could not log in" });
    }
  }

  return res.status(400).json({ error: "Invalid request" });
};
