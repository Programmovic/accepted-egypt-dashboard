import connectDB from "@lib/db";
import Student from "../../../../models/student";

export default async (req, res) => {
  await connectDB();
  if (req.method === "POST") {
  } else if (req.method === "GET") {
    try {
      const { id } = req.query
      const allStudentsWithThisTest = await Student.find({ placementTest: id });
      return res.status(200).json(allStudentsWithThisTest);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Could not fetch instructors" });
    }
  } else {
    return res.status(400).json({ error: "Invalid request" });
  }
};

