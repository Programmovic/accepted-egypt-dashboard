import connectDB from "@lib/db";
import Transaction from "../../../models/transaction"; // Make sure to import the Transaction model
import Student from "../../../models/student";
import { verify } from "jsonwebtoken";
const secret = process.env.JWT_SECRET; // Ensure you have a secret for signing tokens

export default async (req, res) => {
  await connectDB();
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Authorization token is missing" });
  }
  let decodedToken;
  try {
    // Verify the token
    decodedToken = verify(token, secret);
  } catch (error) {
    console.error(error);
    return res.status(401).json({ error: "Invalid authorization token" });
  }
  if (req.method === "POST") {
    try {
      const {
        student,
        batch,
        type,
        expense_type,
        amount,
        description,
        paymentMethod,
      } = req.body;

      const newTransaction = new Transaction({
        student,
        batch,
        type,
        expense_type,
        amount,
        description,
        paymentMethod,
      });

      // Save the new transaction
      await newTransaction.save();

      // If both student and batch are provided, update the student's due
      if (student && batch && type === "Income") {
        // Calculate the new due amount for the student
        const studentDoc = await Student.findById(student);
        if (studentDoc) {
          // Calculate the new due amount by subtracting the paid amount
          // from the current due amount
          const updatedDue = +studentDoc.due - +amount;
          const updatedPaid = +studentDoc.paid + +amount;

          // Update the student's due in the database
          await Student.findByIdAndUpdate(student, {
            due: updatedDue,
            paid: updatedPaid,
          });
        }
      }

      return res.status(201).json(newTransaction);
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ error: "Could not create a new transaction" });
    }
  } else if (req.method === "GET") {
    // Handle fetching all transactions
    if (decodedToken.role === "super_admin") {
      try {
        const allTransactions = await Transaction.find().populate(
          "paymentMethod"
        );
        return res.status(200).json(allTransactions);
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Could not fetch transactions" });
      }
    } else {
      return res
        .status(403)
        .json({
          error:
            "Access denied. You do not have permission to perform this action.",
        });
    }
  } else if (req.method === "DELETE") {
    try {
      const transactionId = req.query.id; // Access the transaction ID from the route parameter

      // Check if the transaction with the given ID exists
      const transaction = await Transaction.findById(transactionId);

      if (!transaction) {
        // Handle the case when the transaction is not found
        return res.status(404).json({ error: "Transaction not found" });
      }

      // Delete the transaction from the database
      await transaction.deleteOne();

      return res.status(204).send(); // Respond with a 204 status for successful deletion
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }
  } else if (req.method === "PUT") {
    try {
      const transactionId = req.query.id; // Access the transaction ID from the route parameter
      const { amount, description, type } = req.body;

      // Check if the transaction with the given ID exists
      const transaction = await Transaction.findById(transactionId);

      if (!transaction) {
        // Handle the case when the transaction is not found
        return res.status(404).json({ error: "Transaction not found" });
      }

      // Update the transaction properties
      if (amount) {
        transaction.amount = amount;
      }
      if (description) {
        transaction.description = description;
      }
      if (type) {
        transaction.type = type;
      }

      // Save the updated transaction
      await transaction.save();

      return res.status(200).json(transaction);
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ error: "Could not update the transaction" });
    }
  } else {
    return res.status(400).json({ error: "Invalid request" });
  }
};
