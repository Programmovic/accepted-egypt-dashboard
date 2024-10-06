import connectDB from '@lib/db';
import Admin from '@models/admin';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';

export default async (req, res) => {
  if (req.method === 'POST') {
    try {
      await connectDB();

      const { username, password } = req.body;

      // Find the admin by username
      const admin = await Admin.findOne({ username });

      if (!admin) {
        return res.status(401).json({ error: 'Invalid username or password' });
      }

      // Verify the password
      const passwordMatch = await bcrypt.compare(password, admin.password);

      if (!passwordMatch) {
        return res.status(401).json({ error: 'Invalid username or password' });
      }

      // Generate a JWT token with admin ID and username
      const token = jwt.sign({ adminId: admin._id, username: admin.username, role: admin.role }, 'your-secret-key', {
        expiresIn: '365d',
      });

      // Set the token as a cookie in the response
      res.setHeader('Set-Cookie', serialize('token', token, {
        httpOnly: true,
        maxAge: 3600,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
      }));
      
      // Set the username and admin ID as cookies
      res.setHeader('Set-Cookie', serialize('username', admin.username, {
        httpOnly: false, // You may set it to true if needed
        maxAge: 3600,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
      }));
      res.setHeader('Set-Cookie', serialize('adminId', admin._id, {
        httpOnly: false, // You may set it to true if needed
        maxAge: 3600,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
      }));

      return res.status(200).json({ success: 'Logged in', token });

    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Could not log in' });
    }
  }

  return res.status(400).json({ error: 'Invalid request' });
};
