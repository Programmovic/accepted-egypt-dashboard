import connectDB from "@lib/db";
import Transaction from "../../../../models/transaction";

export default async (req, res) => {
  await connectDB();
  if (req.method === "GET") {
    try {
      const studentId = req.query.id; // Access the student ID from the query parameter

      // Find transactions associated with the given student ID
      const transactions = await Transaction.find({ student: studentId })
        .populate("student") // Populate the 'student' field
        .populate("batch"); // Populate the 'batch' field

      if (!transactions || transactions.length === 0) {
        // Handle the case when no transactions are found for the student
        return res.status(404).json({ error: "Transactions not found for the student" });
      }

      // Respond with the found transactions
      return res.status(200).json(transactions);
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ error: "Could not fetch the transactions for the student" });
    }
  } else {
    return res.status(400).json({ error: "Invalid request" });
  }
};
