import connectDB from "@lib/db";
import Student from "../../../models/student";
import Class from "../../../models/class";
import Group from "../../../models/group";
const mongoose = require('mongoose');

export default async (req, res) => {
  await connectDB();
  if (req.method === "POST") {
    try {
      const { name, groups } = req.body;
      const groupIds = groups

      const groupData = await Group.find({ _id: { $in: groupIds } });
      const classIds = groupData.map(group => group.class);
      const classData = await Class.find({ _id: { $in: classIds } });
      let totalCost = 0;
    
      for (const classInfo of classData) {
        totalCost += classInfo.price || 0;
      };

      // Create a new Student document with the calculated cost
      const newStudent = new Student({ name, groups, cost: totalCost });

      // Save the new student to the database
      await newStudent.save();

      return res.status(201).json(newStudent);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Could not create the student" });
    }
  } else {
    return res.status(400).json({ error: "Invalid request" });
  }
};

async function calculateCost(groups) {
  
  return totalCost;
}

