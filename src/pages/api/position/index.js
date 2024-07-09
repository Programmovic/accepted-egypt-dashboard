import connectDB from '@lib/db';
import Position from '../../../models/position';

export default async (req, res) => {
  await connectDB();

  switch (req.method) {
    case 'POST':
      return createPosition(req, res);
    case 'GET':
      return readPositions(req, res);
    case 'PUT':
      return updatePosition(req, res);
    case 'DELETE':
      return deletePosition(req, res);
    default:
      return res.status(405).json({ error: 'Method not allowed' });
  }
};

const createPosition = async (req, res) => {
  try {
    const { name } = req.body;
    const position = new Position({ name });
    await position.save();
    res.status(201).json(position);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Could not create the position' });
  }
};

const readPositions = async (req, res) => {
  try {
    const positions = await Position.find();
    res.status(200).json(positions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Could not fetch positions' });
  }
};

const updatePosition = async (req, res) => {
  const { id } = req.query;
  const updateData = req.body;

  try {
    const updatedPosition = await Position.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedPosition) {
      return res.status(404).json({ error: 'Position not found' });
    }
    res.status(200).json(updatedPosition);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Could not update the position' });
  }
};

const deletePosition = async (req, res) => {
  const { id } = req.query;

  try {
    const position = await Position.findByIdAndDelete(id);
    if (!position) {
      return res.status(404).json({ error: 'Position not found' });
    }
    res.status(200).json({ message: 'Position deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Could not delete the position' });
  }
};
