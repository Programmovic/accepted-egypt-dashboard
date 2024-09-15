import connectDB from "@lib/db";
import Student from "../../../../../models/student";
import PlacementTest from "../../../../../models/placement_test";
import MarketingData from "../../../../../models/marketingData";

export default async (req, res) => {
  try {
    await connectDB();

    if (req.method === "POST") {
    }
    if (req.method === "PUT") {
      try {
        const { studentId } = req.query; // Assuming you pass the studentId as a query parameter
        const { assignedLevel, placementTestID, status, comment } = req.body;

        // Debug: Log input parameters
        console.log("Received studentId:", studentId);
        console.log("Request Body:", {
          assignedLevel,
          placementTestID,
          status,
          comment,
        });

        if (!studentId) {
          console.log("Error: Student ID is required");
          return res.status(400).json({ error: "Student ID is required" });
        }

        // Find the student by ID
        const student = await Student.findById(studentId);

        // Debug: Check if student exists
        if (!student) {
          console.log(`Student not found with ID: ${studentId}`);
          return res.status(404).json({ error: "Student not found" });
        } else {
          console.log("Found student:", student);
        }

        // Update MarketingData (if phoneNo1 or phoneNo2 matches)
        const updatedLead = await MarketingData.findOneAndUpdate(
          {
            $or: [
              { phoneNo1: student.phoneNumber },
              { phoneNo2: student.phoneNumber },
            ],
          },
          { assignedLevel: assignedLevel }, // The data to update
          { new: true } // Return the updated document
        );

        // Debug: Log result of MarketingData update
        if (!updatedLead) {
          console.log(
            `No marketing data found for phone number: ${student.phoneNumber}`
          );
        } else {
          console.log("Updated MarketingData:", updatedLead);
        }

        // Update Student data
        const updatedStudent = await Student.findByIdAndUpdate(
          studentId,
          { level: assignedLevel, status: status },
          { new: true }
        );

        // Debug: Log result of Student update
        if (!updatedStudent) {
          console.log(`Failed to update student with ID: ${studentId}`);
        } else {
          console.log("Updated Student:", updatedStudent);
        }

        // Update PlacementTest data
        const updatedPlacementTest = await PlacementTest.findByIdAndUpdate(
          placementTestID,
          {
            status: status,
            assignedLevel: assignedLevel,
            comment: comment,
          },
          { new: true }
        );

        // Debug: Log result of PlacementTest update
        if (!updatedPlacementTest) {
          console.log(
            `Failed to update PlacementTest with ID: ${placementTestID}`
          );
        } else {
          console.log("Updated PlacementTest:", updatedPlacementTest);
        }

        // Update MarketingData again (if necessary)
        const updatedMarketingData = await MarketingData.findOneAndUpdate(
          {
            $or: [
              { phoneNo1: student.phoneNumber },
              { phoneNo2: student.phoneNumber },
            ],
          },
          {
            assignedLevel: assignedLevel,
          },
          { new: true }
        );

        // Debug: Log final MarketingData update
        if (!updatedMarketingData) {
          console.log(
            `Failed to update assignedLevel in MarketingData for placementTest ID: ${placementTestID}`
          );
        } else {
          console.log(
            "Updated MarketingData (final update):",
            updatedMarketingData
          );
        }

        // Return updated student
        return res.status(200).json({ student: updatedStudent });
      } catch (error) {
        console.error("Error processing PUT request:", error.message);
        return res.status(500).json({ error: error.message });
      }
    } else if (req.method === "GET") {
      const students = await Student.find();
      // You can also fetch associated placement test and transaction data here if needed
      return res.status(200).json({ students });
    } else {
      return res.status(400).json({ error: "Invalid request" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};
