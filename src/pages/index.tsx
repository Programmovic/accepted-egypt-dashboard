import type { NextPage } from "next";
import React from "react";
import { AdminLayout } from "@layout";

const Help: NextPage = () => {
  return (
    <AdminLayout>
      <div>
        <h2>How to Use the System</h2>

        <ol>
          <li>
            <strong>Account Creation and Sign-In</strong>
            <p>
              Upon entering the system, the first step is to create a personal account and sign in. Your account will be your gateway to access and manage various aspects of the system.
            </p>
          </li>
          <li>
            <strong>Homepage and Main Dashboard</strong>
            <p>
              After signing in, you'll land on the homepage, where you will find the main dashboard with comprehensive statistics and insights. This dashboard serves as the central hub for monitoring and managing different system functions.
            </p>
          </li>
          <li>
            <strong>Adding Rooms</strong>
            <p>
              The first task is to add rooms to the system. This is essential for scheduling classes, lectures, and other activities. Rooms provide the physical locations where educational activities take place.
            </p>
          </li>
          <li>
            <strong>Placement Test Days</strong>
            <p>
              The next step is to set up placement test days within the available rooms. These days are crucial for assessing students' proficiency levels and determining their appropriate course placements.
            </p>
          </li>
          <li>
            <strong>Adding New Students</strong>
            <p>
              With rooms and placement test days in place, you can start adding new students to the system. When adding a student, you'll have the option to assign them to a specific placement test.
            </p>
          </li>
          <li>
            <strong>Student Placement Tests</strong>
            <p>
              After the student has completed the placement test, navigate to the 'Student Placement Test' section. Here, you can set an appropriate level for the student based on their test results. Once the level is assigned, move the student to the waiting list for batch assignment.
            </p>
          </li>
          <li>
            <strong>Creating Courses and Batches</strong>
            <p>
              Now, it's time to create courses and their corresponding batches. Courses define the curriculum and structure of the educational programs, while batches represent specific class groups within these courses.
            </p>
          </li>
          <li>
            <strong>Assigning Students to Batches</strong>
            <p>
              After creating batches, go to the waiting list. In the waiting list, you can assign students to the appropriate batches based on their placement test results and desired course preferences.
            </p>
          </li>
          <li>
            <strong>Monitoring System Statistics</strong>
            <p>
              Throughout the entire process, you can access detailed statistics and reports for each aspect of the system. From room usage to student progress, the system provides comprehensive data and insights to help you make informed decisions and optimize your educational processes.
            </p>
          </li>
        </ol>
      </div>
    </AdminLayout>
  );
};

export default Help;
