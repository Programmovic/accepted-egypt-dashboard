import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Box, Typography, Accordion, AccordionSummary, AccordionDetails, Tooltip, Card, CardContent, } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { AdminLayout } from "@layout";
import { motion } from 'framer-motion';

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeInOut' },
  },
};
const Help = () => {
  // State to track which process is currently visible
  const [visibleProcess, setVisibleProcess] = useState(0);

  // Function to handle showing the next process
  const handleNextProcess = () => {
    setVisibleProcess((prev) => Math.min(prev + 1, 2)); // Max 2 for three processes
  };
  return (
    <AdminLayout>
      <Container>
        <Box sx={{ py: 4 }}>
          <Typography fontFamily={"inherit"} variant="h4" gutterBottom align="center">
            Accepted Management System Documentation
          </Typography>

          <Typography fontFamily={"inherit"} variant="h6" gutterBottom>
            Overview
          </Typography>
          <Typography fontFamily={"inherit"} paragraph>
            The <strong>Accepted Management System</strong> is designed to manage the operations of an educational institution, including administrative setup, marketing, sales processes, and academic management. This system uses a sidebar navigation that allows access to various tabs for different functions.
          </Typography>

          <Typography fontFamily={"inherit"} variant="h6" gutterBottom>
            Sidebar Tabs and Their Functions
          </Typography>

          {/* Accordion for each section */}
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography fontFamily={"inherit"} variant="subtitle1">
                Administration Tab
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography fontFamily={"inherit"}>
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
                <li>ELSA Accounts: Manage accounts related to ELSA.</li>
              </ul>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography fontFamily={"inherit"} variant="subtitle1">
                Marketing Tab
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography fontFamily={"inherit"}>
                The <strong>Marketing</strong> tab handles the management of leads collected by the marketing team.
              </Typography>
              <ul>
                <li>Leads: Marketing managers and members enter the data they have collected about potential students or clients.</li>
              </ul>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography fontFamily={"inherit"} variant="subtitle1">
                Sales Tab
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography fontFamily={"inherit"}>
                The <strong>Sales</strong> tab is where the sales process takes place. It includes different roles and steps:
              </Typography>
              <ul>
                <li>Sales Supervisor: Reviews assigned leads and delegates them to sales agents.</li>
                <li>Sales Agent: Manages each lead’s details and progress.</li>
              </ul>
              <Typography fontFamily={"inherit"}>
                The sales agent communicates with the customer to ensure payments are made for placement tests and level enrollments. After receiving payment, there is a pending transaction that needs to be verified by the Operation Manager.
              </Typography>
              <Typography fontFamily={"inherit"}>
                Once verified, sales agents assign the placement test to the customer.
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography fontFamily={"inherit"} variant="subtitle1">
                Academic Tab
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography fontFamily={"inherit"}>
                The <strong>Academic</strong> tab manages student placement and academic progress. Sales agents create placement tests by navigating to <strong>Academic → Placement Test → Add Placement Test</strong>.
              </Typography>
              <Typography fontFamily={"inherit"}>
                The system will not allow the sales process to continue until a level is assigned to the student based on the placement test results.
              </Typography>
              <Typography fontFamily={"inherit"}>
                Once the level is assigned, sales members proceed with payment collection for the level, following the same process as the placement test.
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography fontFamily={"inherit"} variant="subtitle1">
                Inventory Tab
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography fontFamily={"inherit"}>
                The <strong>Inventory</strong> tab is used for managing physical assets of the institution. It includes:
              </Typography>
              <ul>
                <li>Scan: Scan items for inventory management.</li>
                <li>Laptops: Manage the inventory of laptops and their allocation.</li>
              </ul>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography fontFamily={"inherit"} variant="subtitle1">
                Finance Tab
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography fontFamily={"inherit"}>
                The <strong>Finance</strong> tab oversees financial transactions and student payments. It includes:
              </Typography>
              <ul>
                <li>Payment Methods: Configure available payment methods.</li>
                <li>Transactions: Review and manage transactions.</li>
                <li>Students With Due: List students with outstanding payments.</li>
              </ul>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography fontFamily={"inherit"} variant="subtitle1">
                Human Resources Tab
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography fontFamily={"inherit"}>
                The <strong>Human Resources</strong> tab is for managing employee information.
              </Typography>
              <ul>
                <li>Employees: Manage employee records and information.</li>
              </ul>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography fontFamily={"inherit"} variant="subtitle1">
                Help Tab
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography fontFamily={"inherit"}>
                The <strong>Help</strong> tab provides guidance on how to use the system effectively.
              </Typography>
              <ul>
                <li>How to Use?: A resource for understanding system functionalities.</li>
              </ul>
            </AccordionDetails>
          </Accordion>

          <Box sx={{ mt: 4 }}>
            <Typography fontFamily={"inherit"} variant="h4" gutterBottom>
              Detailed Workflow
            </Typography>
            <Row className="gy-4">
              {/* Marketing Process */}
              {visibleProcess >= 0 && (
                <Col>
                  <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={cardVariants}
                    onClick={handleNextProcess}
                    sx={{ cursor: 'pointer' }} // Change cursor to indicate clickability
                  >
                    <Card elevation={3} sx={{ borderRadius: 2, backgroundColor: '#f5f5f5' }}>
                      <CardContent>
                        <Typography fontFamily={"inherit"} variant="h6" gutterBottom>
                          Marketing Process
                        </Typography>
                        <Typography fontFamily={"inherit"} paragraph>
                          The marketing team enters collected leads and assigns them to sales supervisors.
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Click to next
                        </Typography>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Col>
              )}

              {/* Sales Process */}
              {visibleProcess >= 1 && (
                <Col>
                  <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={cardVariants}
                    onClick={handleNextProcess}
                    sx={{ cursor: 'pointer' }} // Change cursor to indicate clickability
                  >
                    <Card elevation={3} sx={{ borderRadius: 2, backgroundColor: '#f5f5f5' }}>
                      <CardContent>
                        <Typography fontFamily={"inherit"} variant="h6" gutterBottom>
                          Sales Process
                        </Typography>
                        <Typography fontFamily={"inherit"} component="div" paragraph>
                          <ul>
                            <li>Sales Supervisor reviews assigned leads and delegates them to sales agents.</li>
                            <li>Sales Agents request payment for placement tests and submit proof of payment.</li>
                            <li>Payment is verified by the Operation Manager.</li>
                            <li>Once verified, sales agents assign the placement test to the customer.</li>
                          </ul>
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Click to next
                        </Typography>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Col>
              )}

              {/* Academic Process */}
              {visibleProcess >= 2 && (
                <Col>
                  <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={cardVariants}
                    onClick={() => setVisibleProcess(0)} // You can change this action as needed
                    sx={{ cursor: 'pointer' }} // Change cursor to indicate clickability
                  >
                    <Card elevation={3} sx={{ borderRadius: 2, backgroundColor: '#f5f5f5' }}>
                      <CardContent>
                        <Typography fontFamily={"inherit"} variant="h6" gutterBottom>
                          Academic Process
                        </Typography>
                        <Typography fontFamily={"inherit"} paragraph>
                          After a level is assigned, sales agents follow the same payment and verification process for level enrollment.
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Click to finish
                        </Typography>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Col>
              )}
            </Row>
          </Box>

          <Typography fontFamily={"inherit"} variant="h6" gutterBottom sx={{ mt: 4 }}>
            Conclusion
          </Typography>
          <Typography fontFamily={"inherit"} paragraph>
            The <strong>Accepted Management System</strong> streamlines the process from marketing to sales and academic placement. It ensures that all steps, from room management to student enrollment, are tracked, monitored, and verified for smooth operation.
          </Typography>
        </Box>
      </Container>
    </AdminLayout>
  );
};

export default Help;
