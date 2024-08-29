import connectDB from "@lib/db";
import Assessment from "../../../models/progress_exit_test";
import Student from "../../../models/student"; // Import the Student model
import Batch from "../../../models/batch"; // Import the Batch model

export default async (req, res) => {
  await connectDB();

  if (req.method === "POST") {
    const assessmentData = req.body;

    try {
      // Retrieve the selected batch by ID
      const selectedBatch = await Batch.findById(assessmentData.batch);

      if (!selectedBatch) {
        return res.status(404).json({ error: "Selected batch not found" });
      }

      // Automatically create assessments for all students in the selected batch
      const studentsInBatch = await Student.find({ batch: assessmentData.batch });

      const studentAssessments = studentsInBatch.map(async (student) => {
        const studentAssessmentData = {
          assessmentType: assessmentData.assessmentType,
          batch: assessmentData.batch,
          classLevel: selectedBatch.levelName, // Set the level
          classCode: selectedBatch.code, // Set the code
          student: student._id,
          name: student.name,
          phoneNumber: student.phoneNumber,
        };

        // Create an assessment for the student
        const studentAssessment = new Assessment(studentAssessmentData);
        await studentAssessment.save();

        return studentAssessment;
      });

      await Promise.all(studentAssessments); // Wait for all student assessments to be created

      return res.status(201).json({ message: "Done" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Could not create the assessment" });
    }
  } else if (req.method === "GET") {
    try {
      const allAssessments = await Assessment.find().populate('batch');
      return res.status(200).json(allAssessments);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Could not fetch assessments" });
    }
  } else {
    return res.status(400).json({ error: "Invalid request" });
  }
};
