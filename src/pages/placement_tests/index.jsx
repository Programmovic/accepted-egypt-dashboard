// PlacementTests.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Button, Table, Form, Modal, Accordion, Row, Col } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AdminLayout } from "@layout";
import { useRouter } from "next/router";
import Select from "react-select";
import PlacementTestsSummary from "../../components/PlacementTestsSummary";
import Cookies from "js-cookie";
import Calendar from "../../components/Calendar";

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
  const [newTestLimit, setNewTestLimit] = useState("");
  const [newTestComment, setNewTestComment] = useState("");
  const [newTestInstructions, setNewTestInstructions] = useState("");
  const [newTestRoom, setNewTestRoom] = useState("");
  const [newTestDate, setNewTestDate] = useState("");
  const [filterStudentName, setFilterStudentName] = useState("");
  const [filterLevel, setFilterLevel] = useState("");
  const [filterFromDate, setFilterFromDate] = useState("");
  const [filterToDate, setFilterToDate] = useState("");
  const [filterdPlacementTests, setFilteredPlacementTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [availableRooms, setAvailableRooms] = useState([]); // New state for rooms
  const [selectedRoom, setSelectedRoom] = useState(null);
  const fetchPlacementTestData = async () => {
    // Show loading toast
    const toastId = toast.loading("Loading placement test data...");

    try {
      const settingsResponse = await axios.get("/api/placement_test_settings");
      console.log("egirje", settingsResponse.data);
      const testsResponse = await axios.get("/api/placement_test");

      if (settingsResponse.status === 200 && testsResponse.status === 200) {
        setPlacementTestSettings(settingsResponse.data);
        setPlacementTests(testsResponse.data);
        setFilteredPlacementTests(testsResponse.data);

        // Update toast with success message
        toast.update(toastId, {
          render: "Placement test data loaded successfully!",
          type: "success",
          isLoading: false,
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error("Error fetching placement test data:", error);

      // Update toast with error message
      toast.update(toastId, {
        render: "Failed to fetch placement test data. Please try again later.",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const date = newTestDate; // Use your desired date
  const [newTestStartTime, setNewTestStartTime] = useState("");
  const [newTestEndTime, setNewTestEndTime] = useState("");

  // Define the URL of your API endpoint
  const apiUrl = "/api/reservation/available-rooms"; // Update the URL if needed
  console.log(date, new Date());
  const fetchRooms = async () => {
    // Show loading toast
    const toastId = toast.loading("Fetching room data...");

    try {
      // Fetch all rooms
      const params = {
        date,
        newTestStartTime,
        newTestEndTime,
      };
      const roomsResponse = await axios.get(apiUrl, { params });

      if (roomsResponse.status === 200) {
        const rooms = roomsResponse.data.map((room) => ({
          value: room._id, // Use a unique identifier for each room
          label: room.name, // Display room name as label
          capacity: room.capacity
        }));
        setAvailableRooms(rooms);

        // Update toast with success message
        toast.update(toastId, {
          render: "Room data fetched successfully!",
          type: "success",
          isLoading: false,
          autoClose: 3000,
        });
      } else {
        console.error("Error fetching rooms:", roomsResponse.statusText);

        // Update toast with error message
        toast.update(toastId, {
          render: "Failed to fetch room data. Please try again later.",
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error("Error fetching rooms and reservations:", error);

      // Update toast with error message
      toast.update(toastId, {
        render: "An error occurred while fetching room data. Please try again.",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
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
    const token = Cookies.get("client_token");

    if (!newTestCost || !selectedInstructor || !newTestDate) {
      toast.error("Please fill in all required fields.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    // Show loading toast
    const toastId = toast.loading("Adding placement test...");

    try {
      const response = await axios.post("/api/placement_test_settings", {
        cost: newTestCost,
        instructions: newTestInstructions,
        room: newTestRoom || null,
        date: newTestDate,
        startTime: newTestStartTime,
        endTime: newTestEndTime,
        limitTrainees: newTestLimit,
        instructor: selectedInstructor.value,
        token,
      });

      if (response.status === 201) {
        // Data added successfully
        fetchPlacementTestData();

        // Update toast with success message
        toast.update(toastId, {
          render: "Placement Test added successfully!",
          type: "success",
          isLoading: false,
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

        // Update toast with error message
        toast.update(toastId, {
          render: "Failed to add the placement test. Please try again.",
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error("Error adding placement test:", error);

      // Update toast with error message
      toast.update(toastId, {
        render: "An error occurred while adding the placement test. Please try again.",
        type: "error",
        isLoading: false,
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
          student: selectedPlacementTest?.student, // Assuming student ID is used
          studentName: selectedPlacementTest?.studentName,
          assignedLevel: selectedPlacementTest?.assignedLevel,
          placementTestID: selectedPlacementTest?._id,
          source: "EWFS",
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
          `/api/student/assign-level/${selectedPlacementTest?.student}`,
          {
            assignedLevel: selectedLevel,
            student: selectedPlacementTest?.student,
            status: "Assigned Level",
            placementTestID: selectedPlacementTest?._id,
            comment: newTestComment
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
    return `${amountReceived + " EGP"} (${(
      (+amountReceived / +getTotalAmountReceived()) *
      100
    ).toFixed(2)}%)`;
  };
  const getPlacementTestCountByStatus = (status) => {
    return filterdPlacementTests.filter((test) => test.status === status)
      .length;
  };
  useEffect(() => {
    // Automatically apply filters when filter inputs change
    applyFilters();
  }, [filterStudentName, filterLevel, filterFromDate, filterToDate]);
  console.log(newTestRoom);
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
      const instructorsResponse = await axios.get("/api/instructor/get_instructors");

      if (instructorsResponse.status === 200) {
        console.log(instructorsResponse.data)
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
  const [rooms, setRooms] = useState([]);
  // Fetch instructors from the /api/instructor endpoint
  const fetchAllRooms = async () => {
    try {
      const roomsResponse = await axios.get("/api/room");

      if (roomsResponse.status === 200) {
        setRooms(roomsResponse.data);
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
    fetchAllRooms();
  }, []);
  console.log(selectedPlacementTest?.assignedLevel !== "N/A");
  // Add this line with other state declarations
  const [showRoomReservationsModal, setShowRoomReservationsModal] =
    useState(false);
  const handleKeyPress = (target) => {
    console.log('Enter clicked!!!');
    if (target.charCode == 13) {
      alert('Enter clicked!!!');
    }
  }
  return (
    <AdminLayout>

      <PlacementTestsSummary
        filterdPlacementTests={filterdPlacementTests}
        levels={levels}
        getAmountReceivedForLevel={getAmountReceivedForLevel()}
      />
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
                <Card className="border-0">
                  <Table striped bordered hover>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Cost</th>
                        <th>Instructor</th>
                        <th>Instructions</th>
                        <th>Room</th>
                        <th>Limit Trainees</th>
                        <th>Student Count</th>
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
                          <td>
                            {setting?.instructor?.name}
                          </td>
                          <td>{setting.instructions || "No Instructions"}</td>
                          <td>
                            {setting?.room?.name}
                          </td>
                          <td>{setting.limitTrainees}</td>
                          <td>{setting.studentCount}</td>
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
                <Card className="border-0">
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
                        <th>Comment</th>
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
                          <td>{test.comment}</td>
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
        size="xl"
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
                isClearable
                isSearchable
                value={selectedInstructor}
                onChange={(selectedOption) =>
                  setSelectedInstructor(selectedOption)
                }
                options={instructors}
                placeholder="Select an Instructor"
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
            <Row className="my-4">
              <Col xs={6}>
                <Form.Label>From:</Form.Label>
                <Form.Control
                  type="time"
                  value={newTestStartTime}
                  onChange={(e) =>
                    setNewTestStartTime(e.target.value)
                  }
                />
              </Col>
              <Col xs={6}>
                <Form.Label>To:</Form.Label>
                <Form.Control
                  type="time"
                  value={newTestEndTime}
                  onChange={(e) =>
                    setNewTestEndTime(e.target.value)
                  }
                />
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>
                Available Rooms <span className="fw-bold">(Just if On-site)</span>
              </Form.Label>
              <Select
                value={selectedRoom}
                onChange={(selectedOption) => {
                  setNewTestRoom(selectedOption ? selectedOption.value : ''); // Clear the room when the selection is cleared
                  setSelectedRoom(selectedOption);
                  setNewTestLimit(selectedOption ? selectedOption.capacity : ''); // Automatically set the limit based on the room's capacity
                  console.log(selectedOption);
                }}
                options={availableRooms}
                isDisabled={!newTestDate && true}
                isClearable // Enables the option to clear the selection
                placeholder={
                  newTestDate
                    ? "Select Room"
                    : "You Must Select a Date To Check Availability"
                }
              />
              {selectedRoom && selectedRoom.value && (
                <>
                  <Button
                    variant="primary"
                    onClick={() => setShowRoomReservationsModal(true)}
                    className="mt-2"
                  >
                    View ({selectedRoom.label}) Reservations
                  </Button>
                </>
              )}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Limit:</Form.Label>
              <Form.Control
                type="number"
                value={newTestLimit}
                onChange={(e) => setNewTestLimit(e.target.value)}
                disabled={!!selectedRoom} // Disable manual entry if a room is selected
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
          <Button variant="success" onClick={handleAddPlacementTest} onKeyDown={() => { console.log("stuff is happening") }}>
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
              <p>Student ID: {selectedPlacementTest?.student}</p>
              <p>Student Name: {selectedPlacementTest?.studentName}</p>
              <p>
                Date:{" "}
                {new Date(selectedPlacementTest?.date).toLocaleDateString()}
              </p>

              {selectedPlacementTest &&
                !selectedPlacementTest?.assignedLevel && (
                  <>
                    <Form.Group className="mb-3">
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
                    <Form.Group className="mb-3">
                      <Form.Label>Comment:</Form.Label>
                      <Form.Control
                        type="text"
                        value={newTestComment}
                        onChange={(e) => setNewTestComment(e.target.value)}
                      />
                    </Form.Group>
                  </>
                )}

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
        <Modal.Header closeButton className="text-white">
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
      <Modal
        show={showRoomReservationsModal}
        onHide={() => setShowRoomReservationsModal(false)}
        centered
        size="xl" // Set the size as needed, "lg" stands for large
      >
        <Modal.Header closeButton>
          <Modal.Title>{selectedRoom?.label} Reservations</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Calendar id={selectedRoom?.value} />
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowRoomReservationsModal(false)}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </AdminLayout>
  );
};

export default PlacementTests;
