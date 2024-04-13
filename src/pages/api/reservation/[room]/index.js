import connectDB from "@lib/db";
import Reservation from "../../../../models/reservation"; // Make sure to import the Room model
import Student from "../../../../models/student"; // Ensure this model is correctly imported

export default async (req, res) => {
  await connectDB();

  if (req.method === "GET") {
    try {
      const { room } = req.query;
      const allReservations = await Reservation.find({ room: room }).populate('batch room');

      const reservationsWithStudentCount = await Promise.all(
        allReservations.map(async (reservation) => {
          if (reservation.batch) { // Ensure there is a batch to count students for
            const studentCount = await Student.countDocuments({ batch: reservation.batch._id });
            return {
              ...reservation.toObject(), // Spread the reservation data
              batch: { // Include modified batch data with student count
                ...reservation.batch.toObject(),
                studentCount
              }
            };
          }
          return reservation.toObject(); // Return unmodified reservation if no batch
        })
      );

      return res.status(200).json(reservationsWithStudentCount);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }
  } else {
    return res.status(400).json({ error: "Invalid request" });
  }
};
