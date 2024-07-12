// inventory.js
import connectDB from "@lib/db";
import AssignedItem from "../../../models/inventory";
import Employee from "../../../models/employee"; // Replace with your actual employee model name
import QRCode from "qrcode";
import { promisify } from "util";

const generateQRCodeAsync = promisify(QRCode.toDataURL);

export default async (req, res) => {
  await connectDB();

  if (req.method === "POST") {
    try {
      const itemData = req.body;

      // Create a new Inventory document
      const newItem = new AssignedItem(itemData);

      // Generate QR code for the item
      const qrCodeURL = await generateQRCodeAsync(JSON.stringify({
        ItemID: newItem._id,
        ItemName: newItem.itemName,
        ItemCategory: newItem.itemCategory,
        AssignedTo: newItem.assignedTo?.name || 'N/A',
        AssignedDate: newItem.assignedDate || 'N/A',
      }));

      // Save the new item record to the database
      await newItem.save();

      return res.status(201).json({ ...newItem.toJSON(), qrCodeURL });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Could not create Item record" });
    }
  } else if (req.method === "GET") {
    try {
      const allItems = await AssignedItem.find().populate("assignedTo", "name"); // Populate the "assignedTo" field with the name of the employee
      
      // Generate QR code URLs for each item
      const itemsWithQRCode = await Promise.all(allItems.map(async (item) => {
        const qrCodeURL = await generateQRCodeAsync(JSON.stringify({
          ItemID: item._id,
          ItemName: item.itemName,
          ItemCategory: item.itemCategory,
          AssignedTo: item.assignedTo?.name || 'N/A',
          AssignedDate: item.assignedDate || 'N/A',
        }));
        return { ...item.toJSON(), qrCodeURL };
      }));

      return res.status(200).json(itemsWithQRCode);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Could not fetch Item records" });
    }
  } else if (req.method === "DELETE") {
    try {
      // Delete all Inventory documents
      await AssignedItem.deleteMany({});
      return res.status(204).send(); // Respond with a 204 status for successful deletion
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Could not delete Item records" });
    }
  }

  return res.status(400).json({ error: "Invalid request" });
};
