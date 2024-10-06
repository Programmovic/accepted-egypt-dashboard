import connectDB from "@lib/db";
import Inventory from "../../../../models/inventory";

export default async (req, res) => {
  await connectDB();

  const laptopId = req.query.id; // Access the laptop ID from the route parameter

  if (req.method === "GET") {
    try {
      console.log(laptopId)
      // Check if the laptop with the given ID exists
      const laptop = await Inventory.findById(laptopId).populate(
        "assignedTo"
      );

      if (!laptop) {
        // Handle the case when the laptop is not found
        return res.status(404).json({ error: "Inventory not found" });
      }

      // Respond with the found laptop
      return res.status(200).json(laptop);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Could not fetch the laptop" });
    }
  } else if (req.method === "PUT") {
    // Handle updating the laptop details
    try {
      const updatedLaptop = await Inventory.findByIdAndUpdate(laptopId, req.body, {
        new: true, // Return the updated document
        runValidators: true, // Validate the new data against the model schema
      });

      if (!updatedLaptop) {
        return res.status(404).json({ error: "Inventory not found" });
      }

      return res.status(200).json(updatedLaptop);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Could not update the laptop" });
    }
  } else if (req.method === "DELETE") {
    // Handle deleting the laptop
    try {
      const deletedLaptop = await Inventory.findByIdAndDelete(laptopId);

      if (!deletedLaptop) {
        return res.status(404).json({ error: "Inventory not found" });
      }

      return res.status(200).json({ message: "Inventory deleted successfully" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Could not delete the laptop" });
    }
  } else {
    return res.status(400).json({ error: "Invalid request" });
  }
};
