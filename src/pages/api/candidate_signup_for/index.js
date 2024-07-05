import connectDB from "@lib/db"; // Assuming this is your DB connection helper
import CandidateSignUpFor from "../../../models/candidateSignUpFor"; // Import the CandidateSignUpFor model

export default async (req, res) => {
  await connectDB();

  switch (req.method) {
    case "POST":
      return createCandidateSignUpFor(req, res);
    case "GET":
      return readCandidateSignUpFors(req, res);
    case "PUT":
      return updateCandidateSignUpFor(req, res);
    case "DELETE":
      return deleteCandidateSignUpFor(req, res);
    default:
      return res.status(405).json({ error: "Method not allowed" });
  }
};

const createCandidateSignUpFor = async (req, res) => {
  try {
    const { order, status } = req.body;
    const candidateSignUpFor = new CandidateSignUpFor({ order, status });
    await candidateSignUpFor.save();
    res.status(201).json(candidateSignUpFor);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not create the candidate sign up for" });
  }
};

const readCandidateSignUpFors = async (req, res) => {
  try {
    const candidateSignUpFors = await CandidateSignUpFor.find();
    res.status(200).json(candidateSignUpFors);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not fetch candidate sign up fors" });
  }
};

const updateCandidateSignUpFor = async (req, res) => {
  const { id } = req.query;
  const updateData = req.body;

  try {
    const updatedCandidateSignUpFor = await CandidateSignUpFor.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedCandidateSignUpFor) {
      return res.status(404).json({ error: "Candidate sign up for not found" });
    }
    res.status(200).json(updatedCandidateSignUpFor);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not update the candidate sign up for" });
  }
};

const deleteCandidateSignUpFor = async (req, res) => {
  const { id } = req.query;

  try {
    const candidateSignUpFor = await CandidateSignUpFor.findByIdAndDelete(id);
    if (!candidateSignUpFor) {
      return res.status(404).json({ error: "Candidate sign up for not found" });
    }
    res.status(200).json({ message: "Candidate sign up for deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not delete the candidate sign up for" });
  }
};
