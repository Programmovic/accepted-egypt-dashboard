import connectDB from "@lib/db";
import Student from "../../../models/student";
import Transaction from "../../../models/transaction";
import Level from "../../../models/level";
import PlacementTest from "../../../models/placement_test";

export default async (req, res) => {
  await connectDB();

  if (req.method === "PUT") {
    try {
      // Fetch all students
      const students = await Student.find().populate('placementTest');

      if (!students || students.length === 0) {
        console.log("No students found");
        return res.status(404).json({ error: "No students found" });
      }

      for (const student of students) {
 
        // Fetch all transactions for the student
        const transactions = await Transaction.find({ student: student._id });

        // Calculate the total paid amount from the transactions
        const totalPaid = transactions.reduce((sum, transaction) => {
          return sum + (transaction.type === "income" ? transaction.amount : 0);
        }, 0);

        let totalRequired = 0;

        // Fetch the assigned level and calculate its cost
        if (student.level) {
          const level = await Level.findOne({ name: student.level });
          if (level) {
            totalRequired += level.price || 0; // Default to 0 if level.price is undefined
            console.log(`Level for ${student.name}: ${level.name}, Price: ${level.price}`);
          }
        }

        // Include the cost of all placement tests
        const placementTests = await PlacementTest.find({ student: student._id });
        if (placementTests && placementTests.length > 0) {
          placementTests.forEach(test => {
            totalRequired += test.cost || 0; // Default to 0 if test.cost is undefined
            console.log(`Placement Test for ${student.name}: ${test.name}, Cost: ${test.cost}`);
          });
        }

        // Ensure totalPaid and totalRequired are valid numbers
        const validTotalPaid = isNaN(totalPaid) ? 0 : totalPaid;
        const validTotalRequired = isNaN(totalRequired) ? 0 : totalRequired;

        // Calculate the due amount safely
        const dueAmount = validTotalRequired - validTotalPaid;


        // Update the student's paid and due fields
        await Student.findByIdAndUpdate(
          student._id,
          { paid: validTotalPaid, due: dueAmount },
          { new: true }
        );

      }

      return res.status(200).json({ message: "All students updated successfully" });
    } catch (error) {
      console.error("Error updating students:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  return res.status(400).json({ error: "Invalid request method" });
};
