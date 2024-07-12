import connectDB from "@lib/db";
import Laptop from "../../../../models/laptops";

export default async (req, res) => {
  await connectDB();
  if (req.method === "GET") {
    try {
      const laptopId = req.query.id; // Access the laptop ID from the route parameter

      // Check if the laptop with the given ID exists
      const laptop = await Laptop.findById(laptopId)
        .populate("assignedTo"); // Populate the 'assignedTo' field if needed

      if (!laptop) {
        // Handle the case when the laptop is not found
        return res.status(404).json({ error: "Laptop not found" });
      }

      // Respond with the found laptop
      return res.status(200).json(laptop);
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ error: "Could not fetch the laptop" });
    }
  } else {
    return res.status(400).json({ error: "Invalid request" });
  }
};
