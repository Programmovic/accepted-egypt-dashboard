import connectDB from "@lib/db";
import Student from "../../../../models/student";

export default async (req, res) => {
  try {
    await connectDB();

    if (req.method === "POST") {
      
    } else if (req.method === "GET") {
      const {id} = req.query
      const students = await Student.find({_id: id});
      // You can also fetch associated placement test and transaction data here if needed
      return res.status(200).json({ students });
    } else {
      return res.status(400).json({ error: "Invalid request" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};
