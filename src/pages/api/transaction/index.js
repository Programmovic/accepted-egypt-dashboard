import connectDB from "@lib/db";
import Transaction from "../../../models/transaction"; // Make sure to import the Transaction model
import Student from "../../../models/student";
export default async (req, res) => {
  await connectDB();
  if (req.method === "POST") {
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
  
      // Save the new transaction
      await newTransaction.save();
  
      // If both student and batch are provided, update the student's due
      if (student && batch && type === 'Income') {
        // Calculate the new due amount for the student
        const studentDoc = await Student.findById(student);
        if (studentDoc) {
          // Calculate the new due amount by subtracting the paid amount
          // from the current due amount
          const updatedDue = +studentDoc.due - +amount;
          const updatedPaid = +studentDoc.paid + +amount;
  
          // Update the student's due in the database
          await Student.findByIdAndUpdate(student, { due: updatedDue, paid: updatedPaid });
        }
      }
  
      return res.status(201).json(newTransaction);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Could not create a new transaction" });
    }
  }
   else if (req.method === "GET") {
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
