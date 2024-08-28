import connectDB from "@lib/db";
import MarketingData from "../../../models/marketingData";
import MarketingDataHistory from "../../../models/marketingHistory";
import Prospect from "../../../models/prospect";
import Employee from "../../../models/employee"; // Import Employee model
import Department from "../../../models/department";
import Position from "../../../models/position";
import PlacementTest from "../../../models/placement_test";
import Student from "../../../models/student";
import jwt from "jsonwebtoken";
import cookie from "cookie";

export default async (req, res) => {
  await connectDB();

  if (req.method === "POST") {
    try {
      let marketingData = req.body;

      if (!Array.isArray(marketingData)) {
        // If marketingData is not an array, convert it to an array with a single object
        marketingData = [marketingData];
      }

      // Map over each item in marketingData to create new documents
      const newMarketingData = await Promise.all(
        marketingData.map(async (data) => {
          const newDocument = new MarketingData(data);
          await newDocument.save();
          return newDocument.toJSON();
        })
      );

      return res.status(201).json(newMarketingData);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }
  } else if (req.method === "GET") {
    try {
      const {
        id,
        assignedToModerator,
        assignedToMember,
        pending,
        recruitment,
      } = req.query;

      if (id) {
        // Fetch specific MarketingData record by ID
        const marketingData = await MarketingData.findById(id);

        if (!marketingData) {
          return res.status(404).json({ error: "Marketing data not found" });
        }

        return res.status(200).json(marketingData.toJSON());
      } else {
        let allMarketingData = [];
        if (assignedToModerator) {
          // Fetch all MarketingData records assigned to moderators and sort by creation date (newest first)
          allMarketingData = await MarketingData.find({
            assignedToModeration: { $exists: true, $ne: null, $ne: "" },
          });
        } else if (assignedToMember) {
          // Fetch all MarketingData records assigned to members and sort by creation date (newest first)
          allMarketingData = await MarketingData.find({
            assignedToSales: { $exists: true, $ne: null, $ne: "" },
          }).sort({ createdAt: -1 });
        } else if (pending) {
          allMarketingData = await MarketingData.find({
            paymentMethod: { $ne: null },
            paidAmount: { $ne: null },
            verificationStatus: { $ne: "Verified" },
          })

            .sort({ createdAt: -1 })
            .populate([{ path: "placementTest", strictPopulate: false }]);
        } else if (recruitment) {
          allMarketingData = await MarketingData.find({
            candidateSignUpFor: "Recruitment",
          }).sort({ createdAt: -1 });
        } else {
          // Fetch all MarketingData records and sort by creation date (newest first)
          allMarketingData = await MarketingData.find();
        }
        const positions = await Position.find({
          name: { $in: ["Supervisor", "Agent"] },
        }).select("_id name");

        console.log("Positions:", positions);

        // Create a mapping for position names to IDs
        const positionMap = positions.reduce((acc, p) => {
          acc[p.name] = p._id;
          return acc;
        }, {});
        const departments = await Department.find({
          name: "Sales",
        }).select("_id name");

        console.log("Departments:", departments);

        const departmentIds = departments.map((d) => d._id);
        // Fetch supervisors in the Sales department
        const salesSupervisors = await Employee.find({
          department: { $in: departmentIds },
          position: positionMap["Supervisor"], // Use positionMap to get the Supervisor ID
        })
          .populate("position")
          .populate("department");

        console.log("Sales Supervisors:", salesSupervisors);

        // Fetch agents in the Sales department
        const salesAgents = await Employee.find({
          department: { $in: departmentIds },
          position: positionMap["Agent"], // Use positionMap to get the Agent ID
        })
          .populate("position")
          .populate("department");

        console.log("Sales Agents:", salesAgents);

        return res.status(200).json({
          marketingData: allMarketingData,
          salesModerators: salesSupervisors,
          salesMembers: salesAgents,
        });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }
  } else if (req.method === "PUT") {
    try {
      const { id } = req.query; // Assuming `id` is passed as a query parameter
      const updates = req.body;
      console.log(updates);
  
      // Extract the token from cookies
      const cookies = req.headers.cookie
        ? cookie.parse(req.headers.cookie)
        : {};
      const token = cookies.client_token;
      if (!token) {
        return res
          .status(401)
          .json({ error: "Unauthorized: No token provided" });
      }
  
      // Decode the token to get the user ID
      const decoded = jwt.verify(token, "your-secret-key");
  
      // Find the original document before the update
      const originalMarketingData = await MarketingData.findById(id);
      if (!originalMarketingData) {
        return res.status(404).json({ error: "Marketing data not found" });
      }
  
      // Check for duplicate phone numbers
      const phoneNumberChecks = [];
      if (
        updates.phoneNo1 &&
        updates.phoneNo1 !== originalMarketingData.phoneNo1
      ) {
        phoneNumberChecks.push(
          MarketingData.findOne({
            _id: { $ne: id },
            $or: [
              { phoneNo1: updates.phoneNo1 },
              { phoneNo2: updates.phoneNo1 },
            ],
          })
        );
      }
      if (
        updates.phoneNo2 &&
        updates.phoneNo2 !== originalMarketingData.phoneNo2
      ) {
        phoneNumberChecks.push(
          MarketingData.findOne({
            _id: { $ne: id },
            $or: [
              { phoneNo1: updates.phoneNo2 },
              { phoneNo2: updates.phoneNo2 },
            ],
          })
        );
      }
  
      const [existingPhoneNo1, existingPhoneNo2] = await Promise.all(
        phoneNumberChecks
      );
  
      if (existingPhoneNo1) {
        return res.status(400).json({
          error: "Phone number already exists in another record",
          conflictData: existingPhoneNo1,
          originalData: originalMarketingData.toJSON(), // Return the original data
        });
      }
      if (existingPhoneNo2) {
        return res.status(400).json({
          error: "Phone number already exists in another record",
          conflictData: existingPhoneNo2,
          originalData: originalMarketingData.toJSON(), // Return the original data
        });
      }
  
      // Update the MarketingData document by ID
      const updatedMarketingData = await MarketingData.findByIdAndUpdate(
        id,
        updates,
        { new: true }
      );
      console.log(updatedMarketingData);
      if (!updatedMarketingData) {
        return res
          .status(404)
          .json({ error: "Marketing data not found after update" });
      }
  
      // Save the change history
      const historyEntry = new MarketingDataHistory({
        marketingDataId: id,
        oldData: originalMarketingData.toObject(),
        newData: updatedMarketingData.toObject(),
        editedBy: decoded.adminId, // Use the decoded admin ID
      });
      await historyEntry.save();
  
      // Check for candidate interest status
      if (
        updates.candidateStatusForSalesPerson &&
        updates.candidateStatusForSalesPerson.toLowerCase() === "interested"
      ) {
        const prospectData = {
          name: updatedMarketingData.name,
          phoneNumber: updatedMarketingData.phoneNo1,
          email: updatedMarketingData.email,
          nationalId: updatedMarketingData.nationalId,
          status: "Marketing Lead",
          source: "Marketing",
          marketingDataId: updatedMarketingData._id,
          interestedInCourse: updatedMarketingData.interestedInCourse,
        };
  
        const existingProspect = await Prospect.findOne({
          $or: [
            { phoneNumber: prospectData.phoneNumber },
            { email: prospectData.email },
          ],
        });
  
        if (!existingProspect) {
          const newProspect = new Prospect(prospectData);
          await newProspect.save();
        }
      }
  
      // Remove prospect if verificationStatus is set to verified
      if (
        updates.verificationStatus &&
        updates.verificationStatus.toLowerCase() === "verified"
      ) {
        await Prospect.findOneAndDelete({
          $or: [
            { phoneNumber: updatedMarketingData.phoneNo1 },
            { email: updatedMarketingData.email },
          ],
        });
      }
  
      // Check if the update is setting a placement test
      if (updates.placementTest) {
        // Check if a student profile exists for the marketing data
        let student = await Student.findOne({
          phoneNumber: updatedMarketingData.phoneNo1,
          nationalId: updatedMarketingData.nationalId,
        });
  
        if (!student) {
          // Create a new student profile
          student = new Student({
            name: updatedMarketingData.name,
            phoneNumber: updatedMarketingData.phoneNo1,
            email: updatedMarketingData.email,
            nationalId: updatedMarketingData.nationalId,
            interestedInCourse: updatedMarketingData.interestedInCourse,
            createdByAdmin: decoded.adminId,
            adminName: decoded.adminName, // Assuming `adminName` is stored in the token
          });
          await student.save();
        }
  
        // Link the student to the selected placement test
        const placementTestEntry = new PlacementTest({
          student: student._id,
          generalPlacementTest: updates.placementTest,
          studentName: student.name,
          status: "Scheduled", // or any status you prefer
          studentNationalID: student.nationalId,
          studentPhoneNumber: student.phoneNumber,
          createdByAdmin: decoded.adminId,
          adminName: decoded.adminName, // Assuming `adminName` is stored in the token
        });
  
        await placementTestEntry.save();
      }
  
      return res.status(200).json(updatedMarketingData.toJSON());
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ error: "Failed to update marketing data. Please try again." });
    }
  }
  else if (req.method === "DELETE") {
    const { id } = req.query; // Extract `id` from query parameters

    try {
      if (id) {
        // Delete the specific MarketingData document by id
        const result = await MarketingData.findByIdAndDelete(id);

        if (!result) {
          return res.status(404).json({ error: "Item not found" }); // Respond with 404 if item is not found
        }

        return res.status(204).send(); // Respond with 204 status code for successful deletion
      } else {
        // Delete all MarketingData documents
        await MarketingData.deleteMany({});
        return res.status(204).send(); // Respond with 204 status code for successful deletion
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }
  }

  return res.status(400).json({ error: "Invalid request" });
};
