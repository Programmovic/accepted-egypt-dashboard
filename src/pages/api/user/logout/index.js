import connectDB from "@lib/db";
import Admin from "@models/admin";
import authMiddleware from "../../../../middlewares/authorization";

export default async (req, res) => {
  await connectDB(); // Connect to the database

  await new Promise((resolve, reject) => {
    authMiddleware(req, res, (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
  if (req.method === "POST") {
    try {
      
      

      const { adminId } = req.user; // Get the adminId from the request user

      // Mark admin as offline
      const admin = await Admin.findById(adminId);
      if (admin) {
        admin.isOnline = false; // Set admin status to offline
        admin.lastActive = new Date(); // Optional: Update last active time
        await admin.save(); // Save changes to the database
      }

      // Clear the token cookie to log the user out
      res.setHeader('Set-Cookie', 'token=; HttpOnly; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT');
      return res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
      console.error('Error during logout:', error);
      return res.status(500).json({ error: 'Could not log out' });
    }
  }

  return res.status(400).json({ error: 'Invalid request' });
};
