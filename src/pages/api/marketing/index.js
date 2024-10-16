import connectDB from "@lib/db";
import MarketingData from "../../../models/marketingData";
import MarketingDataHistory from "../../../models/marketingHistory";
import Prospect from "../../../models/prospect";
import Employee from "../../../models/employee"; // Import Employee model
import Department from "../../../models/department";
import Position from "../../../models/position";
import PlacementTest from "../../../models/placement_test";
import Attendance from "../../../models/attendance";
import Transaction from "../../../models/transaction";
import WaitingList from "../../../models/waiting_list";
import PendingPayment from "../../../models/pendingLeadPayment";
import Lecture from "../../../models/lecture";
import Student from "../../../models/student";
import Level from "../../../models/level";
import Batch from "../../../models/batch";
import jwt from "jsonwebtoken";
import cookie from "cookie";
import authMiddleware from "../../../middlewares/authorization"; // Import your middleware

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
        test_waiting_list,
        ewfs,
      } = req.query;

      if (id) {
        // Fetch specific MarketingData record by ID
        const marketingData = await MarketingData.findById(id).populate(
          "placementTest"
        );

        if (!marketingData) {
          return res.status(404).json({ error: "Marketing data not found" });
        }

        // Fetch Level details using the name stored in assignedLevel
        const level = await Level.findOne({
          name: marketingData.assignedLevel,
        });

        // Fetch Batches related to this level
        let batches = [];
        if (level) {
          batches = await Batch.find({ level: level._id });
        }

        // Construct the response object with level details and batches embedded
        const response = {
          ...marketingData.toJSON(),
          assignedLevel: {
            name: marketingData.assignedLevel,
            details: level ? level.toJSON() : null, // Include level details or null if not found
            batches: batches.map((batch) => batch.toJSON()), // Include batch details
          },
        };

        // Return the response object
        return res.status(200).json(response);
      } else {
        let allMarketingData = [];
        if (assignedToModerator) {
          // Run the authorization check
          await new Promise((resolve, reject) => {
            authMiddleware(req, res, (err) => {
              if (err) return reject(err);
              resolve();
            });
          });

          // Fetch all MarketingData records assigned to moderators and sort by creation date (newest first)
          if (req.user.role === "super_admin") {
            allMarketingData = await MarketingData.find({
              assignedToModeration: { $exists: true, $ne: null, $ne: "" },
            });
          } else {
            console.log(req.user.employee);
            const employee = await Employee.findOne({ _id: req.user.employee });
            console.log(employee);

            allMarketingData = await MarketingData.find({
              assignedToModeration: {
                $eq: employee.name, // Check if assignedToModeration equals the employee
                $exists: true,
                $ne: null,
                $ne: "",
              },
            });
          }
        } else if (assignedToMember) {
          // Run the authorization check
          await new Promise((resolve, reject) => {
            authMiddleware(req, res, (err) => {
              if (err) return reject(err);
              resolve();
            });
          });

          // Fetch all MarketingData records assigned to moderators and sort by creation date (newest first)
          if (req.user.role === "super_admin") {
            allMarketingData = await MarketingData.find({
              assignedToSales: { $exists: true, $ne: null, $ne: "" },
            }).sort({ createdAt: -1 });
          } else {
            console.log(req.user.employee);
            const employee = await Employee.findOne({ _id: req.user.employee });
            console.log(employee);

            allMarketingData = await MarketingData.find({
              assignedToSales: {
                $eq: employee.name, // Check if assignedToModeration equals the employee
                $exists: true,
                $ne: null,
                $ne: "",
              },
            });
          }
        } else if (pending) {
          allMarketingData = await MarketingData.find({
            paymentMethod: { $ne: "" },
            levelPaidAmount: { $ne: null },
            verificationStatus: { $ne: "Verified" },
          })

            .sort({ createdAt: -1 })
            .populate([{ path: "placementTest", strictPopulate: false }]);
        } else if (recruitment) {
          allMarketingData = await MarketingData.find({
            candidateSignUpFor: "Recruitment",
            assignedToSales: { $exists: true, $ne: null, $ne: "" },
          }).sort({ createdAt: -1 });
        } else if (ewfs) {
          // Run the authorization check
          await new Promise((resolve, reject) => {
            authMiddleware(req, res, (err) => {
              if (err) return reject(err);
              resolve();
            });
          });

          // Fetch all MarketingData records assigned to moderators and sort by creation date (newest first)
          if (req.user.role === "super_admin") {
            allMarketingData = await MarketingData.find({
              candidateSignUpFor: "E3WFS",
              assignedToSales: { $exists: true, $ne: null, $ne: "" },
            }).sort({ createdAt: -1 });
          } else {
            console.log(req.user.employee);
            const employee = await Employee.findOne({ _id: req.user.employee });
            console.log(employee);

            allMarketingData = await MarketingData.find({
              candidateSignUpFor: "E3WFS",
              assignedToSales: {
                $eq: employee.name, // Check if assignedToModeration equals the employee
                $exists: true,
                $ne: null,
                $ne: "",
              },
            });
          }

          allMarketingData = await MarketingData.find({
            candidateSignUpFor: "E3WFS",
            assignedToSales: { $exists: true, $ne: null, $ne: "" },
          }).sort({ createdAt: -1 });
        } else if (test_waiting_list) {
          allMarketingData = await MarketingData.find({
            verificationStatus: "Verified",
            placementTest: null,
          }).sort({ createdAt: -1 });
        } else {
          // Fetch all MarketingData records and sort by creation date (newest first)
          allMarketingData = await MarketingData.find();
        }
        // Find all employees and populate their position and department details
        const allEmployees = await Employee.find()
          .populate("position") // Populate position details
          .populate("department"); // Populate department details
        console.log(allEmployees);
        // Filter employees to get only those in the "Sales" department with the position of "Supervisor"
        const salesSupervisors = allEmployees.filter(
          (employee) =>
            employee.department &&
            employee.department.name === "Sales" &&
            employee.position &&
            employee.position.name === "Supervisor" // Assuming position has a title field
        );
        // Filter employees to get only those in the "Sales" department with the position of "Supervisor"
        const salesAgents = allEmployees.filter(
          (employee) =>
            employee.department &&
            employee.department.name === "Sales" &&
            employee.position &&
            employee.position.name === "Agent" // Assuming position has a title field
        );
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
      let updates = req.body;

      // // Log the initial updates
      // console.log("Initial updates:", updates);

      // Ensure assignedLevel is either a string or extracted from the object
      if (updates?.assignedLevel) {
        if (
          typeof updates.assignedLevel === "object" &&
          updates.assignedLevel.name
        ) {
          // If assignedLevel is an object, extract the name property
          updates.assignedLevel = updates.assignedLevel.name;
        } else if (typeof updates.assignedLevel !== "string") {
          // If assignedLevel is neither a string nor a valid object, assign null or handle the error
          updates.assignedLevel = null; // or throw an error if necessary
        }
      }

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

      // Handle batch assignment logic if assignedBatch exists
      if (updates.assignedBatch) {
        const { levelDiscount, assignedBatch, levelPaidAmount } = updates;

        // Find the assignedBatch by ID
        const batchData = await Batch.findById(assignedBatch);
        if (!batchData) {
          return res.status(404).json({ error: "Batch not found" });
        }
        // Find the student by phoneNo1 or phoneNo2
        const studentData = await Student.findOne({
          $or: [
            { phoneNumber: originalMarketingData.phoneNo1 },
            { phoneNumber: originalMarketingData.phoneNo2 },
          ],
        });

        console.log(studentData);
        if (!studentData) {
          return res.status(404).json({ error: "Batch not found" });
        }
        // // Calculate due amount
        // const dueAmount = +(+batchData.cost - (levelDiscount / 100) * +batchData.cost) - (+levelPaidAmount);

        // Update student data
        studentData.batch = assignedBatch;
        studentData.status = "Joined Batch";
        studentData.WaitingList = false;

        // Save the updated student record
        await studentData.save();
        // Update the waiting list entry to mark it as archived
        const updatedWaitingList = await WaitingList.findOneAndUpdate(
          {
            student: studentData._id,
          },
          {
            $set: { isArchived: true }, // Mark as archived
          },
          { new: true } // Return the updated document
        );
        // Find an existing transaction for the student that doesn't have a batch assigned yet
        const existingTransaction = await Transaction.findOne({
          student: studentData._id,
          batch: { $exists: false }, // Find transactions without a batch assigned
        });

        if (existingTransaction) {
          // Update the transaction with the selected batch
          existingTransaction.batch = assignedBatch;
          // Save the updated transaction
          await existingTransaction.save();
        }

        // Handle attendance for all lectures in the assigned batch
        const lectures = await Lecture.find({ batch: assignedBatch });
        for (const lectureId of lectures) {
          const attendanceRecord = new Attendance({
            lecture: lectureId,
            trainee: studentData._id,
            date: new Date(), // Current date
            status: "Not Assigned",
          });
          await attendanceRecord.save();
        }
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
          originalData: originalMarketingData.toJSON(),
        });
      }
      if (existingPhoneNo2) {
        return res.status(400).json({
          error: "Phone number already exists in another record",
          conflictData: existingPhoneNo2,
          originalData: originalMarketingData.toJSON(),
        });
      }

      // Utility function to convert empty strings to null
      const convertEmptyStringsToNull = (obj) => {
        Object.keys(obj).forEach((key) => {
          if (obj[key] === "") {
            obj[key] = null;
          }
        });
      };

      // Prepare the updates object (assuming it's defined and populated)
      convertEmptyStringsToNull(updates);

      // Create an object to hold only changed or empty fields
      const fieldsToUpdate = {};
      for (const key in updates) {
        // Check if the field is different from the original or if it's empty
        console.log(updates[key], originalMarketingData[key]);
        if (
          updates[key] !== originalMarketingData[key] &&
          updates[key] !== null
        ) {
          fieldsToUpdate[key] = updates[key];
        }
      }
      console.log(fieldsToUpdate);

      // Update the MarketingData document with only the changed or empty fields
      const updatedMarketingData = await MarketingData.findByIdAndUpdate(
        id,
        fieldsToUpdate,
        { new: true }
      );

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
        editedBy: decoded.adminId,
      });
      await historyEntry.save();

      // Handle prospect and pending payments logic
      if (
        updates.candidateStatusForSalesPerson?.toLowerCase() === "interested"
      ) {
        const prospectData = {
          name: updatedMarketingData.name,
          phoneNumber: updatedMarketingData.phoneNo1,
          email: updatedMarketingData.email,
          nationalId: updatedMarketingData.nationalId,
          status: "New",
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

      if (updates.verificationStatus?.toLowerCase() === "verified") {
        await Prospect.findOneAndDelete({
          $or: [
            { phoneNumber: updatedMarketingData.phoneNo1 },
            { email: updatedMarketingData.email },
          ],
        });
      }

      if (updates.placementTestAmountAfterDiscount) {
        const existingPendingPayment = await PendingPayment.findOne({
          leadId: id,
          paymentType: "Placement Test",
        });

        if (!existingPendingPayment) {
          const pendingPayment = new PendingPayment({
            leadId: id,
            customerName: updatedMarketingData.name,
            customerPhone: updatedMarketingData.phoneNo1,
            amountPaid: updates.placementTestAmountAfterDiscount,
            paymentMethod: updates.paymentMethod || "Bank Transfer",
            paymentType: "Placement Test",
            paymentDate: new Date(),
            createdBy: decoded.adminId,
            updatedBy: decoded.adminId,
          });
          await pendingPayment.save();
        }
      }

      if (updates.levelPaidAmount) {
        const pendingPayment = new PendingPayment({
          leadId: id,
          customerName: updatedMarketingData.name,
          customerPhone: updatedMarketingData.phoneNo1,
          amountPaid: updates.levelPaidAmount,
          paymentMethod: updates.paymentMethod || "Bank Transfer",
          paymentType: "Level Fee",
          paymentDate: new Date(),
          createdBy: decoded.adminId,
          updatedBy: decoded.adminId,
        });
        await pendingPayment.save();
      }

      return res.status(200).json(updatedMarketingData.toJSON());
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ error: "Failed to update marketing data. Please try again." });
    }
  } else if (req.method === "DELETE") {
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
