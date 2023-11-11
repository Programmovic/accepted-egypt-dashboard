// batch.js
import connectDB from "@lib/db";
import Batch from "../../../models/batch";
import Lecture from "../../../models/lecture";
import Reservation from "../../../models/reservation";
import Student from "../../../models/student";

export default async (req, res) => {
  await connectDB();

  if (req.method === "POST") {
    try {
      const batchData = req.body;

      // Create a new Batch document
      const newBatch = new Batch(batchData);

      // Calculate the number of weeks between start and end dates
      const startDate = new Date(batchData.shouldStartAt);
      const endDate = new Date(batchData.shouldEndAt);
      const timeDifference = endDate.getTime() - startDate.getTime();
      const weeks = Math.ceil(timeDifference / (7 * 24 * 60 * 60 * 1000));

      // Calculate the number of lectures based on the number of days in a week
      const lectureCount = weeks * batchData.weeklyHours.length;

      // Save the new batch to the database
      await newBatch.save();

      // ...
      console.log(batchData.weeklyHours)
      // Create lectures for the batch
      const lectures = [];
      let lectureCounter = 0;
      const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

      for (let i = 0; i < lectureCount; i++) {
        for (let j = 0; j < batchData.weeklyHours.length; j++) {
          lectureCounter++;
          // Calculate the date based on the day of the week
          const startBatchDate = new Date(startDate);
          startBatchDate.setDate(startBatchDate.getDate() + i * 7); // Start date for this lecture set
          const dayOfWeek = daysOfWeek.indexOf(batchData.weeklyHours[j].day);
          const lectureDate = new Date(startBatchDate);
          lectureDate.setDate(lectureDate.getDate() + dayOfWeek); // Calculate the lecture date

          const lectureData = {
            name: `${newBatch.name} Lecture ${lectureCounter}`.toUpperCase(),
            status: 'Scheduled',
            date: lectureDate,
            batch: newBatch._id,
            hours: batchData.weeklyHours.length,
            cost: newBatch.cost,
            limitTrainees: newBatch.limitTrainees,
            weeklyHours: batchData.weeklyHours[j],
            room: batchData.room,
            description: batchData.description,
            level: batchData.level,
            levelName: batchData.levelName
          };

          const reservationData = {
            title: lectureData.name,
            date: lectureDate,
            daysOfWeek: [batchData.weeklyHours[j].day], // Convert to an array for consistency
            startTime: batchData.weeklyHours[j].from,
            endTime: batchData.weeklyHours[j].to,
            room: batchData.room,
          };

          const newReservation = new Reservation(reservationData);
          await newReservation.save();

          const newLecture = new Lecture(lectureData);
          await newLecture.save();
          lectures.push(newLecture);
        }
      }

      // ...

      return res.status(201).json(newBatch);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Could not create batch" });
    }
  } else if (req.method === "GET") {
    try {
      const allBatches = await Batch.find();
      const batchsWithStudentCount = await Promise.all(
        allBatches.map(async (batch) => {
          const studentCount = await Student.countDocuments({ batch: batch._id });
          return { ...batch.toObject(), studentCount };
        })
      );
      return res.status(200).json(batchsWithStudentCount);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Could not fetch rooms" });
    }

  } else if (req.method === "PUT") {
    try {
      const { id } = req.query;
      const batchData = req.body;

      // Find the batch to be updated
      const batch = await Batch.findOne({ _id: id });
      if (!batch) {
        return res.status(404).json({ error: "Batch not found" });
      }

      // Calculate the number of weeks between start and end dates
      const startDate = new Date(batch.shouldStartAt);
      const endDate = new Date(batch.shouldEndAt);
      const timeDifference = endDate.getTime() - startDate.getTime();
      const weeks = Math.ceil(timeDifference / (7 * 24 * 60 * 60 * 1000));

      // Calculate the number of lectures based on the number of days in a week
      const lectureCount = weeks * batchData.weeklyHours.length;
      // Update the batch document
      const existingLectures = await Lecture.find({ batch: batch._id });
      console.log(existingLectures.length)
      await Batch.updateOne({ _id: batch._id }, batchData);
      if (existingLectures.length === 0) {
        

        const lectures = [];
        let lectureCounter = 0;
        const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

        for (let i = 0; i < lectureCount; i++) {
          for (let j = 0; j < batchData.weeklyHours.length; j++) {
            lectureCounter++;
            
            // Calculate the date based on the day of the week
            const startBatchDate = new Date(startDate);
            const dayOfWeek = daysOfWeek.indexOf(batchData.weeklyHours[j].day);
            startBatchDate.setDate(startBatchDate.getDate() + i * 7 + dayOfWeek); // Adjust the date calculation
            
            const lectureDate = new Date(startBatchDate);
        
            const lectureData = {
              name: `${batch.name} Lecture ${lectureCounter}`.toUpperCase(),
              status: 'Scheduled',
              date: lectureDate,
              batch: batch._id,
              hours: batch.weeklyHours.length,
              cost: batch.cost,
              limitTrainees: batch.limitTrainees,
              weeklyHours: batch.weeklyHours[j],
              room: batch.room,
              description: batch.description,
              level: batch.level,
              levelName: batch.levelName
            };

            const reservationData = {
              title: lectureData.name,
              date: lectureDate,
              daysOfWeek: [batch.weeklyHours[j].day], // Convert to an array for consistency
              startTime: batch.weeklyHours[j].from,
              endTime: batch.weeklyHours[j].to,
              room: batch.room,
            };

            const newReservation = new Reservation(reservationData);
            await newReservation.save();

            const newLecture = new Lecture(lectureData);
            await newLecture.save();
            lectures.push(newLecture);
          }
        }
        
        return res.status(200).json({ message: "Batch and its dependencies updated" });
      }
      else {
        console.log("I am Here");
        const updatedLectures = [];
        const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        let lectureCounter = 0;
      
        for (let i = 0; i < lectureCount; i++) {
          for (let j = 0; j < batchData.weeklyHours.length; j++) {
            lectureCounter++;
            const startBatchDate = new Date(startDate);
            startBatchDate.setDate(startBatchDate.getDate() + i * 7);
            const dayOfWeek = daysOfWeek.indexOf(batchData.weeklyHours[j].day);
            const lectureDate = new Date(startBatchDate);
            lectureDate.setDate(lectureDate.getDate() + dayOfWeek);
      
            // Update lecture data
            const lectureUpdateData = {
              name: `${batchData.name} Lecture ${lectureCounter}`.toUpperCase(),
              date: lectureDate,
              hours: batchData.weeklyHours.length,
              cost: batchData.cost,
              limitTrainees: batchData.limitTrainees,
              weeklyHours: batchData.weeklyHours[j],
              room: batchData.room,
              description: batchData.description,
              level: batchData.level,
              levelName: batchData.levelName,
            };
      
            const updatedLecture = await Lecture.findOneAndUpdate(
              { batch: batch._id, date: lectureDate },
              lectureUpdateData,
              { new: true }
            );
      
            updatedLectures.push(updatedLecture);
          }
        }
      
        // Update old reservations for the updated lectures
        for (const updatedLecture of updatedLectures) {
          const reservationUpdateData = {
            date: updatedLecture.date,
            daysOfWeek: [updatedLecture.weeklyHours.day],
            startTime: updatedLecture.weeklyHours.from,
            endTime: updatedLecture.weeklyHours.to,
            room: updatedLecture.room,
          };
          console.log(reservationUpdateData);
      
          await Reservation.updateMany(
            { title: updatedLecture.name },
            reservationUpdateData
          );
        }
      }
      
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Could not update batch and its dependencies" });
    }
  }
  else if (req.method === "DELETE") {
    try {
      const { id } = req.query;

      // Find the batch to be deleted
      const batch = await Batch.findOne({ _id: id });
      if (!batch) {
        return res.status(404).json({ error: "Batch not found" });
      }

      // Delete associated lectures
      await Lecture.deleteMany({ batch: batch._id });

      // Delete associated reservations (for each lecture)
      const lectures = await Lecture.find({ batch: batch._id });
      for (const lecture of lectures) {
        await Reservation.deleteMany({ title: lecture.name });
      }

      // Delete the batch
      await Batch.deleteOne({ _id: batch._id });

      return res.status(200).json({ message: "Batch and its dependencies deleted" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Could not delete batch and its dependencies" });
    }
  }
  

  return res.status(400).json({ error: "Invalid request" });
};
