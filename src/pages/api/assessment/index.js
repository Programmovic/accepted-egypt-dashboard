import connectDB from "@lib/db";
import Assessment from "../../../models/progress_exit_test";
import Batch from "../../../models/batch";
import Student from "../../../models/student";

export default async (req, res) => {
  await connectDB();

  if (req.method === "POST") {
    const assessmentData = req.body;

    try {
      const selectedBatch = await Batch.findById(assessmentData.batch);

      if (!selectedBatch) {
        return res.status(404).json({ error: "Selected batch not found" });
      }

      const studentsInBatch = await Student.find({
        batch: assessmentData.batch,
      });
      console.log(selectedBatch);
      const studentAssessments = studentsInBatch.map(async (student) => {
        const studentAssessmentData = {
          assessmentType: assessmentData.assessmentType,
          batch: assessmentData.batch,
          classLevel: selectedBatch.levelName,
          classCode: selectedBatch.code,
          student: student._id,
          name: student.name,
          phoneNumber: student.phoneNumber,
        };

        const studentAssessment = new Assessment(studentAssessmentData);
        await studentAssessment.save();

        return studentAssessment;
      });

      await Promise.all(studentAssessments);

      return res.status(201).json({ message: "Done" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Could not create the assessment" });
    }
  } else if (req.method === "GET") {
    try {
      // Group assessments by type and batch
      const allAssessments = await Assessment.find()
        .populate("batch")
        .populate("student");
      return res.status(200).json(allAssessments);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Could not fetch assessments" });
    }
  } else {
    return res.status(400).json({ error: "Invalid request" });
  }
};
