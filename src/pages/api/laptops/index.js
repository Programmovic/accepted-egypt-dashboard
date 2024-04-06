// laptop.js
import connectDB from "@lib/db";
import Laptop from "../../../models/laptops";
import Instructor from "../../../models/instructor";
import QRCode from "qrcode";
import { promisify } from "util";

const generateQRCodeAsync = promisify(QRCode.toDataURL);

export default async (req, res) => {
  await connectDB();

  if (req.method === "POST") {
    try {
      const laptopData = req.body;

      // Create a new Laptop document
      const newLaptop = new Laptop(laptopData);

      // Generate QR code for the laptop
      const qrCodeURL = await generateQRCodeAsync(JSON.stringify({
        SerialNumber: newLaptop._id,
        Brand: newLaptop.brand,
        Model: newLaptop.model,
        AssignedTo: newLaptop.assignedTo?.name || 'N/A',
        AssignedDate: newLaptop.assignedDate || 'N/A',
      }));

      // Save the new laptop record to the database
      await newLaptop.save();

      return res.status(201).json({ ...newLaptop.toJSON(), qrCodeURL });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Could not create Laptop record" });
    }
  } else if (req.method === "GET") {
    try {
      const allLaptops = await Laptop.find().populate("assignedTo", "name"); // Populate the "assignedTo" field with the name of the instructor
      
      // Generate QR code URLs for each laptop
      const laptopsWithQRCode = await Promise.all(allLaptops.map(async (laptop) => {
        const qrCodeURL = await generateQRCodeAsync(JSON.stringify({
          SerialNumber: laptop._id,
          Brand: laptop.brand,
          Model: laptop.model,
          AssignedTo: laptop.assignedTo?.name || 'N/A',
          AssignedDate: laptop.assignedDate || 'N/A',
        }));
        return { ...laptop.toJSON(), qrCodeURL };
      }));
console.log(laptopsWithQRCode)
      return res.status(200).json(laptopsWithQRCode);
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
