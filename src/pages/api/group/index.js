import connectDB from "@lib/db";
import Group from "../../../models/group";
import Class from "../../../models/class";

export default async (req, res) => {
  await connectDB();
  if (req.method === "POST") {
    try {
      const { name, description, weeklyTime, weeklyDay, capacity, startDate, endDate, classId } = req.body;

      // Check if a group with the same name already exists within the specified class
      const existingGroup = await Group.findOne({ name, class: classId });

      if (existingGroup) {
        return res.status(400).json({ error: "Group with this name already exists in the class" });
      }

      // Create a new Group document
      const newGroup = new Group({ name, description, weeklyTime, weeklyDay, capacity, startDate: startDate, endDate: endDate, class: classId });

      // Save the new group to the database
      await newGroup.save();

      return res.status(201).json(newGroup);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Could not create the group" });
    }
  } else if (req.method === "GET") {
    try {
      const allGroups = await Group.find();
      const groupsWithClassName = await Promise.all(
        allGroups.map(async (group) => {
          const classData = await Class.find({_id: group.class}); // Ensure you have imported the Class model.
          const className = classData ? classData[0].title : "N/A"; 
          return {
            ...group._doc,
            className,
          };
        })
      );
      return res.status(200).json(groupsWithClassName);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Could not fetch Groups" });
    }
  }
  else if (req.method === "DELETE") {
    try {
      // Drop the Class collection (delete the entire schema and its data)
      await Group.collection.drop();
      return res.status(204).send(); // Respond with a 204 status for successful deletion
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Could not delete the Group schema" });
    }
  }


  return res.status(400).json({ error: "Invalid request" });
};
