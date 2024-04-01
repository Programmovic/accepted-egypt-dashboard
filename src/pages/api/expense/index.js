import connectDB from "@lib/db";
import Expense from "../../../models/expenses_type";

export default async (req, res) => {
  await connectDB();

  if (req.method === "POST") {
    try {
      const expenseData = req.body;

      // Create a new Expense document
      const newExpense = new Expense(expenseData);

      // Save the new expense to the database
      await newExpense.save();

      return res.status(201).json(newExpense);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Could not create expense" });
    }
  } else if (req.method === "GET") {
    try {
      const allExpenses = await Expense.find();
      return res.status(200).json(allExpenses);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Could not fetch expenses" });
    }
  } else if (req.method === "PUT") {
    // Update the expense
    const { expenseId, ...updateData } = req.body;
    try {
      const updatedExpense = await Expense.findByIdAndUpdate(expenseId, updateData, { new: true });
      if (!updatedExpense) {
        return res.status(404).json({ error: "Expense not found" });
      }
      return res.status(200).json(updatedExpense);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Failed to update expense" });
    }
  } else if (req.method === "DELETE") {
    try {
      // Delete all Expense documents (clear the expenses data)
      await Expense.deleteMany({});
      return res.status(204).send(); // Respond with a 204 status for successful deletion
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Could not delete expenses" });
    }
  }

  return res.status(400).json({ error: "Invalid request" });
};
