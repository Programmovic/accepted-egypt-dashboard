import connectDB from "@lib/db"; // Assuming this is your DB connection helper
import PhoneInterviewStatus from "../../../models/phoneInterviewStatus";

export default async (req, res) => {
  await connectDB();

  switch (req.method) {
    case "POST":
      return createPhoneInterviewStatus(req, res);
    case "GET":
      return readPhoneInterviewStatuses(req, res);
    case "PUT":
      return updatePhoneInterviewStatus(req, res);
    case "DELETE":
      return deletePhoneInterviewStatus(req, res);
    default:
      return res.status(405).json({ error: "Method not allowed" });
  }
};

const createPhoneInterviewStatus = async (req, res) => {
  try {
    const { status, description } = req.body;
    const phoneInterviewStatus = new PhoneInterviewStatus({ status, description });
    await phoneInterviewStatus.save();
    res.status(201).json(phoneInterviewStatus);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not create the phone interview status" });
  }
};

const readPhoneInterviewStatuses = async (req, res) => {
  try {
    const phoneInterviewStatuses = await PhoneInterviewStatus.find();
    res.status(200).json(phoneInterviewStatuses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not fetch phone interview statuses" });
  }
};

const updatePhoneInterviewStatus = async (req, res) => {
  const { id } = req.query;
  const updateData = req.body;

  try {
    const updatedPhoneInterviewStatus = await PhoneInterviewStatus.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedPhoneInterviewStatus) {
      return res.status(404).json({ error: "Phone interview status not found" });
    }
    res.status(200).json(updatedPhoneInterviewStatus);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not update the phone interview status" });
  }
};

const deletePhoneInterviewStatus = async (req, res) => {
  const { id } = req.query;

  try {
    const phoneInterviewStatus = await PhoneInterviewStatus.findByIdAndDelete(id);
    if (!phoneInterviewStatus) {
      return res.status(404).json({ error: "Phone interview status not found" });
    }
    res.status(200).json({ message: "Phone interview status deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not delete the phone interview status" });
  }
};
