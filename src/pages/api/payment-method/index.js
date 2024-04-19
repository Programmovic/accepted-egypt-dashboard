import connectDB from "@lib/db"; // Assuming this is your DB connection helper
import PaymentMethod from "../../../models/paymentMethod"; // Import the PaymentMethod model

export default async (req, res) => {
  await connectDB();

  switch (req.method) {
    case "POST":
      return createPaymentMethod(req, res);
    case "GET":
      return readPaymentMethods(req, res);
    case "PUT":
      return updatePaymentMethod(req, res);
    case "DELETE":
      return deletePaymentMethod(req, res);
    default:
      return res.status(405).json({ error: "Method not allowed" });
  }
};

const createPaymentMethod = async (req, res) => {
  try {
    const { type } = req.body;
    const paymentMethod = new PaymentMethod({ type });
    await paymentMethod.save();
    res.status(201).json(paymentMethod);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not create the payment method" });
  }
};

const readPaymentMethods = async (req, res) => {
  try {
    const paymentMethods = await PaymentMethod.find();
    res.status(200).json(paymentMethods);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not fetch payment methods" });
  }
};

const updatePaymentMethod = async (req, res) => {
  const { id } = req.query;
  const updateData = req.body;

  try {
    const updatedPaymentMethod = await PaymentMethod.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedPaymentMethod) {
      return res.status(404).json({ error: "Payment method not found" });
    }
    res.status(200).json(updatedPaymentMethod);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not update the payment method" });
  }
};

const deletePaymentMethod = async (req, res) => {
  const { id } = req.query;

  try {
    const paymentMethod = await PaymentMethod.findByIdAndDelete(id);
    if (!paymentMethod) {
      return res.status(404).json({ error: "Payment method not found" });
    }
    res.status(200).json({ message: "Payment method deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not delete the payment method" });
  }
};
