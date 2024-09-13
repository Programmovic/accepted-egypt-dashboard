import connectDB from "@lib/db";
import PendingPayment from "../../../models/pendingLeadPayment";

export default async (req, res) => {
  await connectDB();
  if (req.method === "GET") {
    try {
      const { leadId } = req.query;
      const pending = await PendingPayment.find({ leadId: leadId }).sort({
        editedAt: -1,
      });
      return res.status(200).json(pending);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }
  } else if (req.method === "PUT") {
    try {
      const { id } = req.query;
      const { paymentStatus } = req.body;

      // Validate input
      if (!id || !paymentStatus) {
        return res
          .status(400)
          .json({ error: "Payment ID and status are required" });
      }

      // Update the payment status
      const updatedPayment = await PendingPayment.findByIdAndUpdate(
        { _id: id },
        { paymentStatus },
        { new: true }
      );

      if (!updatedPayment) {
        return res.status(404).json({ error: "Payment not found" });
      }

      return res.status(200).json(updatedPayment);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }
  }

  return res.status(400).json({ error: "Invalid request method" });
};
