// pages/api/room/[roomId]/status-logs.js

import connectDB from '@lib/db';
import RoomStatusHistory from '../../../../models/roomStatusHistory';

export default async (req, res) => {
  await connectDB();

  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const logs = await RoomStatusHistory.find({ room: id })
        .populate('changedByAdmin')  // Assuming Admin model has a 'name' field
        .sort({ createdAt: -1 });
      res.status(200).json(logs);
    } catch (error) {
      console.error('Failed to get room status logs', error);
      res.status(500).json({ message: 'Failed to get logs' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
};
