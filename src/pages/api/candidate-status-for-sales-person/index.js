import connectDB from "@lib/db"; // Assuming this is your DB connection helper
import CandidateStatusForSalesPerson from "../../../models/candidateStatusForSalesPerson";
export default async (req, res) => {
  await connectDB();

  switch (req.method) {
    case "POST":
      return createCandidateStatus(req, res);
    case "GET":
      return readCandidateStatuses(req, res);
    case "PUT":
      return updateCandidateStatus(req, res);
    case "DELETE":
      return deleteCandidateStatus(req, res);
    default:
      return res.status(405).json({ error: "Method not allowed" });
  }
};

const createCandidateStatus = async (req, res) => {
  try {
    const { status, description } = req.body;
    const candidateStatus = new CandidateStatusForSalesPerson({ status, description });
    await candidateStatus.save();
    res.status(201).json(candidateStatus);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not create the candidate status" });
  }
};

const readCandidateStatuses = async (req, res) => {
  try {
    const candidateStatuses = await CandidateStatusForSalesPerson.find();
    res.status(200).json(candidateStatuses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not fetch candidate statuses" });
  }
};

const updateCandidateStatus = async (req, res) => {
  const { id } = req.query;
  const updateData = req.body;

  try {
    const updatedCandidateStatus = await CandidateStatusForSalesPerson.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedCandidateStatus) {
      return res.status(404).json({ error: "Candidate status not found" });
    }
    res.status(200).json(updatedCandidateStatus);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not update the candidate status" });
  }
};

const deleteCandidateStatus = async (req, res) => {
  const { id } = req.query;

  try {
    const candidateStatus = await CandidateStatusForSalesPerson.findByIdAndDelete(id);
    if (!candidateStatus) {
      return res.status(404).json({ error: "Candidate status not found" });
    }
    res.status(200).json({ message: "Candidate status deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not delete the candidate status" });
  }
};
