import { Card, Form, Button, Row, Col, Table, Dropdown } from "react-bootstrap";
import { useEffect, useState } from "react";
import { AdminLayout } from "@layout";
import axios from "axios";
import { Modal } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
  const [newBatchClass, setNewBatchClass] = useState("");
  const [newBatchHours, setNewBatchHours] = useState("");
  const [newBatchCost, setNewBatchCost] = useState("");
  const [newBatchLimitTrainees, setNewBatchLimitTrainees] = useState("");
  const [newBatchShouldStartAt, setNewBatchShouldStartAt] = useState("");
  const [newBatchShouldEndAt, setNewBatchShouldEndAt] = useState("");
  const [newBatchLab, setNewBatchLab] = useState("");
  const [newBatchLecturesTimes, setNewBatchLecturesTimes] = useState([]);
  const [newBatchDescription, setNewBatchDescription] = useState("");
  const [classList, setClassList] = useState([]);

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

  const handleAddBatch = async () => {
    try {
      await axios.post("/api/batch", {
        name: newBatchName,
        status: newBatchStatus,
        class: newBatchClass,
        hours: newBatchHours,
        cost: newBatchCost,
        limitTrainees: newBatchLimitTrainees,
        shouldStartAt: newBatchShouldStartAt,
        shouldEndAt: newBatchShouldEndAt,
        lab: newBatchLab,
        lecturesTimes: newBatchLecturesTimes,
        description: newBatchDescription,
        // Add other batch attributes here
      });
      closeModal();
      fetchBatchData();
      toast.success("Batch added successfully!"); // Success toast
    } catch (error) {
      console.log("Error adding batch:", error.message);
      setError("Failed to add the batch. Please try again.");
      toast.error(error.message); // Error toast
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
      newBatchClass ? getClassName(newBatchClass).name : "N/A"
    } - ${newBatchLab} - ${newBatchHours} - ${newBatchCost} - ${newBatchShouldStartAt} to ${newBatchShouldEndAt} Batch`;
    setNewBatchName(generatedName.toUpperCase());
  };
  useEffect(() => {
    if (newBatchClass) {
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
  return (
    <AdminLayout>
      <ToastContainer />
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
                    value={newBatchName}
                    readOnly
                    disabled
                  />
                </Form.Group>
              </Col>
              <Col xs={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Status</Form.Label>
                  <Form.Control type="text" value={newBatchStatus} placeholder="Wait For Dates.." disabled />
                </Form.Group>
              </Col>
              <Col xs={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Class</Form.Label>
                  <Form.Select
                    value={newBatchClass}
                    onChange={(e) => {
                      setNewBatchClass(e.target.value);
                      setNewBatchHours(getClassName(e.target.value).hours)
                      setNewBatchCost(getClassName(e.target.value).cost)
                    }}
                  >
                    <option value="">Select a Class</option>
                    {classList.map((item) => (
                      <option key={item._id} value={item._id}>
                        {item.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col xs={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Hours</Form.Label>
                  <Form.Control
                    type="number"
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
                    value={newBatchShouldEndAt}
                    onChange={(e) => setNewBatchShouldEndAt(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col xs={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Lab</Form.Label>
                  <Form.Control
                    type="text"
                    value={newBatchLab}
                    onChange={(e) => setNewBatchLab(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col xs={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Lectures Times (comma-separated)</Form.Label>
                  <Form.Control
                    type="text"
                    value={newBatchLecturesTimes.join(", ")} // Convert the array to a comma-separated string for display
                    onChange={(e) => {
                      const timesString = e.target.value;
                      const timesArray = timesString
                        .split(",")
                        .map((time) => time.trim());
                      setNewBatchLecturesTimes(timesArray);
                    }}
                  />
                </Form.Group>
              </Col>
              <Col xs={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    type="textarea"
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
          <Button variant="success" onClick={handleAddBatch}>
            Add Batch
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
                  disabled={classList.length > 0 ? false : true}
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
                  <th onClick={() => handleSort("lecturesTimes")}>
                    Lectures Times
                  </th>
                  <th onClick={() => handleSort("description")}>Description</th>
                  <th onClick={() => handleSort("createdDate")}>
                    Created Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedBatches.map((batch, index) => (
                  <tr key={batch._id}>
                    <td>{index + 1}</td>
                    <td>{batch.name}</td>
                    <td>{batch.status}</td>
                    <td>{batch.class ? getClassName(batch.class).name : "N/A"}</td>
                    <td>{batch.hours}</td>
                    <td>{batch.cost} EGP</td>
                    <td>{batch.limitTrainees} Trainees</td>
                    <td>{batch.shouldStartAt}</td>
                    <td>{batch.shouldEndAt}</td>
                    <td>{batch.lab}</td>
                    <td>{batch.lecturesTimes.join(", ")}</td>
                    <td>{batch.description}</td>
                    <td>{batch.createdDate}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>
    </AdminLayout>
  );
};

export default Batches;
