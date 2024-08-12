import connectDB from "@lib/db"; // Assuming this is your DB connection helper
import TrainingLocation from "../../../models/trainingLocation";

export default async (req, res) => {
  await connectDB();

  switch (req.method) {
    case "POST":
      return createTrainingLocation(req, res);
    case "GET":
      return readTrainingLocations(req, res);
    case "PUT":
      return updateTrainingLocation(req, res);
    case "DELETE":
      return deleteTrainingLocation(req, res);
    default:
      return res.status(405).json({ error: "Method not allowed" });
  }
};

const createTrainingLocation = async (req, res) => {
  try {
    const { name, address, description } = req.body;
    console.log(req.body);
    const trainingLocation = new TrainingLocation({ name, address, description });
    await trainingLocation.save();
    res.status(201).json(trainingLocation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not create the training location" });
  }
};

const readTrainingLocations = async (req, res) => {
  try {
    const trainingLocations = await TrainingLocation.find();
    res.status(200).json(trainingLocations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not fetch training locations" });
  }
};

const updateTrainingLocation = async (req, res) => {
  const { id } = req.query;
  const updateData = req.body;

  try {
    const updatedTrainingLocation = await TrainingLocation.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedTrainingLocation) {
      return res.status(404).json({ error: "Training location not found" });
    }
    res.status(200).json(updatedTrainingLocation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not update the training location" });
  }
};

const deleteTrainingLocation = async (req, res) => {
  const { id } = req.query;

  try {
    const trainingLocation = await TrainingLocation.findByIdAndDelete(id);
    if (!trainingLocation) {
      return res.status(404).json({ error: "Training location not found" });
    }
    res.status(200).json({ message: "Training location deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not delete the training location" });
  }
};
