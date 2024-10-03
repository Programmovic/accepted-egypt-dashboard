import React from "react";
import { AdminLayout } from "@layout";

const Help = () => {
  return (
    <AdminLayout>
      <div>
        <h2>Accepted Management System Documentation</h2>

        <h3>Overview</h3>
        <p>
          The <strong>Accepted Management System</strong> is designed to manage the operations of an educational institution, including administrative setup, marketing, sales processes, and academic management. This system uses a sidebar navigation that allows access to various tabs for different functions.
        </p>

        <h3>Sidebar Tabs and Their Functions</h3>

        <ol>
          <li>
            <strong>Administration Tab</strong>
            <p>
              The <strong>Administration</strong> tab is used for configuring the system. It includes the following sections:
            </p>
            <ul>
              <li><strong>Admins</strong>: Manage admin users.</li>
              <li><strong>Branches</strong>: Set up different branches of the institution.</li>
              <li><strong>Levels</strong>: Define the academic levels offered.</li>
              <li><strong>Rooms</strong>: Add and manage rooms used for classes and tests.</li>
              <li><strong>Schedule</strong>: Configure schedules for classes, tests, and events.</li>
              <li><strong>Room Utilizations</strong>: Monitor the usage of rooms for optimal scheduling.</li>
              <li><strong>Courses</strong>: Create and manage courses.</li>
              <li><strong>Sales Dropdowns</strong>: Configure dropdown options for sales processes.</li>
              <li><strong>Recruitment Dropdowns</strong>: Set up options related to recruitment activities.</li>
              <li><strong>Departments</strong>: Manage different departments within the organization.</li>
              <li><strong>Positions</strong>: Define roles and positions within the institution.</li>
              <li><strong>ILSA Accounts</strong>: Manage accounts related to ILSA (an external system or feature).</li>
            </ul>
            <p>The Administration tab allows system administrators to configure all dropdown fields used throughout the system, ensuring proper functionality in all areas.</p>
          </li>

          <li>
            <strong>Marketing Tab</strong>
            <p>
              The <strong>Marketing</strong> tab handles the management of leads collected by the marketing team.
            </p>
            <ul>
              <li><strong>Leads</strong>: Marketing managers and members enter the data they have collected about potential students or clients. After entering this data, they can review and assign it to the <strong>Sales Supervisors</strong>.</li>
            </ul>
          </li>

          <li>
            <strong>Sales Tab</strong>
            <p>
              The <strong>Sales</strong> tab is where the sales process takes place. It includes different roles and steps:
            </p>
            <ul>
              <li><strong>Sales Supervisor</strong>: After receiving the leads from the marketing team, the sales supervisor reviews and assigns them to individual sales agents.</li>
              <li><strong>Sales Member</strong>: Sales members access their assigned leads and manage each lead's details and progress. Each lead’s page includes the following fields:</li>
            </ul>
            <ul>
              <li><strong>Name</strong></li>
              <li><strong>Phone Number 1</strong></li>
              <li><strong>Phone Number 2</strong></li>
              <li><strong>Status</strong></li>
              <li><strong>Training Location</strong></li>
              <li><strong>Candidate Signup For</strong></li>
              <li><strong>Candidate Status for Salesperson</strong></li>
              <li><strong>Sales Rejection Reason</strong></li>
              <li><strong>Placement Test Discount</strong></li>
              <li><strong>Placement Test Paid Amount</strong></li>
              <li><strong>Placement Test Amount After Discount</strong></li>
              <li><strong>Payment Message</strong></li>
              <li><strong>Screenshot of Payment Proof</strong></li>
              <li><strong>Assigned Level</strong></li>
              <li><strong>Level Discount</strong></li>
              <li><strong>Level Paid Amount</strong></li>
              <li><strong>Level Amount After Discount</strong></li>
              <li><strong>Remaining Amount After Discount</strong></li>
              <li><strong>Is Level Fully Paid?</strong></li>
              <li><strong>Patch Selection</strong></li>
              <li><strong>Reference Number</strong></li>
              <li><strong>Chat Summary</strong></li>
              <li><strong>Language Issues</strong></li>
            </ul>
            <p>
              The sales agent communicates with the customer to ensure payments are made for placement tests and level enrollments. After receiving payment, there is a <strong>pending transaction</strong> that needs to be verified by the <strong>Operation Manager</strong>.
            </p>
            <p>
              After the payment is verified, the sales agent can assign the placement test to the customer.
            </p>
          </li>

          <li>
            <strong>Academic Tab</strong>
            <p>
              The <strong>Academic</strong> tab manages student placement and academic progress.
            </p>
            <ul>
              <li><strong>Placement Test</strong>: Sales agents create placement tests for students by navigating to <strong>Academic → Placement Test → Add Placement Test</strong>. The system will not allow the sales process to continue until a level is assigned to the student based on the placement test results.</li>
            </ul>
            <p>Once the level is assigned, the sales member will proceed with payment collection for the assigned level, following the same process as the placement test.</p>
          </li>
        </ol>

        <h3>Detailed Workflow</h3>
        <ol>
          <li><strong>Marketing Process</strong>: The marketing team enters collected leads and assigns them to sales supervisors.</li>
          <li><strong>Sales Process</strong>:</li>
          <ul>
            <li>Sales Supervisor reviews assigned leads and delegates them to sales agents.</li>
            <li>Sales Agents contact the leads, request payment for the placement test, and submit proof of payment.</li>
            <li>Payment is verified by the Operation Manager.</li>
            <li>Once verified, sales agents assign the placement test to the customer.</li>
            <li>The Academic Department assigns a level based on the test results.</li>
          </ul>
          <li><strong>Academic Process</strong>: After a level is assigned, sales agents follow the same payment and verification process for the level enrollment.</li>
        </ol>

        <h3>Conclusion</h3>
        <p>
          The <strong>Accepted Management System</strong> is a comprehensive tool that streamlines the process from marketing lead generation to sales and academic placement. It ensures that all steps, from room management to student enrollment, are tracked, monitored, and verified for smooth operation.
        </p>
      </div>
    </AdminLayout>
  );
};

export default Help;
