import connectDB from '@lib/db';
import Admin from '@models/admin';

export default async (req, res) => {
  await connectDB();

  if (req.method === 'GET') {
    try {
      const { id } = req.query; // Get the username from the query parameters

      // Find the admin by the provided username
      const admin = await Admin.findOne({ id });

      if (!admin) {
        return res.status(404).json({ error: 'Admin not found' });
      }

      // Return the specific user data
      return res.status(200).json(admin);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Could not retrieve user data' });
    }
  }

  return res.status(400).json({ error: 'Invalid request' });
};
