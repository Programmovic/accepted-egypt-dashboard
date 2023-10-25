import connectDB from "@lib/db";
import Transaction from "../../../models/transaction"; // Make sure to import the Transaction model

export default async (req, res) => {
  await connectDB();
  if (req.method === "POST") {
    // Handle creating a new transaction
    try {
      const {
        student,
        batch,
        type,
        amount,
        description
      } = req.body;

      const newTransaction = new Transaction({
        student,
        batch,
        type,
        amount,
        description
      });

      await newTransaction.save();

      return res.status(201).json(newTransaction);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Could not create a new transaction" });
    }
  } else if (req.method === "GET") {
    // Handle fetching all transactions
    try {
      const allTransactions = await Transaction.find();
      return res.status(200).json(allTransactions);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Could not fetch transactions" });
    }
  } else {
    return res.status(400).json({ error: "Invalid request" });
  }
};
