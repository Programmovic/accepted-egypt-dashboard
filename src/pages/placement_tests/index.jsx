// PlacementTests.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Button, Table, Form, Modal, Accordion } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AdminLayout } from "@layout";
import { useRouter } from "next/router"; // Import useRouter

const PlacementTests = () => {
  const [placementTestSettings, setPlacementTestSettings] = useState([]);
  const [placementTests, setPlacementTests] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedPlacementTest, setSelectedPlacementTest] = useState(null);
  const [selectedGeneralPlacementTest, setSelectedGeneralPlacementTest] =
    useState(null);
  const [showPlacementTestDetailsModal, setShowPlacementTestDetailsModal] =
    useState(false);
  const [
    showGeneralPlacementTestDetailsModal,
    setShowGeneralPlacementTestDetailsModal,
  ] = useState(false);
  const fetchPlacementTestData = async () => {
    try {
      const settingsResponse = await axios.get("/api/placement_test_settings");
      const testsResponse = await axios.get("/api/placement_test");

      if (settingsResponse.status === 200 && testsResponse.status === 200) {
        setPlacementTestSettings(settingsResponse.data);
        setPlacementTests(testsResponse.data);
      }
    } catch (error) {
      console.error("Error fetching placement test data:", error);
      toast.error(
        "Failed to fetch placement test data. Please try again later.",
        {
          position: "top-right",
          autoClose: 3000,
        }
      );
    }
  };

  useEffect(() => {
    fetchPlacementTestData();
  }, []);
  const [newTestCost, setNewTestCost] = useState("");
  const [newTestInstructions, setNewTestInstructions] = useState("");
  const [newTestRoom, setNewTestRoom] = useState("");
  const [newTestDate, setNewTestDate] = useState("");
  const handleAddPlacementTest = async () => {
    try {
      const response = await axios.post("/api/placement_test_settings", {
        cost: newTestCost,
        instructions: newTestInstructions,
        room: newTestRoom,
        date: newTestDate,
      });
      if (response.status === 201) {
        // Data added successfully
        fetchPlacementTestData();
        toast.success("Placement Test added successfully!", {
          position: "top-right",
          autoClose: 3000,
        });
        setShowModal(false);
        // Clear the form fields
        // ...
      } else {
        // Handle other possible response status codes here
        console.error("Unexpected status code:", response.status);
      }
    } catch (error) {
      console.error("Error adding placement test:", error);
      toast.error("Failed to add the placement test. Please try again.", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };
  const openPlacementTestDetailsModal = (placementTest) => {
    setSelectedPlacementTest(placementTest);
    setShowPlacementTestDetailsModal(true);
  };
  const openGeneralPlacementTestDetailsModal = (placementTest) => {
    setSelectedGeneralPlacementTest(placementTest);
    setShowGeneralPlacementTestDetailsModal(true);
  };
  const [selectedLevel, setSelectedLevel] = useState(""); // State to store selected level
  const [moveToWaitingList, setMoveToWaitingList] = useState(false); // State to track moving to waiting list

  // Function to handle level selection
  const handleLevelSelect = (e) => {
    setSelectedLevel(e.target.value);
  };

  const handleMoveToWaitingList = async () => {
    try {
      if (selectedPlacementTest && selectedLevel) {
        // Make an API request to move the student to the waiting list
        const response = await axios.post("/api/waiting_list", {
          student: selectedPlacementTest.student, // Assuming student ID is used
          studentName: selectedPlacementTest.studentName,
          selectedLevel,
          placementTestID: selectedPlacementTest._id
        });

        if (response.status === 201) {
          // Student moved to waiting list successfully
          toast.success("Student moved to Waiting List", {
            position: "top-right",
            autoClose: 3000,
          });
          setMoveToWaitingList(true); // Set the state to display the success message
          // You can also close the modal or update the student's status in the local state

          // You may want to refetch placement test data to reflect the updated status
          fetchPlacementTestData();
        } else {
          // Handle other possible response status codes here
          console.error("Unexpected status code:", response.status);
        }
      }
    } catch (error) {
      console.error("Error moving student to the waiting list:", error);
      toast.error("Failed to move the student to the Waiting List", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };
  const router = useRouter(); 
  const totalNoOfStudentsInThisTest = (testID) => {
    return placementTests.filter(
      (test) => test?.generalPlacementTest === testID
    ).length || "N/A";
  };

  return (
    <AdminLayout>
      <Card>
        <Card.Header>Placement Tests</Card.Header>
        <Card.Body>
          <Button
            variant="success"
            onClick={() => setShowModal(true)}
            className="mb-3"
          >
            Add Placement Test
          </Button>
          <Accordion defaultActiveKey="0">
            {/* First Collapsible Table: Placement Test Settings */}
            <Accordion.Item eventKey="0">
              <Accordion.Header as={Card.Header}>
                Availabe Placement Tests
              </Accordion.Header>
              <Accordion.Body>
                <Card>
                  <Table striped bordered hover>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Cost</th>
                        <th>Instructions</th>
                        <th>Room</th>
                        <th>Date</th>
                        <th>Total Receivable</th>
                      </tr>
                    </thead>
                    <tbody>
                      {placementTestSettings.map((setting, index) => (
                        <tr
                          key={setting._id}
                          onClick={() =>
                            openGeneralPlacementTestDetailsModal(setting)
                          }
                          style={{ cursor: "pointer" }}
                        >
                          <td>{index + 1}</td>
                          <td>{setting.cost}</td>
                          <td>{setting.instructions || "No Instructions"}</td>
                          <td>{setting.room}</td>
                          <td>{new Date(setting.date).toLocaleDateString()}</td>
                          <td>{totalNoOfStudentsInThisTest(setting._id) * setting.cost} EGP</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Card>
              </Accordion.Body>
            </Accordion.Item>

            {/* Second Collapsible Table: Placement Tests */}
            <Accordion.Item eventKey="1">
              <Accordion.Header as={Card.Header}>
                Current Placement Tests
              </Accordion.Header>
              <Accordion.Body>
                <Card>
                  <Table striped bordered hover>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Student Name</th>
                        <th>Status</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {placementTests.map((test, index) => (
                        <tr
                          key={test._id}
                          onClick={() => openPlacementTestDetailsModal(test)}
                          style={{ cursor: "pointer" }}
                        >
                          <td>{index + 1}</td>
                          <td>{test.studentName}</td>
                          <td>{test.status}</td>
                          <td>{new Date(test.date).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Card>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </Card.Body>
      </Card>
      <ToastContainer position="top-right" autoClose={3000} />
      {/* Modal for adding a new placement test */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Create New Placement Test</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Cost</Form.Label>
              <Form.Control
                type="text"
                value={newTestCost}
                onChange={(e) => setNewTestCost(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Instructions</Form.Label>
              <Form.Control
                type="text"
                value={newTestInstructions}
                onChange={(e) => setNewTestInstructions(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Room</Form.Label>
              <Form.Control
                type="text"
                value={newTestRoom}
                onChange={(e) => setNewTestRoom(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                value={newTestDate}
                onChange={(e) => setNewTestDate(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="success" onClick={handleAddPlacementTest}>
            Add Placement Test
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal
        show={showPlacementTestDetailsModal}
        onHide={() => setShowPlacementTestDetailsModal(false)}
      >
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title className="mb-0">Placement Test Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedPlacementTest && (
            <div>
              <p>Student ID: {selectedPlacementTest.student}</p>
              <p>Student Name: {selectedPlacementTest.studentName}</p>
              <p>
                Date:{" "}
                {new Date(selectedPlacementTest.date).toLocaleDateString()}
              </p>
              <Form.Group>
                <Form.Label>Set Level:</Form.Label>
                <Form.Control as="select" onChange={handleLevelSelect}>
                  <option value="" hidden>
                    Select a level
                  </option>
                  <option value="A1">A1</option>
                  <option value="A2">A1</option>
                  <option value="B1">B1</option>
                  <option value="B2">B1</option>
                  <option value="C1">C1</option>
                  <option value="C2">C1</option>
                </Form.Control>
              </Form.Group>

              {moveToWaitingList && (
                <p className="text-success mt-2">
                  Student moved to Waiting List
                </p>
              )}
              {/* Add other placement test details here */}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            className="text-white"
            onClick={() => setShowPlacementTestDetailsModal(false)}
          >
            Close
          </Button>
          <Button
            variant="success"
            onClick={handleMoveToWaitingList}
            disabled={!selectedLevel}
          >
            Move to Waiting List
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal
        show={showGeneralPlacementTestDetailsModal}
        onHide={() => setShowGeneralPlacementTestDetailsModal(false)}
      >
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title className="mb-0">Placement Test Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <p>Number of Students: {totalNoOfStudentsInThisTest(selectedGeneralPlacementTest?._id)}</p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            className="text-white"
            onClick={() => setShowGeneralPlacementTestDetailsModal(false)}
          >
            Close
          </Button>
          <Button
            variant="success"
            onClick={() => {
              router.push(
                `/placement_tests/${selectedGeneralPlacementTest._id}`
              );
            }}
          >
            See All Details
          </Button>
        </Modal.Footer>
      </Modal>
    </AdminLayout>
  );
};

export default PlacementTests;
