import connectDB from '@lib/db';
import Admin from '@models/admin';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

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

      // Generate a JWT token
      const token = jwt.sign({ username: admin.username, role: admin.role }, 'your-secret-key', {
        expiresIn: '1h', // Adjust the token expiration as needed
      });

      return res.status(200).json({ token }); // Send the token in the response

    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Could not log in' });
    }
  }

  return res.status(400).json({ error: 'Invalid request' });
};
