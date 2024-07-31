import connectDB from "@lib/db"; // Assuming this is your DB connection helper
import FeedbackSessionStatus from "../../../models/feedbackSessionStatus";

export default async (req, res) => {
  await connectDB();

  switch (req.method) {
    case "POST":
      return createFeedbackSessionStatus(req, res);
    case "GET":
      return readFeedbackSessionStatuses(req, res);
    case "PUT":
      return updateFeedbackSessionStatus(req, res);
    case "DELETE":
      return deleteFeedbackSessionStatus(req, res);
    default:
      return res.status(405).json({ error: "Method not allowed" });
  }
};

const createFeedbackSessionStatus = async (req, res) => {
  try {
    const { status, description } = req.body;
    const feedbackSessionStatus = new FeedbackSessionStatus({ status, description });
    await feedbackSessionStatus.save();
    res.status(201).json(feedbackSessionStatus);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not create the feedback session status" });
  }
};

const readFeedbackSessionStatuses = async (req, res) => {
  try {
    const feedbackSessionStatuses = await FeedbackSessionStatus.find();
    res.status(200).json(feedbackSessionStatuses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not fetch feedback session statuses" });
  }
};

const updateFeedbackSessionStatus = async (req, res) => {
  const { id } = req.query;
  const updateData = req.body;

  try {
    const updatedFeedbackSessionStatus = await FeedbackSessionStatus.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedFeedbackSessionStatus) {
      return res.status(404).json({ error: "Feedback session status not found" });
    }
    res.status(200).json(updatedFeedbackSessionStatus);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not update the feedback session status" });
  }
};

const deleteFeedbackSessionStatus = async (req, res) => {
  const { id } = req.query;

  try {
    const feedbackSessionStatus = await FeedbackSessionStatus.findByIdAndDelete(id);
    if (!feedbackSessionStatus) {
      return res.status(404).json({ error: "Feedback session status not found" });
    }
    res.status(200).json({ message: "Feedback session status deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not delete the feedback session status" });
  }
};
