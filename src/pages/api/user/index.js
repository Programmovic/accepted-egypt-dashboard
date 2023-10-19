import connectDB from '@lib/db';
import Admin from '@models/admin';
import bcrypt from 'bcrypt';

export default async (req, res) => {
  await connectDB();
  if (req.method === 'POST') {
    try {
      const { username, password, role } = req.body;

      // Check if an admin with the same username already exists
      const existingAdmin = await Admin.findOne({ username });

      if (existingAdmin) {
        return res.status(400).json({ error: 'Admin with this username already exists' });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create a new Admin document with the hashed password
      const newAdmin = new Admin({ username, password: hashedPassword, role });

      // Save the new admin to the database
      await newAdmin.save();

      return res.status(201).json(newAdmin);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Could not create admin' });
    }
  } else if (req.method === 'GET') {
    try {
      const allAdmins = await Admin.find();
      return res.status(200).json(allAdmins);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Could not fetch admins' });
    }
  }
  else if (req.method === 'DELETE') {
    try {
      // Drop the Admin collection (delete the entire schema and its data)
      await Admin.collection.drop();

      return res.status(204).send(); // Respond with a 204 status for a successful deletion
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Could not delete the Admin schema' });
    }
  }

  return res.status(400).json({ error: 'Invalid request' });
};
