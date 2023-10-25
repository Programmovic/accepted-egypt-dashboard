import { Card, Form, Button, Row, Col, Table, Modal } from "react-bootstrap";
import { useEffect, useState } from "react";
import { AdminLayout } from "@layout";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Lectures = () => {
  const [lectureResource, setLectureResource] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterTitle, setFilterTitle] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [showModal, setShowModal] = useState(false);
  const [newLectureName, setNewLectureName] = useState("");
  const [newLectureStatus, setNewLectureStatus] = useState("");
  const [newLectureBatch, setNewLectureBatch] = useState("");
  const [newLectureHours, setNewLectureHours] = useState("");
  const [newLectureCost, setNewLectureCost] = useState("");
  const [newLectureLimitTrainees, setNewLectureLimitTrainees] = useState(0);
  const [newLectureLab, setNewLectureLab] = useState("");
  const [newLectureSchedule, setNewLectureSchedule] = useState([]);
  const [newLectureDescription, setNewLectureDescription] = useState("");
  const [instructorList, setInstructorList] = useState([]);
  const [batchList, setBatchList] = useState([]);

  const fetchInstructorData = async () => {
    try {
      const response = await axios.get("/api/instructor");
      if (response.status === 200) {
        const instructorData = response.data;
        setInstructorList(instructorData);
      }
    } catch (error) {
      console.error("Error fetching instructor data:", error);
      // Handle error
    }
  };
  const fetchBatchData = async () => {
    try {
      const response = await axios.get("/api/batch");
      if (response.status === 200) {
        const batchData = response.data;
        setBatchList(batchData);
      }
    } catch (error) {
      console.error("Error fetching batch data:", error);
      // Handle error
    }
  };

  const fetchLectureData = async () => {
    try {
      const response = await axios.get("/api/lecture");
      if (response.status === 200) {
        const lectureData = response.data;
        setLectureResource(lectureData);
        setFilteredData(lectureData);
      }
    } catch (error) {
      console.error("Error fetching lecture data:", error);
      setError("Failed to fetch lecture data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLectureData();
    fetchInstructorData();
    fetchBatchData();
  }, []);

  useEffect(() => {
    handleFilter();
  }, [filterTitle, sortBy, sortOrder, lectureResource]);

  const handleFilter = () => {
    let filteredLectures = [...lectureResource];

    if (filterTitle) {
      filteredLectures = filteredLectures.filter((lecture) =>
        lecture.name.toLowerCase().includes(filterTitle.toLowerCase())
      );
    }

    setFilteredData(filteredLectures);
  };

  const handleSort = (criteria) => {
    if (criteria === sortBy) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(criteria);
      setSortOrder("asc");
    }
  };

  const sortedLectures = [...filteredData].sort((a, b) => {
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
    setNewLectureName("");
    setNewLectureStatus("");
    setNewLectureBatch("");
    setNewLectureHours("");
    setNewLectureCost("");
    setNewLectureLimitTrainees(0);
    setNewLectureLab("");
    setNewLectureSchedule([]);
    setNewLectureDescription("");
  };

  const handleAddLecture = async () => {
    try {
      await axios.post("/api/lecture", {
        name: newLectureName,
        status: newLectureStatus,
        batch: newLectureBatch,
        hours: newLectureHours,
        cost: newLectureCost,
        limitTrainees: newLectureLimitTrainees,
        lab: newLectureLab,
        lectureSchedule: newLectureSchedule,
        description: newLectureDescription,
      });
      closeModal();
      fetchLectureData();
      toast.success("Lecture added successfully!");
    } catch (error) {
      console.log("Error adding lecture:", error.message);
      setError("Failed to add the lecture. Please try again.");
      toast.error(error.message);
    }
  };

  const clearFilters = () => {
    setFilterTitle("");
    setSortBy("");
    setSortOrder("asc");
    setFilteredData(lectureResource);
  };

  const getBatchName = (batchId) => {
    const selectedBatch = batchList.find((batch) => batch._id === batchId);
    return selectedBatch ? selectedBatch : "Unknown"; // You can provide a default value like 'Unknown'
  };

  const handleGenerateLectureName = () => {
    const generatedName = `${
      newLectureBatch ? getBatchName(newLectureBatch).name : "N/A"
    } - Lecture`;
    setNewLectureName(generatedName.toUpperCase());
  };

  useEffect(() => {
    // Generate the name for the lecture when any relevant attribute changes
    handleGenerateLectureName();
  }, [newLectureBatch]);

  const handleScheduleChange = (value, key) => {
    setNewLectureSchedule((prevSchedule) => ({
      ...prevSchedule,
      [key]: value,
    }));
  };
  console.log(filteredData)
  return (
    <AdminLayout>
      <ToastContainer />
      <Modal show={showModal} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>Create New Lecture</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col xs={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Lecture Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={newLectureName}
                    disabled
                    readOnly
                  />
                </Form.Group>
              </Col>
              <Col xs={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Lecture Status</Form.Label>
                  <Form.Control
                    type="text"
                    value={newLectureStatus}
                    onChange={(e) => setNewLectureStatus(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col xs={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Select a Batch</Form.Label>
                  <Form.Select
                    value={newLectureBatch}
                    onChange={(e) => {
                      setNewLectureBatch(e.target.value);
                      setNewLectureHours(getBatchName(e.target.value).hours)
                      setNewLectureCost(getBatchName(e.target.value).cost)
                      setNewLectureLimitTrainees(getBatchName(e.target.value).limitTrainees)
                      setNewLectureStatus(getBatchName(e.target.value).status)
                      setNewLectureLab(getBatchName(e.target.value).lab)
                    }}
                  >
                    <option value="" hidden>Select a Batch</option>
                    {batchList.map((batch) => (
                      <option key={batch._id} value={batch._id}>
                        {batch.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col xs={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Lecture Hours</Form.Label>
                  <Form.Control
                    type="number"
                    value={newLectureHours}
                  />
                </Form.Group>
              </Col>
              <Col xs={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Lecture Cost</Form.Label>
                  <Form.Control
                    type="number"
                    value={newLectureCost}
                    onChange={(e) => setNewLectureCost(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col xs={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Lecture Limit Trainees</Form.Label>
                  <Form.Control
                    type="number"
                    value={newLectureLimitTrainees}
                    onChange={(e) => setNewLectureLimitTrainees(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col xs={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Lecture Schedule (Days and Times)</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Day (e.g., Monday)"
                    value={newLectureSchedule.day}
                    onChange={(e) =>
                      handleScheduleChange(e.target.value, "day")
                    }
                    className="my-2"
                  />
                  <Form.Control
                    type="text"
                    placeholder="Time (e.g., 09:00 AM)"
                    value={newLectureSchedule.time}
                    onChange={(e) =>
                      handleScheduleChange(e.target.value, "time")
                    }
                  />
                </Form.Group>
              </Col>
              <Col xs={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Lecture Lab</Form.Label>
                  <Form.Control
                    type="text"
                    value={newLectureLab}
                    onChange={(e) => setNewLectureLab(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col xs={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Lecture Description</Form.Label>
                  <Form.Control
                    type="text"
                    value={newLectureDescription}
                    onChange={(e) => setNewLectureDescription(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Close
          </Button>
          <Button variant="success" onClick={handleAddLecture}>
            Add Lecture
          </Button>
        </Modal.Footer>
      </Modal>

      <Card>
        <Card.Header>Lectures</Card.Header>
        <Card.Body>
          <Form className="mb-3">
            <Row>
              <Col xs={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Filter by Title</Form.Label>
                  <Form.Control
                    type="text"
                    value={filterTitle}
                    onChange={(e) => setFilterTitle(e.target.value)}
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
                <Button variant="success" onClick={openModal}>
                  Add New Lecture
                </Button>
              </Col>
            </Row>
          </Form>

          {loading ? (
            <p>Loading lectures...</p>
          ) : error ? (
            <p>{error}</p>
          ) : (
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>#</th>
                  <th onClick={() => handleSort("name")}>Name</th>
                  <th onClick={() => handleSort("status")}>Status</th>
                  <th onClick={() => handleSort("batch")}>Batch</th>
                  <th onClick={() => handleSort("hours")}>Hours</th>
                  <th onClick={() => handleSort("cost")}>Cost</th>
                  <th onClick={() => handleSort("lab")}>Lab</th>
                  <th onClick={() => handleSort("lectureSchedule")}>
                    Lecture Schedule
                  </th>
                  <th onClick={() => handleSort("description")}>Description</th>
                </tr>
              </thead>
              <tbody>
                {sortedLectures.map((lecture, index) => (
                  <tr key={lecture._id}>
                    <td>{index + 1}</td>
                    <td>{lecture.name}</td>
                    <td>{lecture.status}</td>
                    <td>{lecture.batch.name}</td>
                    <td>{lecture.hours}</td>
                    <td>{lecture.cost}</td>
                    <td>{lecture.lab}</td>
                    <td>
                      {lecture.lectureSchedule.map((schedule, index) => (
                        <div key={index}>
                          {schedule.day} - {schedule.time}
                        </div>
                      ))}
                    </td>
                    <td>{lecture.description}</td>
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

export default Lectures;
