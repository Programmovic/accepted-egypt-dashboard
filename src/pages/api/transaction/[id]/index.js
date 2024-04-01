import connectDB from "@lib/db";
import Transaction from "../../../../models/transaction";

export default async (req, res) => {
  await connectDB();
  if (req.method === "GET") {
    try {
      const transactionId = req.query.id; // Access the transaction ID from the route parameter

      // Check if the transaction with the given ID exists
      const transaction = await Transaction.findById(transactionId)
        .populate("student") // Populate the 'student' field
        .populate("batch"); // Populate the 'batch' field

      if (!transaction) {
        // Handle the case when the transaction is not found
        return res.status(404).json({ error: "Transaction not found" });
      }

      // Respond with the found transaction
      return res.status(200).json(transaction);
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ error: "Could not fetch the transaction" });
    }
  } else {
    return res.status(400).json({ error: "Invalid request" });
  }
};
