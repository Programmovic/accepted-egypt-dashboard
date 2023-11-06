// WaitingList.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Button, Table, Modal, Form, Row, Col } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AdminLayout } from "@layout";
import { useRouter } from "next/router"; // Import useRouter
import Select from "react-select";
import { ClassCard } from "@components/Classes";
import WaitingListSummary from "../../components/WaitingListSummary";

const WaitingList = () => {
  const [waitingListItems, setWaitingListItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedWaitingListItem, setSelectedWaitingListItem] = useState(null);
  const [filterStudentName, setFilterStudentName] = useState("");
  const [filterLevel, setFilterLevel] = useState("");
  const [filterFromDate, setFilterFromDate] = useState("");
  const [filterToDate, setFilterToDate] = useState("");
  const [filterdWitingLists, setFilterdWitingLists] = useState([]);
  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState("");
  const [paidAmount, setPaidAmount] = useState("");
  const [student, setStudent] = useState({});
  const [students, setStudents] = useState([]);

  async function fetchBatches() {
    try {
      const response = await axios.get("/api/batch");
      console.log(response);
      if (response.status === 200) {
        setBatches(response.data);
      }
    } catch (error) {
      console.error("Error fetching batches:", error);
      toast.error(error.message, {
        position: "top-right",
        autoClose: 3000,
      });
    }
  }
  async function fetchStudentData() {
    try {
      const response = await axios.get(
        `/api/student/${selectedWaitingListItem?.student}`
      );
      console.log(response);
      if (response.status === 200) {
        setStudent(response.data);
      }
    } catch (error) {
      console.error("Error fetching batches:", error);
      toast.error("Failed to fetch batches. Please try again later.", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  }

  const fetchWaitingListData = async () => {
    try {
      const response = await axios.get("/api/waiting_list");
      if (response.status === 200) {
        setWaitingListItems(response.data.waiting_list);
        setFilterdWitingLists(response.data.waiting_list);
      }
    } catch (error) {
      console.error("Error fetching waiting list data:", error);
      toast.error(
        "Failed to fetch waiting list data. Please try again later.",
        {
          position: "top-right",
          autoClose: 3000,
        }
      );
    }
  };
  const fetchStudentsData = async () => {
    try {
      const response = await axios.get("/api/student");
      if (response.status === 200) {
        console.log(response);
        setStudents(response.data.students);
      }
    } catch (error) {
      console.error("Error fetching waiting list data:", error);
      toast.error(
        "Failed to fetch waiting list data. Please try again later.",
        {
          position: "top-right",
          autoClose: 3000,
        }
      );
    }
  };
  useEffect(() => {
    fetchWaitingListData();
    fetchBatches();
    fetchStudentsData();
  }, []);
  console.log(students);
  useEffect(() => {
    {
      selectedWaitingListItem?.student && fetchStudentData();
    }
  }, [selectedWaitingListItem]);
  console.log(student);
  const assignToBatch = async () => {
    try {
      if (selectedWaitingListItem && selectedBatch) {
        // Make an API request to assign the student to the selected batch
        const response = await axios.put(
          `/api/student/assign-batch/${selectedWaitingListItem.student}`,
          {
            batch: selectedBatch.value,
            paidAmount: paidAmount,
          }
        );
        console.log("selectedBatch.value");
        if (response.status === 200) {
          // Student assigned to batch successfully
          toast.success("Student assigned to batch", {
            position: "top-right",
            autoClose: 3000,
          });

          // Close the modal
          setShowModal(false);
        } else {
          console.error("Unexpected status code:", response.status);
        }
      }
    } catch (error) {
      console.error("Error assigning student to batch:", error.message);
      toast.error("Failed to assign the student to the batch", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const router = useRouter();

  const openWaitingListDetailsModal = (waitingListItem) => {
    setSelectedWaitingListItem(waitingListItem);
    setShowModal(true);
  };
  const applyFilters = () => {
    const filteredTests = waitingListItems.filter((test) => {
      // Add filter conditions based on filterStudentName, filterLevel, filterFromDate, and filterToDate
      // Example: Filter by student name
      const isNameMatch =
        filterStudentName === "" ||
        test.studentName
          .toLowerCase()
          .includes(filterStudentName.toLowerCase());

      // Example: Filter by level
      const isLevelMatch =
        filterLevel === "" || test.assignedLevel === filterLevel;

      // Example: Filter by date
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

    setFilterdWitingLists(filteredTests);
  };

  const clearFilters = () => {
    // Clear the filter values and call fetchPlacementTestData without filters
    setFilterStudentName("");
    setFilterLevel("");
    setFilterFromDate("");
    setFilterToDate("");
    fetchWaitingListData();
  };

  useEffect(() => {
    // Automatically apply filters when filter inputs change
    applyFilters();
  }, [filterStudentName, filterLevel, filterFromDate, filterToDate]);
  console.log(selectedBatch);
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
  console.log(selectedBatch);
  return (
    <AdminLayout>
      <Row>
        <ClassCard
          data={`${waitingListItems.length}`}
          title="Total Students"
          enableOptions={false}
        />
        <ClassCard
          data={`${
            students &&
            students.filter((student) => student.batch && student.batch !== "")
              .length
          }`}
          title="Students Converted from EWFS to Batches"
          enableOptions={false}
        />
      </Row>
      <WaitingListSummary
        levels={levels}
        filterdWaitingList={filterdWitingLists}
        students={students}
      />
      <Card>
        <Card.Header>Waiting List</Card.Header>

        <Card.Body>
          <Form className="mb-3">
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
                <option value="" hidden>
                  All
                </option>
                <option value="A1">A1</option>
                <option value="A2">A2</option>
                <option value="A2/B1">A2/B1</option>
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
            <Button variant="secondary" onClick={clearFilters}>
              Clear Filters
            </Button>
          </Form>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>#</th>
                <th>Student ID</th>
                <th>Student Name</th>
                <th>Assigned Level</th>
                <th>Came From</th>
                <th>Date</th>
                {/* Add more table headers as needed */}
              </tr>
            </thead>
            <tbody>
              {filterdWitingLists.map((waitingListItem, index) => (
                <tr
                  key={waitingListItem._id}
                  onClick={() => openWaitingListDetailsModal(waitingListItem)}
                  style={{ cursor: "pointer" }}
                >
                  <td>{index + 1}</td>
                  <td>{waitingListItem.student}</td>
                  <td>{waitingListItem.studentName}</td>
                  <td>{waitingListItem.assignedLevel}</td>
                  <td>{waitingListItem.source}</td>
                  <td>{new Date(waitingListItem.date).toLocaleDateString()}</td>

                  {/* Add more table cells for other waiting list item data */}
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
      <ToastContainer position="top-right" autoClose={3000} />
      {/* Modal for waiting list details */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Waiting List Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedWaitingListItem && (
            <div>
              <p>Student ID: {selectedWaitingListItem.student}</p>
              <p>Student Name: {selectedWaitingListItem.studentName}</p>
              <p>
                Date:{" "}
                {new Date(selectedWaitingListItem.date).toLocaleDateString()}
              </p>
              <Row>
                <Col xs={12}>
                  <Form.Group>
                    <Form.Label>Select Batch:</Form.Label>
                    <Select
                      value={selectedBatch}
                      options={batches.map((instructor) => ({
                        value: instructor._id, // Use the instructor's name as the value
                        label: instructor.name, // Use the instructor's name as the label
                      }))}
                      onChange={(selectedOption) =>
                        setSelectedBatch(selectedOption)
                      }
                      isClearable={true}
                      isSearchable={true}
                      placeholder="Select Batch"
                      isDisabled={student.batch && true}
                    />
                    {selectedBatch && selectedBatch.value && (
                      <Form.Text className="text-muted">
                        {new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: "EGP",
                        }).format(
                          batches.find(
                            (batch) => batch._id === selectedBatch?.value
                          )?.cost
                        )}
                      </Form.Text>
                    )}
                  </Form.Group>
                </Col>
                <Col xs={12} className="mt-4">
                  <Form.Group>
                    <Form.Label>Paid Amount:</Form.Label>
                    <Form.Control
                      type="number"
                      placeholder="Enter the paid amount"
                      value={paidAmount}
                      onChange={(e) => {
                        // Parse the input value to a number
                        const inputValue = parseFloat(e.target.value);

                        // Get the selected batch's price
                        const batchPrice = selectedBatch.value
                          ? batches.find(
                              (batch) => batch._id === selectedBatch.value
                            ).cost
                          : 0; // Default to 0 if no batch is selected

                        // Update the paid amount, setting it to the batch price if it's higher
                        setPaidAmount(
                          inputValue > batchPrice ? batchPrice : inputValue
                        );
                      }}
                    />
                  </Form.Group>
                </Col>
              </Row>

              {/* Add other waiting list item details here */}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="success" onClick={assignToBatch}>
            Assign to Batch
          </Button>
        </Modal.Footer>
      </Modal>
    </AdminLayout>
  );
};

export default WaitingList;
