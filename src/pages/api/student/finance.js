import connectDB from "@lib/db";
import Student from "../../../models/student";
import Transaction from "../../../models/transaction";
import Level from "../../../models/level";
import PlacementTest from "../../../models/placement_test";
import MarketingData from "../../../models/marketingData"; // Import the MarketingData model

export default async (req, res) => {
  await connectDB();

  if (req.method === "PUT") {
    try {
      // Fetch all students
      const students = await Student.find().populate("placementTest");

      if (!students || students.length === 0) {
        console.log("No students found");
        return res.status(404).json({ error: "No students found" });
      }

      for (const student of students) {
        // Fetch all transactions for the student
        const transactions = await Transaction.find({ student: student._id });
        console.log(
          `Transactions found for student ${student._id}:`,
          transactions
        );

        // Calculate the total paid amount from the transactions
        const totalPaid = transactions.reduce((sum, transaction) => {
          return sum + (transaction.type === "income" ? transaction.amount : 0);
        }, 0);
        let totalRequired = 0;
        // Check if there's marketing data linked by phone number
        const marketingData = await MarketingData.findOne({
          $or: [
            { phoneNo1: student.phoneNumber },
            { phoneNo2: student.phoneNumber },
          ],
        });

        // Fetch the assigned level and calculate its cost
        if (student.level) {
          const level = await Level.findOne({ name: student.level });
          if (level) {
            totalRequired += (level.price * (marketingData.levelDiscount / 100)) || 0;
          }
        }

        // Include the cost of all placement tests
        const placementTests = await PlacementTest.find({
          student: student._id,
        });
        if (placementTests && placementTests.length > 0) {
          placementTests.forEach((test) => {
            totalRequired += test.cost || 0; 
          });
        }
        if (marketingData) {
          // Apply discounts if available
          const levelDiscount = marketingData.levelDiscount || 0;
          const placementTestDiscount =
            marketingData.placementTestDiscount || 0;

        }

        // Ensure totalPaid and totalRequired are valid numbers
        const validTotalPaid = isNaN(totalPaid) ? 0 : totalPaid;
        const validTotalRequired = isNaN(totalRequired) ? 0 : totalRequired;
        

        // Calculate the due amount safely
        let dueAmount = validTotalRequired - validTotalPaid;
        let balance = 0; // Initialize balance

        if (dueAmount < 0) {
          // If due is negative, set due to 0 and assign the excess to balance
          balance = Math.abs(dueAmount);
          dueAmount = 0;
        }
        // Update the student's paid, due, and balance fields
        await Student.findByIdAndUpdate(
          student._id,
          { paid: validTotalPaid, due: dueAmount, balance: balance },
          { new: true }
        );

      }

      return res
        .status(200)
        .json({ message: "All students updated successfully" });
    } catch (error) {
      console.error("Error updating students:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  return res.status(400).json({ error: "Invalid request method" });
};
