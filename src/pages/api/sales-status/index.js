import connectDB from "@lib/db"; // Assuming this is your DB connection helper
import SalesStatus from "../../../models/salesStatus"; // Import the SalesStatus model

export default async (req, res) => {
  await connectDB();

  switch (req.method) {
    case "POST":
      return createSalesStatus(req, res);
    case "GET":
      return readSalesStatuses(req, res);
    case "PUT":
      return updateSalesStatus(req, res);
    case "DELETE":
      return deleteSalesStatus(req, res);
    default:
      return res.status(405).json({ error: "Method not allowed" });
  }
};

const createSalesStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const salesStatus = new SalesStatus({ status });
    await salesStatus.save();
    res.status(201).json(salesStatus);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not create the sales status" });
  }
};

const readSalesStatuses = async (req, res) => {
  try {
    const salesStatuses = await SalesStatus.find();
    res.status(200).json(salesStatuses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not fetch sales statuses" });
  }
};

const updateSalesStatus = async (req, res) => {
  const { id } = req.query;
  const updateData = req.body;

  try {
    const updatedSalesStatus = await SalesStatus.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedSalesStatus) {
      return res.status(404).json({ error: "Sales status not found" });
    }
    res.status(200).json(updatedSalesStatus);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not update the sales status" });
  }
};

const deleteSalesStatus = async (req, res) => {
  const { id } = req.query;

  try {
    const salesStatus = await SalesStatus.findByIdAndDelete(id);
    if (!salesStatus) {
      return res.status(404).json({ error: "Sales status not found" });
    }
    res.status(200).json({ message: "Sales status deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not delete the sales status" });
  }
};
