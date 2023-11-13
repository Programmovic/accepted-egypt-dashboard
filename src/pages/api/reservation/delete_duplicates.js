// api/reservation/duplicate.js
import connectDB from "@lib/db";
import Reservation from "../../../models/reservation";

export default async (req, res) => {
  await connectDB();

  if (req.method === "DELETE") {
    try {
      // Group by title, room, date, startTime, and endTime, and find duplicates
      const duplicates = await Reservation.aggregate([
        {
          $group: {
            _id: { title: "$title", room: "$room", date: "$date", startTime: "$startTime", endTime: "$endTime" },
            count: { $sum: 1 },
            ids: { $push: "$_id" },
          },
        },
        {
          $match: {
            count: { $gt: 1 },
          },
        },
      ]);

      // Iterate over duplicates and keep only one record
      const deletedIds = [];
      for (const duplicate of duplicates) {
        const [toKeep, ...toDelete] = duplicate.ids;
        deletedIds.push(...toDelete);

        // Optionally, you may want to keep some specific record (toKeep)
        // based on certain criteria. The example here keeps the first record.
      }

      // Remove the duplicate records
      await Reservation.deleteMany({ _id: { $in: deletedIds } });

      return res.status(200).json({ message: "Duplicates removed successfully" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Could not remove duplicates" });
    }
  }

  return res.status(400).json({ error: "Invalid request" });
};
