import connectDB from '@lib/db';
import Reservation from '../../../models/reservation';
import mongoose from 'mongoose';

export default async (req, res) => {
  await connectDB();
  if (req.method === 'GET') {
    try {
      const { date, startTime, endTime, roomId } = req.query;

      // Validate input
      if (!date || !startTime || !endTime || !roomId) {
        return res.status(400).json({ error: 'Missing required parameters' });
      }

      // Fetch reservations for the given date and room
      const reservationsOnDate = await Reservation.find({
        date: new Date(date),
        room: roomId
      });

      // Filter reservations based on time overlap using the 'HH:MM' format
      const filteredReservations = reservationsOnDate.filter(reservation => {
        return (
          (reservation.startTime < endTime && reservation.endTime > startTime) ||
          (reservation.startTime <= startTime && reservation.endTime >= endTime)
        );
      });

      return res.status(200).json(filteredReservations);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    return res.status(400).json({ error: 'Invalid request' });
  }
};
