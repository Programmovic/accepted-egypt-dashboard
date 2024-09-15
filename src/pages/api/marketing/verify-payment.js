import connectDB from "@lib/db";
import PendingPayment from "../../../models/pendingLeadPayment";
import Student from "../../../models/student";
import PlacementTest from "../../../models/placement_test";
import Transaction from "../../../models/Transaction";
import WaitingList from "../../../models/waiting_list";

export default async (req, res) => {
  await connectDB();

  if (req.method === "GET") {
    try {
      const { leadId } = req.query;
      let pending;
      if (leadId !== undefined) {
        pending = await PendingPayment.find({ leadId }).sort({ editedAt: -1 });
      } else {
        pending = await PendingPayment.find().sort({ editedAt: -1 });
      }

      return res.status(200).json(pending);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }
  } else if (req.method === "PUT") {
    try {
      const { id } = req.query;
      const { paymentStatus, paymentType, marketingData } = req.body;

      // Extract only the name from the assignedLevel object
      if (marketingData?.assignedLevel?.name) {
        marketingData.assignedLevel = marketingData.assignedLevel.name;
      }

      // Validate input
      if (!id || !paymentStatus) {
        return res
          .status(400)
          .json({ error: "Payment ID and status are required" });
      }

      // Update the payment status
      const updatedPayment = await PendingPayment.findByIdAndUpdate(
        { _id: id },
        { paymentStatus },
        { new: true }
      );

      try {
        // Find or create the student profile
        let student = await Student.findOne({
          phoneNumber: marketingData.phoneNo1,
          nationalId: marketingData.nationalId,
        });

        if (!student) {
          // Create a new student profile
          student = new Student({
            name: marketingData.name,
            phoneNumber: marketingData.phoneNo1,
            email: marketingData.email,
            nationalId: marketingData.nationalId,
            interestedInCourse: marketingData.interestedInCourse,
            placementTestDate: marketingData?.placementTest?.date,
          });
          await student.save();
        }

        // Handle Placement Test Payment
        if (paymentStatus === "Verified" && paymentType === "Placement Test") {
          // Find or create the placement test entry
          let placementTest = await PlacementTest.findOne({
            student: student._id,
          });

          if (!placementTest) {
            const placementTestEntry = new PlacementTest({
              student: student._id,
              generalPlacementTest: marketingData.placementTest,
              studentName: student.name,
              status: "Scheduled",
              studentNationalID: student.nationalId,
              studentPhoneNumber: student.phoneNumber,
              cost: marketingData.cost,
            });
            await placementTestEntry.save();
          }

          // Find or create the transaction entry
          let transaction = await Transaction.findOne({ student: student._id });

          if (!transaction) {
            const newTransaction = new Transaction({
              student: student._id,
              placementTest: marketingData.placementTest || null,
              type: "income",
              amount: updatedPayment.amountPaid,
              description: "Placement Test Payment",
              paymentMethod: updatedPayment.paymentMethod,
            });

            await newTransaction.save();
          }
        }

        // Handle Level Fee Payment
        else if (paymentStatus === "Verified" && paymentType === "Level Fee") {
          // Find or create the transaction entry
          let transaction = await Transaction.findOne({ student: student._id });

          if (!transaction) {
            const newTransaction = new Transaction({
              student: student._id,
              level: marketingData.assignedLevel || null,
              type: "income",
              amount: updatedPayment.amountPaid,
              description: "Level Fee Payment",
              paymentMethod: updatedPayment.paymentMethod,
            });
            await newTransaction.save();
          }

          let waitingListEntry = await WaitingList.findOne({
            student: student._id,
            source: "EWFS",
          });
          console.log(waitingListEntry)

          if (!waitingListEntry) {
            const newStudent = new WaitingList({
              student: student?._id,
              studentName: student?.name,
              assignedLevel: marketingData.assignedLevel,
              placementTestID: marketingData.placementTest,
              source: "EWFS",
            });

            await newStudent.save();
          }

          // Update the placement test status to "Finished, Moved to Waiting List"
          const updatedPlacementTest = await PlacementTest.findOneAndUpdate(
            { student: student._id },
            { status: "Finished, Moved to Waiting List" },
            { new: true }
          );

          if (!updatedPlacementTest) {
            console.error("Placement test not found for update");
          }
        }
      } catch (error) {
        console.error("Error processing payment:", error);
      }

      if (!updatedPayment) {
        return res.status(404).json({ error: "Payment not found" });
      }

      return res.status(200).json(updatedPayment);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }
  }

  return res.status(400).json({ error: "Invalid request method" });
};
