import connectDB from "@lib/db"; // Assuming this is your DB connection helper
import FaceToFaceStatus from "../../../models/faceToFaceStatus";

export default async (req, res) => {
  await connectDB();

  switch (req.method) {
    case "POST":
      return createFaceToFaceStatus(req, res);
    case "GET":
      return readFaceToFaceStatuses(req, res);
    case "PUT":
      return updateFaceToFaceStatus(req, res);
    case "DELETE":
      return deleteFaceToFaceStatus(req, res);
    default:
      return res.status(405).json({ error: "Method not allowed" });
  }
};

const createFaceToFaceStatus = async (req, res) => {
  try {
    const { status, description } = req.body;
    const faceToFaceStatus = new FaceToFaceStatus({ status, description });
    await faceToFaceStatus.save();
    res.status(201).json(faceToFaceStatus);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not create the face-to-face status" });
  }
};

const readFaceToFaceStatuses = async (req, res) => {
  try {
    const faceToFaceStatuses = await FaceToFaceStatus.find();
    res.status(200).json(faceToFaceStatuses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not fetch face-to-face statuses" });
  }
};

const updateFaceToFaceStatus = async (req, res) => {
  const { id } = req.query;
  const updateData = req.body;

  try {
    const updatedFaceToFaceStatus = await FaceToFaceStatus.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedFaceToFaceStatus) {
      return res.status(404).json({ error: "Face-to-face status not found" });
    }
    res.status(200).json(updatedFaceToFaceStatus);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not update the face-to-face status" });
  }
};

const deleteFaceToFaceStatus = async (req, res) => {
  const { id } = req.query;

  try {
    const faceToFaceStatus = await FaceToFaceStatus.findByIdAndDelete(id);
    if (!faceToFaceStatus) {
      return res.status(404).json({ error: "Face-to-face status not found" });
    }
    res.status(200).json({ message: "Face-to-face status deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not delete the face-to-face status" });
  }
};
