// pages/api/department.js
import connectDB from '@lib/db'; // Assuming this is your DB connection helper
import Department from '../../../models/department'; // Import the Department model

export default async (req, res) => {
  await connectDB();

  switch (req.method) {
    case 'POST':
      return createDepartment(req, res);
    case 'GET':
      return readDepartments(req, res);
    case 'PUT':
      return updateDepartment(req, res);
    case 'DELETE':
      return deleteDepartment(req, res);
    default:
      return res.status(405).json({ error: 'Method not allowed' });
  }
};

const createDepartment = async (req, res) => {
  try {
    const { name } = req.body;
    const department = new Department({ name });
    await department.save();
    res.status(201).json(department);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Could not create the department' });
  }
};

const readDepartments = async (req, res) => {
  try {
    const departments = await Department.find();
    res.status(200).json(departments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Could not fetch departments' });
  }
};

const updateDepartment = async (req, res) => {
  const { id } = req.query;
  const updateData = req.body;

  try {
    const updatedDepartment = await Department.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedDepartment) {
      return res.status(404).json({ error: 'Department not found' });
    }
    res.status(200).json(updatedDepartment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Could not update the department' });
  }
};

const deleteDepartment = async (req, res) => {
  const { id } = req.query;

  try {
    const department = await Department.findByIdAndDelete(id);
    if (!department) {
      return res.status(404).json({ error: 'Department not found' });
    }
    res.status(200).json({ message: 'Department deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Could not delete the department' });
  }
};
