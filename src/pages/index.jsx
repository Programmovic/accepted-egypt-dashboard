import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Box, Typography, Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { AdminLayout } from "@layout";

const Help = () => {
  return (
    <AdminLayout>
      <Container>
        <Box sx={{ py: 4 }}>
          <Typography variant="h4" gutterBottom align="center">
            Accepted Management System Documentation
          </Typography>

          <Typography variant="h6" gutterBottom>
            Overview
          </Typography>
          <Typography paragraph>
            The <strong>Accepted Management System</strong> is designed to manage the operations of an educational institution, including administrative setup, marketing, sales processes, and academic management. This system uses a sidebar navigation that allows access to various tabs for different functions.
          </Typography>

          <Typography variant="h6" gutterBottom>
            Sidebar Tabs and Their Functions
          </Typography>

          {/* Accordion for each section */}
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle1">
                Administration Tab
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                The <strong>Administration</strong> tab is used for configuring the system. It includes the following sections:
              </Typography>
              <ul>
                <li>Admins: Manage admin users.</li>
                <li>Branches: Set up different branches of the institution.</li>
                <li>Levels: Define the academic levels offered.</li>
                <li>Rooms: Add and manage rooms used for classes and tests.</li>
                <li>Schedule: Configure schedules for classes, tests, and events.</li>
                <li>Room Utilizations: Monitor the usage of rooms for optimal scheduling.</li>
                <li>Courses: Create and manage courses.</li>
                <li>Sales Dropdowns: Configure dropdown options for sales processes.</li>
                <li>Recruitment Dropdowns: Set up options related to recruitment activities.</li>
                <li>Departments: Manage different departments within the organization.</li>
                <li>Positions: Define roles and positions within the institution.</li>
                <li>ILSA Accounts: Manage accounts related to ILSA.</li>
              </ul>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle1">
                Marketing Tab
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                The <strong>Marketing</strong> tab handles the management of leads collected by the marketing team.
              </Typography>
              <ul>
                <li>Leads: Marketing managers and members enter the data they have collected about potential students or clients.</li>
              </ul>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle1">
                Sales Tab
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                The <strong>Sales</strong> tab is where the sales process takes place. It includes different roles and steps:
              </Typography>
              <ul>
                <li>Sales Supervisor: Reviews assigned leads and delegates them to sales agents.</li>
                <li>Sales Agent: Manages each lead’s details and progress.</li>
              </ul>
              <Typography>
                The sales agent communicates with the customer to ensure payments are made for placement tests and level enrollments. After receiving payment, there is a pending transaction that needs to be verified by the Operation Manager.
              </Typography>
              <Typography>
                Once verified, sales agents assign the placement test to the customer.
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle1">
                Academic Tab
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                The <strong>Academic</strong> tab manages student placement and academic progress. Sales agents create placement tests by navigating to <strong>Academic → Placement Test → Add Placement Test</strong>.
              </Typography>
              <Typography>
                The system will not allow the sales process to continue until a level is assigned to the student based on the placement test results.
              </Typography>
              <Typography>
                Once the level is assigned, sales members proceed with payment collection for the level, following the same process as the placement test.
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
            Detailed Workflow
          </Typography>
          <Row>
            <Col>
              <Typography variant="subtitle1" gutterBottom>
                Marketing Process
              </Typography>
              <Typography paragraph>
                The marketing team enters collected leads and assigns them to sales supervisors.
              </Typography>
            </Col>
            <Col>
              <Typography variant="subtitle1" gutterBottom>
                Sales Process
              </Typography>
              <ul>
                <li>Sales Supervisor reviews assigned leads and delegates them to sales agents.</li>
                <li>Sales Agents request payment for placement tests and submit proof of payment.</li>
                <li>Payment is verified by the Operation Manager.</li>
                <li>Once verified, sales agents assign the placement test to the customer.</li>
              </ul>
            </Col>
            <Col>
              <Typography variant="subtitle1" gutterBottom>
                Academic Process
              </Typography>
              <Typography paragraph>
                After a level is assigned, sales agents follow the same payment and verification process for level enrollment.
              </Typography>
            </Col>
          </Row>

          <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
            Conclusion
          </Typography>
          <Typography paragraph>
            The <strong>Accepted Management System</strong> streamlines the process from marketing to sales and academic placement. It ensures that all steps, from room management to student enrollment, are tracked, monitored, and verified for smooth operation.
          </Typography>
        </Box>
      </Container>
    </AdminLayout>
  );
};

export default Help;
