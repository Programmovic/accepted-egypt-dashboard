import connectDB from "@lib/db";
import PlacementTestSettings from "../../../models/placement_test_settings";
import Reservation from "../../../models/reservation";

export default async (req, res) => {
  await connectDB();

  if (req.method === "POST") {
    const test = req.body;

    try {
      // Create a new PlacementTestSettings document
      const newTest = new PlacementTestSettings(test);
      await newTest.save();

      // Create a corresponding reservation
      const testDate = new Date(newTest.date);
      const reservation = new Reservation({
        title: "Placement Test",
        date: testDate,
        daysOfWeek: [testDate.toLocaleDateString("en-US", { weekday: "long" })],
        startTime: "09:00 AM", // Adjust start and end times as needed
        endTime: "05:00 PM",
        room: newTest.room, // Assuming you have room information in the placement test
      });

      await reservation.save();
      console.log(reservation)

      return res.status(201).json({ newTest });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Could not create placement test and reservation" });
    }
  } else if (req.method === "GET") {
    try {
      const allTests = await PlacementTestSettings.find();
      return res.status(200).json(allTests);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Could not fetch placement tests" });
    }
  } else {
    return res.status(400).json({ error: "Invalid request" });
  }
};
