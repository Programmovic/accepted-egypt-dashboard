// pages/api/sales-rejection-reason.js

import connectDB from "@lib/db"; // Assuming this is your DB connection helper
import SalesRejectionReason from "../../../models/salesRejectionReason"; // Import the SalesRejectionReason model

export default async (req, res) => {
  await connectDB();

  switch (req.method) {
    case "POST":
      return createSalesRejectionReason(req, res);
    case "GET":
      return readSalesRejectionReasons(req, res);
    case "PUT":
      return updateSalesRejectionReason(req, res);
    case "DELETE":
      return deleteSalesRejectionReason(req, res);
    default:
      return res.status(405).json({ error: "Method not allowed" });
  }
};

const createSalesRejectionReason = async (req, res) => {
  try {
    const { reason } = req.body;
    const salesRejectionReason = new SalesRejectionReason({ reason });
    await salesRejectionReason.save();
    res.status(201).json(salesRejectionReason);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not create the sales rejection reason" });
  }
};

const readSalesRejectionReasons = async (req, res) => {
  try {
    const salesRejectionReasons = await SalesRejectionReason.find();
    res.status(200).json(salesRejectionReasons);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not fetch sales rejection reasons" });
  }
};

const updateSalesRejectionReason = async (req, res) => {
  const { id } = req.query;
  const updateData = req.body;

  try {
    const updatedSalesRejectionReason = await SalesRejectionReason.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedSalesRejectionReason) {
      return res.status(404).json({ error: "Sales rejection reason not found" });
    }
    res.status(200).json(updatedSalesRejectionReason);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not update the sales rejection reason" });
  }
};

const deleteSalesRejectionReason = async (req, res) => {
  const { id } = req.query;

  try {
    const salesRejectionReason = await SalesRejectionReason.findByIdAndDelete(id);
    if (!salesRejectionReason) {
      return res.status(404).json({ error: "Sales rejection reason not found" });
    }
    res.status(200).json({ message: "Sales rejection reason deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not delete the sales rejection reason" });
  }
};
