// Import necessary modules and models
import connectDB from "@lib/db";
import Assessment from "../../../models/progress_exit_test";
import Batch from "../../../models/batch";
import WaitingList from "../../../models/waiting_list"; // Import the WaitingList model
import Student from "../../../models/student";

export default async (req, res) => {
  await connectDB();

  if (req.method === "GET") {
    // Existing code for fetching assessments by batch ID
    try {
      const { batchId } = req.query;
      const selectedBatch = await Batch.findById(batchId);

      if (!selectedBatch) {
        return res.status(404).json({ error: "Batch not found" });
      }

      const batchAssessments = await Assessment.find({ batch: batchId });

      return res.status(200).json({ batch: selectedBatch, assessments: batchAssessments });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Could not fetch assessments" });
    }
  } else if (req.method === "PUT") {
    // Update an assessment by ID
    try {
      const { assessmentId } = req.query;
      const updatedAssessmentData = req.body;
      const updatedAssessment = await Assessment.findByIdAndUpdate(
        assessmentId,
        updatedAssessmentData,
        { new: true }
      );

      if (!updatedAssessment) {
        return res.status(404).json({ error: "Assessment not found" });
      }

      // Check if the student moved to a higher level
      if (updatedAssessment.movedToHigherLevel) {
        // Update the student's status to "Waiting List" and set their level to the new level
        const updatedStudent = await Student.findByIdAndUpdate(
          updatedAssessment.student,
          {
            status: "Waiting List",
            level: updatedAssessment.newLevel,
          },
          { new: true }
        );

        // Create a waiting list entry
        const waitingListEntry = new WaitingList({
          student: updatedStudent._id,
          studentName: updatedAssessment.name,
          studentNationalID: updatedAssessment.studentNationalID,
          studentPhoneNumber: updatedAssessment.phoneNumber,
          assignedLevel: updatedAssessment.newLevel,
          source: "Batch", // You can adjust this based on your needs
          // Add other waiting list fields as needed
        });

        await waitingListEntry.save();
      }

      return res.status(200).json({
        message: "Assessment updated successfully",
        assessment: updatedAssessment,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Could not update the assessment" });
    }
  } else {
    return res.status(400).json({ error: "Invalid request" });
  }
};
