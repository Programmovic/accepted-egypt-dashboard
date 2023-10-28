import connectDB from "@lib/db";
import Class from "../../../models/class";

export default async (req, res) => {
  await connectDB();
  if (req.method === "POST") {
    try {
      const classData = req.body;

      // Check if a class with the same name or code already exists
      const existingClass = await Class.findOne({
        $or: [
          { name: classData.name },
          { code: classData.code },
        ],
      });

      if (existingClass) {
        return res.status(400).json({ error: "Class with this name or code already exists" });
      }

      // Create a new Class document and include the provided "createdDate"
      const newClass = new Class(classData);

      // Save the new class to the database
      await newClass.save();

      return res.status(201).json(newClass);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Could not create class" });
    }
  } else if (req.method === "GET") {
    try {
      const allClasses = await Class.find();
      return res.status(200).json(allClasses);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Could not fetch classes" });
    }
  } else if (req.method === "DELETE") {
    try {
      // Drop the Class collection (delete the entire schema and its data)
      await Class.collection.drop();
      return res.status(204).send(); // Respond with a 204 status for successful deletion
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Could not delete the Class schema" });
    }
  }

  return res.status(400).json({ error: "Invalid request" });
};
