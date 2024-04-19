import connectDB from '@lib/db';
import Admin from '@models/admin';

export default async (req, res) => {
  await connectDB();

  if (req.method === 'GET') {
    // Retrieve a specific admin by ID
    try {
      const { id } = req.query;
      const admin = await Admin.findById(id);
      if (!admin) {
        return res.status(404).json({ error: 'Admin not found' });
      }
      return res.status(200).json(admin);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Could not retrieve user data' });
    }
  } else if (req.method === 'DELETE') {
    // Delete a specific admin by ID
    try {
      const { id } = req.query;
      const deletedAdmin = await Admin.findByIdAndDelete(id);
      if (!deletedAdmin) {
        return res.status(404).json({ error: 'Admin not found' });
      }
      return res.status(204).send(); // Respond with a 204 status for a successful deletion
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Could not delete admin' });
    }
  }

  return res.status(400).json({ error: 'Invalid request' });
};
