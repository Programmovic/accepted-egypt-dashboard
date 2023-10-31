// PlacementTests.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Button, Table, Form, Modal, Accordion } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AdminLayout } from "@layout";
import { useRouter } from "next/router"; // Import useRouter
import { ClassCard } from "@components/Classes";
import Select from "react-select";

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
  const [newTestCost, setNewTestCost] = useState("");
  const [newTestInstructions, setNewTestInstructions] = useState("");
  const [newTestRoom, setNewTestRoom] = useState("");
  const [newTestDate, setNewTestDate] = useState("");
  // Add state variables for the filter values
  const [filterStudentName, setFilterStudentName] = useState("");
  const [filterLevel, setFilterLevel] = useState("");
  const [filterFromDate, setFilterFromDate] = useState("");
  const [filterToDate, setFilterToDate] = useState("");
  const [filterdPlacementTests, setFilteredPlacementTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [availableRooms, setAvailableRooms] = useState([]); // New state for rooms
  const [selectedRoom, setSelectedRoom] = useState(null);
  const fetchPlacementTestData = async () => {
    try {
      const settingsResponse = await axios.get("/api/placement_test_settings");
      const testsResponse = await axios.get("/api/placement_test");

      if (settingsResponse.status === 200 && testsResponse.status === 200) {
        setPlacementTestSettings(settingsResponse.data);
        setPlacementTests(testsResponse.data);
        setFilteredPlacementTests(testsResponse.data);
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
    } finally {
      setLoading(false);
    }
  };
  const date = newTestDate; // Use your desired date
  const fromTime = "09:00 AM"; // Use your desired from time
  const toTime = "05:00 AM"; // Use your desired to time

  // Define the URL of your API endpoint
  const apiUrl = "/api/reservation/available-rooms"; // Update the URL if needed
  console.log(date, new Date());
  const fetchRooms = async () => {
    try {
      // Fetch all rooms
      const params = {
        date,
        fromTime,
        toTime,
      };
      const roomsResponse = await axios.get(apiUrl, { params });
      if (roomsResponse.status !== 200) {
        console.error("Error fetching rooms:", roomsResponse.statusText);
        toast.error("Failed to fetch room data. Please try again later.", {
          position: "top-right",
          autoClose: 3000,
        });
        return;
      }

      const rooms = roomsResponse.data.map((room) => ({
        value: room._id, // Use a unique identifier for each room
        label: room.name, // Display room name as label
      }));
      setAvailableRooms(rooms);
    } catch (error) {
      console.error("Error fetching rooms and reservations:", error);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, [newTestDate]);

  useEffect(() => {
    fetchPlacementTestData();
  }, []);

  console.log(selectedRoom);
  const handleAddPlacementTest = async () => {
    try {
      const response = await axios.post("/api/placement_test_settings", {
        cost: newTestCost,
        instructions: newTestInstructions,
        room: newTestRoom,
        date: newTestDate,
        instructor: selectedInstructor.value,
      });
      if (response.status === 201) {
        // Data added successfully
        fetchPlacementTestData();
        toast.success("Placement Test added successfully!", {
          position: "top-right",
          autoClose: 3000,
        });
        setShowModal(false);
        setNewTestCost("");
        setNewTestDate("");
        setNewTestInstructions("");
        setNewTestRoom("");
        setSelectedInstructor("");
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
      if (selectedPlacementTest) {
        // Make an API request to move the student to the waiting list
        const response = await axios.post("/api/waiting_list", {
          student: selectedPlacementTest.student, // Assuming student ID is used
          studentName: selectedPlacementTest.studentName,
          selectedLevel,
          placementTestID: selectedPlacementTest._id,
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
  console.log(selectedLevel);
  const handleAssignLevel = async () => {
    try {
      if (selectedPlacementTest && selectedLevel) {
        // Make an API request to update the assigned level
        const response = await axios.put(
          `/api/student/assign-level/${selectedPlacementTest.student}`,
          {
            assignedLevel: selectedLevel,
            student: selectedPlacementTest.student,
            status: "Assigned Level",
            placementTestID: selectedPlacementTest._id,
          }
        );

        if (response.status === 200) {
          // Assignment level updated successfully
          toast.success("Level Assigned", {
            position: "top-right",
            autoClose: 3000,
          });
          fetchPlacementTestData();

          // Close the details modal
          setShowPlacementTestDetailsModal(false);
        } else {
          // Handle other possible response status codes here
          console.error("Unexpected status code:", response.status);
        }
      }
    } catch (error) {
      console.error("Error assigning level:", error.message);
      toast.error("Failed to assign the level", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };
  const router = useRouter();
  const totalNoOfStudentsInThisTest = (testID) => {
    return (
      placementTests.filter((test) => test?.generalPlacementTest === testID)
        .length || 0
    );
  };
  const applyFilters = () => {
    const filteredTests = placementTests.filter((test) => {
      const isNameMatch =
        filterStudentName === "" ||
        test.studentName
          .toLowerCase()
          .includes(filterStudentName.toLowerCase());

      const isLevelMatch =
        filterLevel === "" || test.assignedLevel === filterLevel;

      const testDate = new Date(test.date);
      const startDate = filterFromDate ? new Date(filterFromDate) : null;
      const endDate = filterToDate ? new Date(filterToDate) : null;

      if (startDate && endDate) {
        // Both start and end dates provided
        return (
          isNameMatch &&
          isLevelMatch &&
          testDate >= startDate &&
          testDate <= endDate
        );
      } else if (startDate && endDate === null) {
        // Only start date provided, filter from start date to now
        return (
          isNameMatch &&
          isLevelMatch &&
          testDate >= startDate &&
          testDate <= new Date()
        );
      } else {
        // No date filter, apply other filters
        return isNameMatch && isLevelMatch;
      }
    });

    // Set the filtered data in your state
    setFilteredPlacementTests(filteredTests);
  };

  const getTotalStudentsCount = () => filterdPlacementTests.length;

  const getLevelCount = (level) => {
    return filterdPlacementTests.filter((test) => test.assignedLevel === level)
      .length;
  };

  const getWaitingListCount = () => {
    return filterdPlacementTests.filter(
      (test) => test.status === "Waiting List"
    ).length;
  };

  const getNACount = () => {
    return filterdPlacementTests.filter((test) => test.assignedLevel === "N/A")
      .length;
  };
  const getTotalAmountReceived = () => {
    const totalCost = filterdPlacementTests.reduce(
      (acc, setting) => filterdPlacementTests.length * setting.cost,
      0
    );
    return totalCost;
  };
  console.log(filterdPlacementTests[0]);
  const getAmountReceivedForLevel = (level) => {
    const amountReceived = filterdPlacementTests.reduce((acc, setting) => {
      const levelCount = filterdPlacementTests.filter(
        (test) => test.assignedLevel === level
      ).length;
      return levelCount * setting.cost;
    }, 0);
    return `${amountReceived + " EGP"} (${
      (+amountReceived / +getTotalAmountReceived()) * 100
    }%)`;
  };
  const getPlacementTestCountByStatus = (status) => {
    return filterdPlacementTests.filter((test) => test.status === status)
      .length;
  };
  const clearFilters = () => {
    // Clear the filter values and call fetchPlacementTestData without filters
    setFilterStudentName("");
    setFilterLevel("");
    setFilterFromDate("");
    setFilterToDate("");
    fetchPlacementTestData();
  };
  useEffect(() => {
    // Automatically apply filters when filter inputs change
    applyFilters();
  }, [filterStudentName, filterLevel, filterFromDate, filterToDate]);
  console.log(newTestRoom);
  const getClassName = (instructorId) => {
    console.log("instructorId");
    const selectedInstructor = availableRooms.find(
      (instructor) => instructor.value === instructorId
    );
    console.log(instructorId);
    return selectedInstructor ? selectedInstructor : "Unknown"; // You can provide a default value like 'Unknown'
  };
  const [levels, setLevels] = useState([]); // Store the selected level here

  useEffect(() => {
    // Fetch levels from the /api/level endpoint when the component mounts
    fetch("/api/level")
      .then((response) => response.json())
      .then((data) => {
        setLevels(data); // Set the levels in the state
      })
      .catch((error) => {
        console.error("Error fetching levels:", error);
      });
  }, []);
  const [instructors, setInstructors] = useState([]); // State variable to store instructors
  const [selectedInstructor, setSelectedInstructor] = useState(null); // State variable to store the selected instructor

  // Fetch instructors from the /api/instructor endpoint
  const fetchInstructors = async () => {
    try {
      const instructorsResponse = await axios.get("/api/instructor");

      if (instructorsResponse.status === 200) {
        const formattedInstructors = instructorsResponse.data.map(
          (instructor) => ({
            value: instructor._id, // Use a unique identifier for each instructor
            label: instructor.name, // Display instructor name as label
          })
        );
        setInstructors(formattedInstructors);
      }
    } catch (error) {
      console.error("Error fetching instructors:", error);
      toast.error("Failed to fetch instructor data. Please try again later.", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  useEffect(() => {
    fetchInstructors();
  }, []);
  console.log();
  return (
    <AdminLayout>
      <div className="row">
        <ClassCard
          data={getTotalStudentsCount()}
          title="Total Students"
          enableOptions={false}
          isLoading={loading}
        />
        {levels.map((level, i) => (
          <ClassCard
            data={getLevelCount(level.name)}
            title={`Level ${level.name}`}
            enableOptions={false}
            isLoading={loading}
          />
        ))}

        <ClassCard
          data={getNACount()}
          title="Level N/A"
          enableOptions={false}
          isLoading={loading}
        />
        {levels?.map((level, i) => (
          <ClassCard
            data={getAmountReceivedForLevel(level.name)}
            title={`Amount Received for Level ${level.name}`}
            enableOptions={false}
            isLoading={loading}
          />
        ))}
        <ClassCard
          data={`${getTotalAmountReceived()} EGP`}
          title="Total Amount Received"
          enableOptions={false}
          isLoading={loading}
        />
        <ClassCard
          data={getPlacementTestCountByStatus("Not Started Yet!")}
          title="Not Started Yet"
          enableOptions={false}
          isLoading={loading}
        />
        <ClassCard
          data={getPlacementTestCountByStatus("Assigned Level")}
          title="Assigned Level"
          enableOptions={false}
          isLoading={loading}
        />
        <ClassCard
          data={getPlacementTestCountByStatus(
            "Finished, Moved to Waiting List"
          )}
          title="Finished, Moved to Waiting List"
          enableOptions={false}
          isLoading={loading}
        />
      </div>
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
                        <th>Instructor</th>
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
                          <td>{instructors.find((instructor) => instructor.value === setting.instructor)?.label}</td>
                          <td>{setting.instructions || "No Instructions"}</td>
                          <td>{getClassName(setting.room).label}</td>
                          <td>{new Date(setting.date).toLocaleDateString()}</td>
                          <td>
                            {+totalNoOfStudentsInThisTest(setting._id) *
                              +setting.cost}{" "}
                            EGP
                          </td>
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
                  <Form className="mb-3 p-5">
                    <Form.Group className="mb-3">
                      <Form.Label>Filter by Student Name</Form.Label>
                      <Form.Control
                        type="text"
                        value={filterStudentName}
                        onChange={(e) => setFilterStudentName(e.target.value)}
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Filter by Level</Form.Label>
                      <Form.Control
                        as="select"
                        value={filterLevel}
                        onChange={(e) => setFilterLevel(e.target.value)}
                      >
                        <option value="All" hidden>
                          All
                        </option>
                        {placementTests.map((test, i) => (
                          <option value={test.assignedLevel} key={i}>
                            {test.assignedLevel}
                          </option>
                        ))}

                        {/* Add other level options */}
                      </Form.Control>
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Filter by Date (From)</Form.Label>
                      <Form.Control
                        type="date"
                        value={filterFromDate}
                        onChange={(e) => setFilterFromDate(e.target.value)}
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Filter by Date (To)</Form.Label>
                      <Form.Control
                        type="date"
                        value={filterToDate}
                        onChange={(e) => setFilterToDate(e.target.value)}
                      />
                    </Form.Group>
                  </Form>
                  <Table striped bordered hover>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Student Name</th>
                        <th>Status</th>
                        <th>Assigned Level</th>
                        <th>Phone Number</th>
                        <th>Cost</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filterdPlacementTests.map((test, index) => (
                        <tr
                          key={test._id}
                          onClick={() => {
                            if (
                              test.status !== "Finished, Moved to Waiting List"
                            ) {
                              openPlacementTestDetailsModal(test);
                            }
                          }}
                          style={{
                            cursor:
                              test.status !== "Finished, Moved to Waiting List"
                                ? "pointer"
                                : "not-allowed",
                            color:
                              test.status === "Finished, Moved to Waiting List"
                                ? "gray"
                                : "inherit",
                          }}
                        >
                          <td>{index + 1}</td>
                          <td>{test.studentName}</td>
                          <td>{test.status}</td>
                          <td>{test.assignedLevel}</td>
                          <td>{test.studentPhoneNumber}</td>
                          <td>{test.cost || 0} EGP</td>
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
      <Modal
        show={showModal}
        onHide={() => {
          setShowModal(false);
          setNewTestCost("");
          setNewTestDate("");
          setNewTestInstructions("");
          setNewTestRoom("");
          setSelectedInstructor("");
        }}
      >
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
              <Form.Label>Select an Instructor</Form.Label>
              <Select
                value={selectedInstructor}
                onChange={(selectedOption) =>
                  setSelectedInstructor(selectedOption)
                }
                options={instructors}
                isSearchable={true} // Enable search functionality
                placeholder="Select an Instructor"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Available Rooms</Form.Label>
              {/* Render the React-Select component for selecting a room */}
              <Select
                value={selectedRoom}
                onChange={(selectedOption) => {
                  setNewTestRoom(selectedOption.value);
                  setSelectedRoom(selectedOption);
                }}
                options={availableRooms}
                isDisabled={!newTestDate && true}
                placeholder={
                  newTestDate
                    ? "Select Room"
                    : "You Must Select a Date To Check Availability"
                }
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
          <Button
            variant="secondary"
            onClick={() => {
              setShowModal(false);
              setNewTestCost("");
              setNewTestDate("");
              setNewTestInstructions("");
              setNewTestRoom("");
              setSelectedInstructor("");
            }}
          >
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
                  {levels.map((level) => (
                    <option key={level._id} value={level.name}>
                      {level.name}
                    </option>
                  ))}
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
            onClick={handleAssignLevel}
            disabled={!selectedLevel}
          >
            Assign Level
          </Button>
          <Button
            variant="success"
            onClick={handleMoveToWaitingList}
            disabled={!selectedPlacementTest?.assignedLevel}
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
            <p>
              Number of Students:{" "}
              {totalNoOfStudentsInThisTest(selectedGeneralPlacementTest?._id)}
            </p>
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
