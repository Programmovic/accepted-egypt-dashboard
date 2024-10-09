import connectDB from "@lib/db";
import Admin from "@models/admin";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { serialize } from "cookie";
import authMiddleware from "../../../../middlewares/authorization"; // Import your middleware

export default async (req, res) => {
  await connectDB(); // Connect to the database

  // Run the authorization check
  await new Promise((resolve, reject) => {
    authMiddleware(req, res, (err) => {
      if (err) return reject(err);
      resolve();
    });
  });

  const { role } = req.user;

  if (req.method === "POST") {
    try {
      const { username, password } = req.body;

      // Find the admin by username
      const admin = await Admin.findOne({ username });

      if (!admin) {
        console.warn(
          `Login attempt failed: No admin found for username: ${username}`
        );
        return res.status(401).json({ error: "Invalid username or password" });
      }

      // Check if the admin is a super admin
      if (role === "super_admin") {
        console.log(`Super admin logged in without password: ${username}`);
      } else {
        // For other roles, verify the password
        const passwordMatch = await bcrypt.compare(password, admin.password);

        if (!passwordMatch) {
          console.warn(
            `Login attempt failed: Password mismatch for username: ${username}`
          );
          return res.status(401).json({ error: "Invalid username or password" });
        }
      }

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
          httpOnly: false, // You may set it to true if needed
          maxAge: 3600, // 1 hour
          sameSite: "strict",
          secure: process.env.NODE_ENV === "production",
        })
      );
      res.setHeader(
        "Set-Cookie",
        serialize("adminId", admin._id.toString(), {
          // Convert ObjectId to string
          httpOnly: false, // You may set it to true if needed
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
