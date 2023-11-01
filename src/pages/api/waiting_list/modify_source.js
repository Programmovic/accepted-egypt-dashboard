import connectDB from "@lib/db";
import WaitingList from "../../../models/waiting_list";

export default async (req, res) => {
  try {
    await connectDB();

    if (req.method === "POST") {
      // Modify the source for all waiting list entries to "EWFS"
      const updateResult = await WaitingList.updateMany({}, { source: "EWFS" });

      return res.status(200).json({ message: "All waiting list entries updated to 'EWFS' source." });
    } else {
      return res.status(400).json({ error: "Invalid request" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};
