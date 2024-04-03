import connectDB from "@lib/db";
import Transaction from "../../../models/transaction"; // Make sure to import the Transaction model
import xlsx from "xlsx";

export default async (req, res) => {
  await connectDB();
  if (req.method === "GET") {
    try {
      // Fetch all transactions from the database
      const allTransactions = await Transaction.find();

      // Prepare data for Excel file
      const data = allTransactions.map((transaction) => ({
        Student: transaction.student,
        Batch: transaction.batch,
        Type: transaction.type,
        ExpenseType: transaction.expense_type,
        Amount: transaction.amount,
        Description: transaction.description,
      }));

      // Create a new workbook
      const wb = xlsx.utils.book_new();

      // Add a worksheet and fill it with the data
      const ws = xlsx.utils.json_to_sheet(data);
      xlsx.utils.book_append_sheet(wb, ws, "Transactions");

      // Generate the Excel file buffer
      const buffer = xlsx.write(wb, { type: "buffer", bookType: "xlsx" });

      // Set response headers for file download
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=transactions.xlsx"
      );
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );

      // Send the Excel file buffer as the response
      return res.status(200).send(buffer);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Could not export transactions" });
    }
  } else {
    return res.status(400).json({ error: "Invalid request method" });
  }
};
