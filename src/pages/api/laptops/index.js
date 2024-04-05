// laptop.js
import connectDB from "@lib/db";
import Laptop from "../../../models/laptops";
import Instructor from "../../../models/instructor";

export default async (req, res) => {
  await connectDB();

  if (req.method === "POST") {
    try {
      const laptopData = req.body;

      // Create a new Laptop document
      const newLaptop = new Laptop(laptopData);

      // Save the new laptop record to the database
      await newLaptop.save();

      return res.status(201).json(newLaptop);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Could not create Laptop record" });
    }
  } else if (req.method === "GET") {
    try {
      const allLaptops = await Laptop.find().populate("assignedTo", "name"); // Populate the "assignedTo" field with the name of the instructor
      return res.status(200).json(allLaptops);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Could not fetch Laptop records" });
    }
  } else if (req.method === "DELETE") {
    try {
      // Delete all Laptop documents
      await Laptop.deleteMany({});
      return res.status(204).send(); // Respond with a 204 status for successful deletion
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Could not delete Laptop records" });
    }
  }

  return res.status(400).json({ error: "Invalid request" });
};
