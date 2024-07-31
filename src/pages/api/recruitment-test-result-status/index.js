// pages/api/recruitment-test-result-status/index.js
import connectDB from "@lib/db"; // Assuming this is your DB connection helper
import RecruitmentTestResultStatus from "../../../models/recruitmentTestResultStatus";

export default async (req, res) => {
  await connectDB();

  switch (req.method) {
    case "POST":
      return createRecruitmentTestResultStatus(req, res);
    case "GET":
      return readRecruitmentTestResultStatuses(req, res);
    case "PUT":
      return updateRecruitmentTestResultStatus(req, res);
    case "DELETE":
      return deleteRecruitmentTestResultStatus(req, res);
    default:
      return res.status(405).json({ error: "Method not allowed" });
  }
};

const createRecruitmentTestResultStatus = async (req, res) => {
  try {
    const { status, description } = req.body;
    const recruitmentTestResultStatus = new RecruitmentTestResultStatus({ status, description });
    await recruitmentTestResultStatus.save();
    res.status(201).json(recruitmentTestResultStatus);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not create the recruitment test result status" });
  }
};

const readRecruitmentTestResultStatuses = async (req, res) => {
  try {
    const recruitmentTestResultStatuses = await RecruitmentTestResultStatus.find();
    res.status(200).json(recruitmentTestResultStatuses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not fetch recruitment test result statuses" });
  }
};

const updateRecruitmentTestResultStatus = async (req, res) => {
  const { id } = req.query;
  const updateData = req.body;

  try {
    const updatedRecruitmentTestResultStatus = await RecruitmentTestResultStatus.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedRecruitmentTestResultStatus) {
      return res.status(404).json({ error: "Recruitment test result status not found" });
    }
    res.status(200).json(updatedRecruitmentTestResultStatus);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not update the recruitment test result status" });
  }
};

const deleteRecruitmentTestResultStatus = async (req, res) => {
  const { id } = req.query;

  try {
    const recruitmentTestResultStatus = await RecruitmentTestResultStatus.findByIdAndDelete(id);
    if (!recruitmentTestResultStatus) {
      return res.status(404).json({ error: "Recruitment test result status not found" });
    }
    res.status(200).json({ message: "Recruitment test result status deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not delete the recruitment test result status" });
  }
};
