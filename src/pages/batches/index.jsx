import { Card, Form, Button, Row, Col, Table, Dropdown } from "react-bootstrap";
import { useEffect, useState } from "react";
import { AdminLayout } from "@layout";
import axios from "axios";
import { Modal } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Select from "react-select";
import Link from "next/link";
import TimePicker from "react-time-picker";
import "react-time-picker/dist/TimePicker.css";
import "react-clock/dist/Clock.css";
import { Loader } from "@components/Loader";

const Batches = () => {
  const [batchResource, setBatchResource] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterName, setFilterName] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [showModal, setShowModal] = useState(false);
  const [newBatchName, setNewBatchName] = useState("");
  const [newBatchStatus, setNewBatchStatus] = useState("");
  const [newBatchSelectedClass, setNewBatchSelectedClass] = useState("");
  const [newBatchClass, setNewBatchClass] = useState("");
  const [newBatchHours, setNewBatchHours] = useState("");
  const [newBatchCost, setNewBatchCost] = useState("");
  const [newBatchLimitTrainees, setNewBatchLimitTrainees] = useState("");
  const [newBatchShouldStartAt, setNewBatchShouldStartAt] = useState("");
  const [newBatchShouldEndAt, setNewBatchShouldEndAt] = useState("");
  const [newBatchLab, setNewBatchLab] = useState("");
  const [newBatchDescription, setNewBatchDescription] = useState("");
  const [classList, setClassList] = useState([]);
  const [newBatchCode, setNewBatchCode] = useState("");
  const [showBatchDetailsModal, setShowBatchDetailsModal] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [creatingBatch, setCreatingBatch] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState("");
  const [selectedLevelName, setSelectedLevelName] = useState("");
  // Function to open the modal and set the selected batch details
  const openBatchDetailsModal = (batch) => {
    setSelectedBatch(batch);
    setShowBatchDetailsModal(true);
  };
  // Other state variables for your form inputs
  const initialLectureTimes = [
    { day: "Sunday", from: "", to: "" },
    { day: "Monday", from: "", to: "" },
    { day: "Tuesday", from: "", to: "" },
    { day: "Wednesday", from: "", to: "" },
    { day: "Thursday", from: "", to: "" },
  ];
  const [newBatchLecturesTimes, setNewBatchLecturesTimes] = useState([]);
  const [selectedWeekdays, setSelectedWeekdays] = useState([
    { day: "Sunday", isChecked: false },
    { day: "Monday", isChecked: false },
    { day: "Tuesday", isChecked: false },
    { day: "Wednesday", isChecked: false },
    { day: "Thursday", isChecked: false },
  ]);

  const [lectureTimes, setLectureTimes] = useState([
    { day: "Sunday", from: "", to: "" },
    { day: "Monday", from: "", to: "" },
    { day: "Tuesday", from: "", to: "" },
    { day: "Wednesday", from: "", to: "" },
    { day: "Thursday", from: "", to: "" },
  ]);
  const handleWeekdayChange = (day, isChecked) => {
    const updatedWeekdays = [...selectedWeekdays];
    const index = updatedWeekdays.findIndex((weekday) => weekday.day === day);
    updatedWeekdays[index].isChecked = isChecked;
    setSelectedWeekdays(updatedWeekdays);
  };

  // Function to handle lecture time change
  const handleLectureTimeChange = (day, field, value) => {
    const updatedTimes = [...lectureTimes];
    const index = updatedTimes.findIndex((time) => time.day === day);
    updatedTimes[index][field] = value;
    setLectureTimes(updatedTimes);
  };
  const fetchBatchData = async () => {
    try {
      const response = await axios.get("/api/batch");
      if (response.status === 200) {
        const batchData = response.data;
        setBatchResource(batchData);
        setFilteredData(batchData);
      }
    } catch (error) {
      console.error("Error fetching batch data:", error);
      setError("Failed to fetch batch data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const fetchClassData = async () => {
    try {
      const response = await axios.get("/api/class");
      if (response.status === 200) {
        const classData = response.data;
        setClassList(classData);
      }
    } catch (error) {
      console.error("Error fetching class data:", error);
      // Handle error
    }
  };

  useEffect(() => {
    fetchBatchData();
    fetchClassData(); // Fetch class data when the component mounts
  }, []);

  useEffect(() => {
    // Automatically apply filters when filter inputs change
    handleFilter();
  }, [filterName, filterStatus, sortBy, sortOrder, batchResource]);
  const calculateBatchCode = () => {
    if (selectedLevel && levels) {
      const classCount = batchResource.filter(
        (cls) => cls.level === selectedLevel
      ).length;
      setNewBatchCode(
        `${
          +levels.find((lvl) => lvl._id === selectedLevel).code + classCount + 1
        }`
      );
    }
  };
  useEffect(() => {
    calculateBatchCode();
  }, [selectedLevel]);

  const handleFilter = () => {
    let filteredBatches = [...batchResource];

    if (filterName) {
      filteredBatches = filteredBatches.filter((batch) =>
        batch.name.toLowerCase().includes(filterName.toLowerCase())
      );
    }

    if (filterStatus) {
      filteredBatches = filteredBatches.filter(
        (batch) => batch.status.toLowerCase() === filterStatus.toLowerCase()
      );
    }

    setFilteredData(filteredBatches);
  };

  const handleSort = (criteria) => {
    if (criteria === sortBy) {
      // Toggle the sorting order if the same criteria is clicked again
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      // Change the sorting criteria
      setSortBy(criteria);
      setSortOrder("asc"); // Reset order to ascending when changing criteria
    }
  };

  const sortedBatches = [...filteredData].sort((a, b) => {
    const aValue = a[sortBy];
    const bValue = b[sortBy];

    if (sortOrder === "asc") {
      if (aValue < bValue) return -1;
      if (aValue > bValue) return 1;
      return 0;
    } else {
      if (aValue < bValue) return 1;
      if (aValue > bValue) return -1;
      return 0;
    }
  });

  const openModal = () => setShowModal(true);
  const closeModal = () => {
    setShowModal(false);
    // Reset form input fields
    setNewBatchName(""); // Reset the new batch name input
    setNewBatchClass(""); // Reset the new batch class input
  };
  const handleSelectedLectureTimes = () => {
    const selectedTimes = selectedWeekdays
      .filter((day) => day.isChecked)
      .map((day) => {
        const time = lectureTimes.find((time) => time.day === day.day);
        return {
          day: day.day,
          from: time.from,
          to: time.to,
        };
      });

    setNewBatchLecturesTimes(selectedTimes);
  };
  useEffect(() => {
    handleSelectedLectureTimes();
  }, [selectedWeekdays, lectureTimes]);
  console.log("newBatchLecturesTimes", newBatchLecturesTimes);
  const handleAddBatch = async () => {
    try {
      setCreatingBatch(true);
      const response = await axios.post("/api/batch", {
        name: newBatchName,
        status: newBatchStatus,
        code: newBatchCode,
        class: newBatchClass,
        hours: newBatchHours,
        cost: newBatchCost,
        limitTrainees: newBatchLimitTrainees,
        shouldStartAt: newBatchShouldStartAt,
        shouldEndAt: newBatchShouldEndAt,
        room: newBatchLab,
        weeklyHours: newBatchLecturesTimes,
        description: newBatchDescription,
        level: selectedLevel,
        levelName: selectedLevelName,
        // Add other batch attributes here
      });
      closeModal();
      fetchBatchData();
      toast.success("Batch added successfully!"); // Success toast
    } catch (error) {
      console.log("Error adding batch:", error.message);
      setError("Failed to add the batch. Please try again.");
      toast.error(error.message); // Error toast
    } finally {
      setCreatingBatch(false); // Set creatingBatch state to false after the request is complete
    }
  };
  const clearFilters = () => {
    setFilterName("");
    setFilterStatus("");
    setSortBy("");
    setSortOrder("asc");
    setFilteredData(batchResource);
  };
  const handleGenerateName = () => {
    const generatedName = `${
      levels.find((lvl) => lvl?._id === selectedLevel)?.name
    } - ${
      roomOptions.find((room) => newBatchLab === room.value)?.label
    } - ${newBatchCode} - ${newBatchCost} - ${newBatchShouldStartAt} to ${newBatchShouldEndAt} Batch`;
    setNewBatchName(generatedName.toUpperCase());
  };
  console.log();
  useEffect(() => {
    if (newBatchCode) {
      // Generate the name based on the class (if selected)
      handleGenerateName();
    }
  }, [
    newBatchClass,
    newBatchCost,
    newBatchLab,
    newBatchHours,
    newBatchShouldStartAt,
    newBatchShouldEndAt,
    newBatchCode,
  ]);
  const getClassName = (instructorId) => {
    console.log(instructorId);
    const selectedInstructor = classList.find(
      (instructor) => instructor._id === instructorId
    );
    console.log(instructorId);
    return selectedInstructor ? selectedInstructor : "Unknown"; // You can provide a default value like 'Unknown'
  };
  const getStatus = () => {
    const currentDate = new Date();
    const startDate = new Date(newBatchShouldStartAt);
    const endDate = new Date(newBatchShouldEndAt);

    if (currentDate < startDate) {
      return "Not Started Yet";
    } else if (currentDate >= startDate && currentDate <= endDate) {
      return "Ongoing";
    } else {
      return "Ended";
    }
  };

  const handleGenerateStatus = () => {
    const generatedStatus = getStatus();
    setNewBatchStatus(generatedStatus);
  };

  useEffect(() => {
    if (newBatchShouldStartAt && newBatchShouldEndAt) {
      // Generate the status based on the start and end dates
      handleGenerateStatus();
    }
  }, [newBatchShouldStartAt, newBatchShouldEndAt]);
  const [roomOptions, setRoomOptions] = useState([]);
  const mapApiDataToOptions = (apiData) => {
    // Assuming your API response is an array of objects with a 'roomName' property
    return apiData.map((room) => ({
      value: room._id, // Use a unique identifier as the value
      label: room.name, // Room name as the label
    }));
  };

  // Inside your fetchRoomsData function
  const fetchRoomsData = async () => {
    try {
      const response = await axios.get("/api/room");
      if (response.status === 200) {
        const roomData = response.data;
        console.log(roomData);
        const options = mapApiDataToOptions(roomData);
        console.log(options);
        setRoomOptions(options);
      }
    } catch (error) {
      console.error("Error fetching class data:", error);
      // Handle error
    }
  };
  console.log(roomOptions);
  useEffect(() => {
    // Fetch room options from your API endpoint
    fetchRoomsData();
  }, []);
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

  // Function to handle level selection
  const handleLevelSelect = (e) => {
    setSelectedLevel(e.target.value);
    setSelectedLevelName(
      levels.find((level) => level._id === e.target.value).name
    );
  };
  const [deletingBatch, setDeletingBatch] = useState(false);
  const [batchToDelete, setBatchToDelete] = useState(null);

  const openDeleteConfirmationModal = (batch) => {
    setBatchToDelete(batch);
  };

  const closeDeleteConfirmationModal = () => {
    setBatchToDelete(null);
  };
  const handleBatchDelete = async () => {
    try {
      setDeletingBatch(true);

      // Make an API request to delete the batch
      const response = await axios.delete(`/api/batch?id=${batchToDelete._id}`);

      if (response.status === 200) {
        // Batch deleted successfully, update the UI
        const updatedBatches = batchResource.filter(
          (batch) => batch._id !== batchToDelete._id
        );
        setBatchResource(updatedBatches);
        toast.success("Batch deleted successfully!");
        closeDeleteConfirmationModal();
      } else {
        toast.error("Failed to delete the batch");
      }
    } catch (error) {
      console.error("Error deleting batch:", error);
      toast.error("Failed to delete the batch");
    } finally {
      setDeletingBatch(false);
    }
  };
  console.log(newBatchLecturesTimes);
  const [editingBatch, setEditingBatch] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const openEditModal = (batch) => {
    setEditingBatch(batch);
    setShowEditModal(true);
  };
  const closeEditModal = () => {
    setEditingBatch(null);
    setNewBatchLecturesTimes("")
    setShowEditModal(false);
  };
  const handleUpdateBatch = async (updatedBatchData) => {
    try {
      
      const response = await axios.put(`/api/batch?id=${editingBatch._id}`, updatedBatchData);
  
      if (response.status === 200) {
        // Batch updated successfully, update the UI with the updated data
        // You can also choose to close the edit modal at this point
        fetchBatchData(); // Fetch updated batch data
        toast.success("Batch updated successfully!");
        setNewBatchLecturesTimes("")
        closeEditModal(); // Close the edit modal
      } else {
        toast.error("Failed to update the batch");
      }
    } catch (error) {
      console.error("Error updating batch:", error);
      toast.error("Failed to update the batch");
    }
  };
  console.log(newBatchLecturesTimes)
  return (
    <AdminLayout>
      <ToastContainer />
      {batchToDelete && (
        <Modal show={true} onHide={closeDeleteConfirmationModal}>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Deletion</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Are you sure you want to delete the batch: {batchToDelete.name}?
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={closeDeleteConfirmationModal}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleBatchDelete}
              disabled={deletingBatch}
            >
              {deletingBatch ? "Deleting..." : "Delete Batch"}
            </Button>
          </Modal.Footer>
        </Modal>
      )}
      <Modal show={showEditModal} onHide={() => closeEditModal()}>
        <Modal.Header closeButton>
          <Modal.Title>Update {editingBatch?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col xs={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Batch Name</Form.Label>
                  <Form.Control
                    type="text"
                    required
                    value={editingBatch?.name}
                    readOnly
                    disabled
                  />
                </Form.Group>
              </Col>
              <Col xs={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Batch Code</Form.Label>
                  <Form.Control
                    type="text"
                    required
                    value={editingBatch?.code}
                    readOnly
                    disabled
                  />
                </Form.Group>
              </Col>
              <Col xs={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Status</Form.Label>
                  <Form.Control
                    type="text"
                    required
                    value={editingBatch?.status}
                    placeholder="Wait For Dates.."
                    disabled
                  />
                </Form.Group>
              </Col>

              <Col xs={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Weekdays</Form.Label>
                  {selectedWeekdays.map((weekday, index) => (
                    <div key={index}>
                      <Form.Check
                        type="checkbox"
                        label={weekday.day}
                        checked={weekday.isChecked}
                        onChange={(e) =>
                          handleWeekdayChange(weekday.day, e.target.checked)
                        }
                      />
                      {weekday.isChecked && (
                        <Row className="my-4">
                          <Col xs={6}>
                            <Form.Label>From:</Form.Label>
                            <Form.Control
                              type="time"
                              value={lectureTimes[index]?.from}
                              onChange={(e) =>
                                handleLectureTimeChange(
                                  weekday.day,
                                  "from",
                                  e.target.value
                                )
                              }
                            />
                          </Col>
                          <Col xs={6}>
                            <Form.Label>To:</Form.Label>
                            <Form.Control
                              type="time"
                              value={lectureTimes[index]?.to}
                              onChange={(e) =>
                                handleLectureTimeChange(
                                  weekday.day,
                                  "to",
                                  e.target.value
                                )
                              }
                            />
                          </Col>
                        </Row>
                      )}
                    </div>
                  ))}
                </Form.Group>
              </Col>

              {/* Add form fields for other batch attributes */}
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeEditModal}>
            Close
          </Button>
          <Button
            variant="success"
            onClick={() => {
              const updatedBatchData = {
                name: editingBatch.name, // Include any other fields that need to be updated
                // Add other fields here based on your form inputs
                weeklyHours: newBatchLecturesTimes, // Include the updated lecture times
              };
              handleUpdateBatch(updatedBatchData); // Call the function to update the batch
            }}
          >
            {"Update Batch"}
          </Button>
        </Modal.Footer>
      </Modal>

      <Card>
        <Card.Header>Batches</Card.Header>
        <Card.Body>
          <Form className="mb-3">
            <Row>
              <Col xs={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Filter by Name</Form.Label>
                  <Form.Control
                    type="text"
                    required
                    value={filterName}
                    onChange={(e) => setFilterName(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col xs={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Filter by Status</Form.Label>
                  <Form.Control
                    type="text"
                    required
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col xs={6}>
                <Button variant="secondary" onClick={clearFilters}>
                  Clear Filters
                </Button>
              </Col>
              <Col xs={6}>
                <Button
                  variant="success"
                  onClick={openModal}
                  title={
                    classList.length <= 0 &&
                    "Cannot Create Batches Without Classes!"
                  }
                  disabled={
                    creatingBatch || classList.length <= 0 || levels.length <= 0
                  }
                >
                  Add New Batch
                </Button>
                {classList.length <= 0 && (
                  <span className="text-danger ms-3 fw-bold">
                    Cannot Create Batches Without Courses!
                  </span>
                )}
              </Col>
            </Row>
          </Form>

          {loading ? (
            <p>Loading batches...</p>
          ) : error ? (
            <p>{error}</p>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>#</th>
                    <th onClick={() => handleSort("name")}>Name</th>
                    <th onClick={() => handleSort("status")}>Status</th>
                    <th onClick={() => handleSort("class")}>Class</th>
                    <th onClick={() => handleSort("hours")}>Hours</th>
                    <th onClick={() => handleSort("cost")}>Cost</th>
                    <th onClick={() => handleSort("limitTrainees")}>
                      Limit Trainees
                    </th>
                    <th onClick={() => handleSort("shouldStartAt")}>
                      Start Date
                    </th>
                    <th onClick={() => handleSort("shouldEndAt")}>End Date</th>
                    <th onClick={() => handleSort("lab")}>Lab</th>
                    <th onClick={() => handleSort("code")}>Code</th>
                    <th onClick={() => handleSort("description")}>
                      Description
                    </th>
                    <th onClick={() => handleSort("createdDate")}>
                      Created Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sortedBatches.map((batch, index) => (
                    <tr
                      key={batch._id}
                      onClick={() => openBatchDetailsModal(batch)}
                    >
                      <td>{index + 1}</td>
                      <td>{batch.name}</td>
                      <td>{batch.status}</td>
                      <td>
                        {batch.class ? getClassName(batch.class).name : "N/A"}
                      </td>
                      <td>{batch.hours}</td>
                      <td>{batch.cost} EGP</td>
                      <td>{batch.limitTrainees} Trainees</td>
                      <td>
                        {new Date(batch.shouldStartAt).toLocaleDateString()}
                      </td>
                      <td>
                        {new Date(batch.shouldEndAt).toLocaleDateString()}
                      </td>
                      <td>
                        {
                          roomOptions.find((room) => room.value === batch.room)
                            ?.label
                        }
                      </td>
                      <td>{batch.code}</td>
                      <td>{batch.description}</td>
                      <td>
                        {new Date(batch.createdDate).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
          {selectedBatch && (
            <Modal
              show={showBatchDetailsModal}
              onHide={() => setShowBatchDetailsModal(false)}
            >
              <Modal.Header closeButton>
                <Modal.Title>Batch Details</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <p>Name: {selectedBatch.name}</p>
                <p>Status: {selectedBatch.status}</p>
                <p>Code: {selectedBatch.code}</p>
                <p>Class: {selectedBatch.class}</p>
                <p>Hours: {selectedBatch.hours}</p>
                <p>Cost: {selectedBatch.cost} EGP</p>
                <p>Limit Trainees: {selectedBatch.limitTrainees} Trainees</p>
                <p>
                  Start Date:{" "}
                  {new Date(selectedBatch.shouldStartAt).toLocaleDateString()}
                </p>
                <p>
                  End Date:{" "}
                  {new Date(selectedBatch.shouldEndAt).toLocaleDateString()}
                </p>
                <p>
                  Room:{" "}
                  {
                    roomOptions.find(
                      (room) => room.value === selectedBatch.room
                    ).label
                  }
                </p>
                <p>Description: {selectedBatch.description}</p>

                <p>Lecture Times:</p>
                <ul>
                  {selectedBatch.weeklyHours.map((time, index) => (
                    <li key={index}>
                      {`${time.day}: From ${time.from} to ${time.to}`}
                    </li>
                  ))}
                </ul>
                <p>
                  Created Date:{" "}
                  {new Date(selectedBatch.createdDate).toLocaleDateString()}
                </p>
              </Modal.Body>
              <Modal.Footer>
                <Button
                  variant="secondary"
                  onClick={() => setShowBatchDetailsModal(false)}
                >
                  Close
                </Button>
                <Button variant="success">
                  <Link
                    href={`/batches/${selectedBatch._id}`}
                    className="text-decoration-none text-light"
                  >
                    View Lectures
                  </Link>
                </Button>
                <Button
                  variant="danger"
                  onClick={() => openDeleteConfirmationModal(selectedBatch)}
                >
                  Delete
                </Button>
                <Button
                  variant="primary"
                  onClick={() => openEditModal(selectedBatch)}
                >
                  Edit
                </Button>
              </Modal.Footer>
            </Modal>
          )}
        </Card.Body>
      </Card>
      <Modal show={showModal} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>Create New Batch</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col xs={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Batch Name</Form.Label>
                  <Form.Control
                    type="text"
                    required
                    value={newBatchName}
                    readOnly
                    disabled
                  />
                </Form.Group>
              </Col>
              <Col xs={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Batch Code</Form.Label>
                  <Form.Control
                    type="text"
                    required
                    value={newBatchCode}
                    readOnly
                    disabled
                  />
                </Form.Group>
              </Col>
              <Col xs={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Status</Form.Label>
                  <Form.Control
                    type="text"
                    required
                    value={newBatchStatus}
                    placeholder="Wait For Dates.."
                    disabled
                  />
                </Form.Group>
              </Col>
              <Col xs={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Class</Form.Label>

                  <Select
                    value={newBatchSelectedClass}
                    options={classList.map((student) => ({
                      value: student._id,
                      label: student.name,
                    }))}
                    onChange={(e) => {
                      setNewBatchClass(e?.value);
                      setNewBatchSelectedClass(e);
                      setNewBatchHours(getClassName(e?.value)?.hours);
                      setNewBatchCost(getClassName(e?.value)?.cost);
                    }}
                    isClearable={true}
                    isSearchable={true}
                    placeholder="Class"
                  />
                </Form.Group>
              </Col>
              <Col xs={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Hours</Form.Label>
                  <Form.Control
                    type="number"
                    required
                    value={newBatchHours}
                    onChange={(e) => setNewBatchHours(e.target.value)}
                  />
                </Form.Group>
              </Col>

              <Col xs={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Cost</Form.Label>
                  <Form.Control
                    type="number"
                    required
                    value={newBatchCost}
                    onChange={(e) => setNewBatchCost(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col xs={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Limit Trainees</Form.Label>
                  <Form.Control
                    type="number"
                    required
                    value={newBatchLimitTrainees}
                    onChange={(e) => setNewBatchLimitTrainees(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col xs={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Start Date</Form.Label>
                  <Form.Control
                    type="date"
                    required
                    value={newBatchShouldStartAt}
                    onChange={(e) => setNewBatchShouldStartAt(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col xs={6}>
                <Form.Group className="mb-3">
                  <Form.Label>End Date</Form.Label>
                  <Form.Control
                    type="date"
                    required
                    value={newBatchShouldEndAt}
                    onChange={(e) => setNewBatchShouldEndAt(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col xs={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Room</Form.Label>
                  <Select
                    options={roomOptions}
                    value={roomOptions.find(
                      (room) => room.value === newBatchLab
                    )}
                    onChange={(selectedOption) => {
                      setNewBatchLab(
                        selectedOption ? selectedOption.value : ""
                      );
                    }}
                  />
                </Form.Group>
              </Col>
              <Col xs={6}>
                <Form.Group>
                  <Form.Label>Set Level:</Form.Label>
                  <Form.Control as="select" onChange={handleLevelSelect}>
                    <option value="" required hidden>
                      Select a level
                    </option>
                    {levels.map((level) => (
                      <option key={level._id} value={level._id}>
                        {level.name}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col xs={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Weekdays</Form.Label>
                  {selectedWeekdays.map((weekday, index) => (
                    <div key={index}>
                      <Form.Check
                        type="checkbox"
                        label={weekday.day}
                        checked={weekday.isChecked}
                        onChange={(e) =>
                          handleWeekdayChange(weekday.day, e.target.checked)
                        }
                      />
                      {weekday.isChecked && (
                        <Row className="my-4">
                          <Col xs={6}>
                            <Form.Label>From:</Form.Label>
                            <Form.Control
                              type="time"
                              value={lectureTimes[index]?.from}
                              onChange={(e) =>
                                handleLectureTimeChange(
                                  weekday.day,
                                  "from",
                                  e.target.value
                                )
                              }
                            />
                          </Col>
                          <Col xs={6}>
                            <Form.Label>To:</Form.Label>
                            <Form.Control
                              type="time"
                              value={lectureTimes[index]?.to}
                              onChange={(e) =>
                                handleLectureTimeChange(
                                  weekday.day,
                                  "to",
                                  e.target.value
                                )
                              }
                            />
                          </Col>
                        </Row>
                      )}
                    </div>
                  ))}
                </Form.Group>
              </Col>

              <Col xs={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    type="textarea"
                    required
                    value={newBatchDescription}
                    onChange={(e) => setNewBatchDescription(e.target.value)}
                  />
                </Form.Group>
              </Col>
              {/* Add form fields for other batch attributes */}
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Close
          </Button>
          <Button
            variant="success"
            onClick={() => {
              handleSelectedLectureTimes();
              handleAddBatch();
            }}
          >
            {creatingBatch ? "Creating..." : "Add New Batch"}
          </Button>
        </Modal.Footer>
      </Modal>
    </AdminLayout>
  );
};

export default Batches;
