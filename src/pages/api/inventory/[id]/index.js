import connectDB from "@lib/db";
import Inventory from "../../../../models/inventory";

export default async (req, res) => {
  await connectDB();

  const laptopId = req.query.id; // Access the laptop ID from the route parameter

  if (req.method === "GET") {
    try {
      console.log(laptopId);
      // Check if the laptop with the given ID exists
      const laptop = await Inventory.findById(laptopId).populate("assignedTo").populate("history.employeeId");

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
    const { assignedTo, itemName, itemCategory, description } = req.body;

    try {
      // Fetch the existing laptop data
      const laptop = await Inventory.findById(laptopId);

      if (!laptop) {
        return res.status(404).json({ error: "Inventory not found" });
      }

      // Update history if there's a change in assignment
      if (laptop.assignedTo.toString() !== assignedTo) {
        const currentAssignment = {
          employeeId: laptop.assignedTo,
          assignedDate: laptop.assignedDate,
          unassignedDate: Date.now(), // Set the unassigned date to now
        };

        // Update the history
        laptop.history.push(currentAssignment);
      }

      // Update the laptop details
      laptop.itemName = itemName || laptop.itemName;
      laptop.itemCategory = itemCategory || laptop.itemCategory;
      laptop.description = description || laptop.description;
      laptop.assignedTo = assignedTo; // Update the assignedTo field
      laptop.assignedDate = Date.now(); // Update to current date

      // Save the updated laptop document
      const updatedLaptop = await laptop.save();

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

      return res
        .status(200)
        .json({ message: "Inventory deleted successfully" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Could not delete the laptop" });
    }
  } else {
    return res.status(400).json({ error: "Invalid request" });
  }
};
