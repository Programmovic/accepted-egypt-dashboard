// attendance.js
import connectDB from "@lib/db";
import Attendance from "../../../models/attendance";

export default async (req, res) => {
  await connectDB();

  if (req.method === "DELETE") {
    try {
      // Group by trainee and lecture, and find duplicates
      const duplicates = await Attendance.aggregate([
        {
          $group: {
            _id: { trainee: "$trainee", lecture: "$lecture" },
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
      await Attendance.deleteMany({ _id: { $in: deletedIds } });

      return res.status(200).json({ message: "Duplicates removed successfully" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Could not remove duplicates" });
    }
  }

  return res.status(400).json({ error: "Invalid request" });
};
