import connectDB from "@lib/db"; 
import Student from "../../../models/student"; 
import Transaction from "../../../models/transaction"; 
import Level from "../../../models/level"; 
import PlacementTest from "../../../models/placement_test"; 
import MarketingData from "../../../models/marketingData"; 
import Notification from "../../../models/notification"; // Import the Notification model

export default async (req, res) => {
  await connectDB();

  switch (req.method) {
    case "POST":
      return sendNotificationsToAllStudents(req, res);
    case "GET":
      return fetchStudentNotifications(req, res); // New GET method for fetching notifications
    default:
      return res.status(405).json({ error: "Method not allowed" });
  }
};

const sendNotificationsToAllStudents = async (req, res) => {
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
          totalRequired +=
            (level.price * ((marketingData?.levelDiscount / 100) || 0)) || 0;
        } 
      }

      // Include the cost of all placement tests
      const placementTests = await PlacementTest.find({ student: student._id });
      if (placementTests && placementTests.length > 0) {
        placementTests.forEach((test) => {
          totalRequired += test.cost || 0; // Default to 0 if test.cost is undefined
          
        });
      } 

      // Apply discounts if available
      if (marketingData) {
        const levelDiscount = marketingData.levelDiscount || 0;
        const placementTestDiscount = marketingData.placementTestDiscount || 0;

        totalRequired -= levelDiscount + placementTestDiscount;
        
      } 

      // Ensure totalPaid and totalRequired are valid numbers
      const validTotalPaid = isNaN(totalPaid) ? 0 : totalPaid;
      const validTotalRequired = isNaN(totalRequired) ? 0 : totalRequired;
      

      // Calculate the due amount safely
      const dueAmount = validTotalRequired - validTotalPaid;
      

      // Prepare notification message
      let notificationMessage;
      if (dueAmount > 0) {
        notificationMessage = `Dear ${student.name}, you still owe ${dueAmount} to complete your fees. You have paid ${validTotalPaid} out of ${validTotalRequired}.`;
      } else {
        notificationMessage = `Dear ${student.name}, you have completed all payments. Total fees: ${validTotalRequired}. Amount paid: ${validTotalPaid}.`;
      }

      // Save the notification in the database
      const newNotification = new Notification({
        student: student._id,
        message: notificationMessage,
      });

      await newNotification.save();
    }

    return res
      .status(200)
      .json({
        message:
          "All students updated and notifications generated successfully",
      });
  } catch (error) {
    console.error("Error updating students:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Fetch notifications for all students or a specific student (GET)
const fetchStudentNotifications = async (req, res) => {
  const { studentId } = req.query;

  try {
    let notifications;

    if (studentId) {
      // Fetch notifications for a specific student
      notifications = await Notification.find({ student: studentId })
        .populate("student")
        .sort({ _id: -1 });

      if (!notifications || notifications.length === 0) {
        return res
          .status(404)
          .json({ error: "No notifications found for this student." });
      }
    } else {
      // Fetch notifications for all students
      notifications = await Notification.find().populate("student");

      if (!notifications || notifications.length === 0) {
        return res.status(404).json({ error: "No notifications found." });
      }
    }

    // Format notifications for the response
    const formattedNotifications = notifications.map((notification) => ({
      studentName: notification.student.name, // Assuming student has a name field
      studentId: notification.student._id,
      message: notification.message,
      status: notification.status,
      createdAt: notification.createdAt,
    }));

    res.status(200).json({ notifications: formattedNotifications });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not fetch notifications" });
  }
};
