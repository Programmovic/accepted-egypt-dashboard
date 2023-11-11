
import connectDB from "@lib/db";
import Lecture from "../../../models/lecture";

// Implement this function to get the day from a date
const getDayFromDate = (dateString) => {
  // ... (as shown in the previous example)
};

export default async (req, res) => {
  await connectDB();

  if (req.method === "PUT") {
    // const { id } = req.query;
    // const { newDate } = req.body;

    try {
    //   // Find the lecture by ID
    //   const lecture = await Lecture.findById(id);

    //   if (!lecture) {
    //     return res.status(404).json({ error: "Lecture not found" });
    //   }

    //   // Update the lecture day
    //   const newDay = getDayFromDate(newDate);

    //   // Update the lecture day
    //   lecture.day = newDay;

    //   // Save the updated lecture
    //   await lecture.save();

      return getWeekdaysInRange('31/10/2023', '30/11/2023', ['Monday', ['Tuesday']]);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Could not update lecture day" });
    }
  }

  return res.status(400).json({ error: "Invalid request" });
};
const getWeekdaysInRange = (startDate, endDate, weekdays) => {
    const weekdaysSet = new Set(weekdays);
  
    const result = [];
  
    const currentDate = new Date(startDate);
  
    while (currentDate <= endDate) {
      const dayOfWeek = currentDate.getDay();
  
      if (weekdaysSet.has(dayOfWeek) && dayOfWeek >= 1 && dayOfWeek <= 5) {
        // Add the current date to the result if it's a weekday
        result.push(new Date(currentDate));
      }
  
      // Move to the next day
      currentDate.setDate(currentDate.getDate() + 1);
    }
  
    return result;
  };
  // api/lectures/[id].js