// pages/api/payment-screenshot-status/index.js
import connectDB from "@lib/db"; // Assuming this is your DB connection helper
import PaymentScreenshotStatus from "../../../models/paymentScreenShotStatus";

export default async (req, res) => {
  await connectDB();

  switch (req.method) {
    case "POST":
      return createPaymentScreenshotStatus(req, res);
    case "GET":
      return readPaymentScreenshotStatuses(req, res);
    case "PUT":
      return updatePaymentScreenshotStatus(req, res);
    case "DELETE":
      return deletePaymentScreenshotStatus(req, res);
    default:
      return res.status(405).json({ error: "Method not allowed" });
  }
};

const createPaymentScreenshotStatus = async (req, res) => {
  try {
    const { status, description } = req.body;
    const paymentScreenshotStatus = new PaymentScreenshotStatus({ status, description });
    await paymentScreenshotStatus.save();
    res.status(201).json(paymentScreenshotStatus);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not create the payment screenshot status" });
  }
};

const readPaymentScreenshotStatuses = async (req, res) => {
  try {
    const paymentScreenshotStatuses = await PaymentScreenshotStatus.find();
    res.status(200).json(paymentScreenshotStatuses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not fetch payment screenshot statuses" });
  }
};

const updatePaymentScreenshotStatus = async (req, res) => {
  const { id } = req.query;
  const updateData = req.body;

  try {
    const updatedPaymentScreenshotStatus = await PaymentScreenshotStatus.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedPaymentScreenshotStatus) {
      return res.status(404).json({ error: "Payment screenshot status not found" });
    }
    res.status(200).json(updatedPaymentScreenshotStatus);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not update the payment screenshot status" });
  }
};

const deletePaymentScreenshotStatus = async (req, res) => {
  const { id } = req.query;

  try {
    const paymentScreenshotStatus = await PaymentScreenshotStatus.findByIdAndDelete(id);
    if (!paymentScreenshotStatus) {
      return res.status(404).json({ error: "Payment screenshot status not found" });
    }
    res.status(200).json({ message: "Payment screenshot status deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not delete the payment screenshot status" });
  }
};
