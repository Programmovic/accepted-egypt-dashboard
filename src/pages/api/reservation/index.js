import connectDB from "@lib/db";
import Reservation from "../../../models/reservation";
import Batch from "../../../models/batch"; // Import the Batch model
import PlacementTestSettings from "../../../models/placement_test_settings";
import mongoose from "mongoose";

export default async (req, res) => {
  await connectDB();

  if (req.method === "POST") {
    // Handle POST request (if applicable)
  } else if (req.method === "GET") {
    // Handle fetching all reservations with optional filters
    try {
      const { room, instructor } = req.query;

      var allReservations;
      if (room !== "" || instructor !== "") {
        console.log("here");

        let queryConditions = [];

        // If instructor is provided, find the associated batches and placement test settings
        if (instructor) {
          const batch = await Batch.findOne({ instructor: instructor });
          const placement_test_settings = await PlacementTestSettings.findOne({
            instructor: instructor,
          });
console.log(placement_test_settings)
          // Add batch and placementTest settings to the query if found
          if (batch) {
            queryConditions.push({ batch: batch._id });
          }
          if (placement_test_settings) {
            queryConditions.push({
              placementTest: placement_test_settings._id,
            });
          }
        }

        // If room is provided, add it to the query
        if (room) {
          queryConditions.push({ room: room });
        }

        if (queryConditions.length > 0) {
          // If there are any conditions, run the query
          allReservations = await Reservation.find({
            $or: queryConditions,
          })
            .populate({
              path: "batch",
              populate: {
                path: "instructor", // Assuming the Batch model has an 'instructor' field
                model: "Employee", // Populate the instructor data from the Employee model (adjust if needed)
              },
            })
            .populate("room") // Populate the room data
            .populate({
              path: "placementTest",
              populate: {
                path: "instructor",
                model: "Employee", // Populate the instructor data from the Employee model (adjust if needed)
              },
            });

          return res.status(200).json(allReservations); // Return the results
        } else {
          // If no conditions are matched, return an empty array or appropriate message
          return res
            .status(404)
            .json({ error: "No matching reservations found." });
        }
      } else {
        // If neither room nor instructor is provided, fetch all reservations
        allReservations = await Reservation.find()
          .populate({
            path: "batch",
            populate: {
              path: "instructor",
              model: "Employee",
            },
          })
          .populate("room")
          .populate({
            path: "placementTest",
            populate: {
              path: "instructor",
              model: "Employee",
            },
          });
        console.log("iiiii", allReservations);
        return res.status(200).json(allReservations); // Return all reservations when no filters are applied
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Could not fetch reservations" });
    }
  } else {
    return res.status(400).json({ error: "Invalid request" });
  }
};
