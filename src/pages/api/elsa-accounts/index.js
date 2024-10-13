import connectDB from "@lib/db";
import ElsaAccount from "../../../models/ElsaAccount";
import Student from "../../../models/student";

export default async (req, res) => {
  try {
    await connectDB();

    if (req.method === "POST") {
      try {
        const {
          student,
          email,
          subscriptionStatus,
          subscriptionStartDate,
          subscriptionEndDate,
          monthlyCost,
          createdByAdmin,
          adminName,
          paymentDetails,
          comment,
        } = req.body;
        console.log(req.body);
        // Function to replace empty strings with null
        const replaceEmptyStringsWithNull = (obj) => {
          return Object.fromEntries(
            Object.entries(obj).map(([key, value]) => [
              key,
              value === "" ? null : value,
            ])
          );
        };

        // Create new Elsa Account
        const newElsaAccountData = {
          student,
          email,
          subscriptionStatus,
          subscriptionStartDate,
          subscriptionEndDate,
          monthlyCost,
          createdByAdmin,
          adminName,
          paymentDetails,
          comment,
        };

        const newElsaAccount = new ElsaAccount(
          replaceEmptyStringsWithNull(newElsaAccountData)
        );

        const savedElsaAccount = await newElsaAccount.save();
        return res.status(201).json({ elsaAccount: savedElsaAccount });
      } catch (error) {
        console.error("Error creating Elsa Account:", error);
        return res.status(500).json({ error: "Failed to create Elsa account" });
      }
    }
    if (req.method === "PUT") {
      const { id } = req.query;
      const updateData = req.body;
      console.log(updateData);

      try {
        // Find the existing Elsa Account by ID
        const existingElsaAccount = await ElsaAccount.findById(id);

        if (!existingElsaAccount) {
          return res.status(404).json({ error: "Elsa Account not found" });
        }

        // Store the current state in the history before updating
        existingElsaAccount.history.push({
          student: existingElsaAccount.student,
          subscriptionPeriod: {
            startDate: existingElsaAccount.subscriptionStartDate,
            endDate: existingElsaAccount.subscriptionEndDate,
          },
          monthlyCost: existingElsaAccount.monthlyCost,
          assignedAt: new Date(), // Capture the current date
        });

        await existingElsaAccount.save(); // Save the history

        // Check if the student has changed
        if (
          updateData.student &&
          updateData.student !== existingElsaAccount.student
        ) {
          // Assign the new student's email to the Elsa Account
          const newStudent = await Student.findById(updateData.student);

          if (newStudent) {
            console.log("Student found: ", newStudent); // Debugging line
            newStudent.elsaAccount = id;

            // Set subscription start date to now
            updateData.subscriptionStartDate = new Date();
            console.log(
              "Subscription start date set: ",
              updateData.subscriptionStartDate
            ); // Log after setting start date

            // Set subscription end date to one month later
            let subscriptionEndDate = new Date();
            subscriptionEndDate.setMonth(subscriptionEndDate.getMonth() + 1);
            updateData.subscriptionEndDate = subscriptionEndDate;
            console.log(
              "Subscription end date set: ",
              updateData.subscriptionEndDate
            ); // Log after setting end date
            newStudent.save(); // Save the updated student
          } else {
            console.log("No student found with ID: ", updateData.student);
          }
        } else {
          console.log("Student not updated or same as existing.");
        }

        // Update the Elsa Account with new data
        const updatedElsaAccount = await ElsaAccount.findOneAndUpdate(
          { _id: id },
          updateData,
          { new: true }
        );

        console.log(updatedElsaAccount);
        return res.status(200).json({ elsaAccount: updatedElsaAccount });
      } catch (error) {
        console.error("Error updating Elsa Account:", error);
        return res.status(500).json({ error: "Failed to update Elsa account" });
      }
    }
    if (req.method === "GET") {
      const { id } = req.query;

      try {
        let elsaAccount;

        if (id) {
          // Only proceed if the id is valid
          elsaAccount = await ElsaAccount.findById(id)
            .populate("student")
            .populate("history.student");
        } else if (!id) {
          // If no ID is provided, return all Elsa accounts
          elsaAccount = await ElsaAccount.find().populate("student");
        } else {
          return res.status(400).json({ message: "Invalid ID format" });
        }

        return res.status(200).json(elsaAccount);
      } catch (error) {
        console.error("Error fetching Elsa Account:", error);
        return res.status(500).json({ message: "Server error" });
      }
    }
  } catch (error) {
    console.error("Server error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
