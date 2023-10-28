import { Card, Form, Button, Row, Col, Table, Modal } from "react-bootstrap";
import { useEffect, useState } from "react";
import { AdminLayout } from "@layout";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";

const Lectures = () => {
  const [lectureResource, setLectureResource] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterTitle, setFilterTitle] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterBatch, setFilterBatch] = useState("");
  const [filterHours, setFilterHours] = useState("");
  const [filterCost, setFilterCost] = useState("");
  const [filterLab, setFilterLab] = useState("");
  const [filterDescription, setFilterDescription] = useState("");
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
  const [showLectureDetailsModal, setShowLectureDetailsModal] = useState(false);
  const [selectedLecture, setSelectedLecture] = useState(null);

  // Function to open the modal and set the selected batch details
  const openLectureDetailsModal = (lecture) => {
    setSelectedLecture(lecture);
    setShowLectureDetailsModal(true);
  };
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
  }, [
    filterTitle,
    filterStatus,
    filterBatch,
    filterHours,
    filterCost,
    filterLab,
    filterDescription,
    sortBy,
    sortOrder,
    lectureResource,
  ]);

  const handleFilter = () => {
    let filteredLectures = [...lectureResource];

    // Filter by Title
    if (filterTitle) {
      filteredLectures = filteredLectures.filter((lecture) =>
        lecture.name.toLowerCase().includes(filterTitle.toLowerCase())
      );
    }

    // Filter by Status
    if (filterStatus) {
      filteredLectures = filteredLectures.filter(
        (lecture) => lecture.status.toLowerCase() === filterStatus.toLowerCase()
      );
    }

    // Filter by Batch
    if (filterBatch) {
      filteredLectures = filteredLectures.filter(
        (lecture) => lecture.batch.toLowerCase() === filterBatch.toLowerCase()
      );
    }

    // Filter by Hours
    if (filterHours) {
      filteredLectures = filteredLectures.filter(
        (lecture) => lecture.hours === parseInt(filterHours)
      );
    }

    // Filter by Cost
    if (filterCost) {
      filteredLectures = filteredLectures.filter(
        (lecture) => lecture.cost === parseFloat(filterCost)
      );
    }

    // Filter by Lab
    if (filterLab) {
      filteredLectures = filteredLectures.filter((lecture) =>
        lecture.lab.toLowerCase().includes(filterLab.toLowerCase())
      );
    }

    // Filter by Description
    if (filterDescription) {
      filteredLectures = filteredLectures.filter((lecture) =>
        lecture.description
          .toLowerCase()
          .includes(filterDescription.toLowerCase())
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
  console.log(filteredData);
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
                      setNewLectureHours(getBatchName(e.target.value).hours);
                      setNewLectureCost(getBatchName(e.target.value).cost);
                      setNewLectureLimitTrainees(
                        getBatchName(e.target.value).limitTrainees
                      );
                      setNewLectureStatus(getBatchName(e.target.value).status);
                      setNewLectureLab(getBatchName(e.target.value).lab);
                    }}
                  >
                    <option value="" hidden>
                      Select a Batch
                    </option>
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
                  <Form.Control type="number" value={newLectureHours} />
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
                    <Form.Group className="mb-3">
                      <Form.Label>Filter by Batch</Form.Label>
                      <Form.Control
                        type="text"
                        value={filterBatch}
                        onChange={(e) => setFilterBatch(e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                  <Col xs={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Filter by Hours</Form.Label>
                      <Form.Control
                        type="text"
                        value={filterHours}
                        onChange={(e) => setFilterHours(e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col xs={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Filter by Cost</Form.Label>
                      <Form.Control
                        type="text"
                        value={filterCost}
                        onChange={(e) => setFilterCost(e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                  <Col xs={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Filter by Lab</Form.Label>
                      <Form.Control
                        type="text"
                        value={filterLab}
                        onChange={(e) => setFilterLab(e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col xs={12}>
                    <Form.Group className="mb-3">
                      <Form.Label>Filter by Description</Form.Label>
                      <Form.Control
                        type="text"
                        value={filterDescription}
                        onChange={(e) => setFilterDescription(e.target.value)}
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
            </Row>
          </Form>

          {loading ? (
            <p>Loading lectures...</p>
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
                    <th onClick={() => handleSort("batch")}>Batch</th>
                    <th onClick={() => handleSort("hours")}>Hours</th>
                    <th onClick={() => handleSort("cost")}>Cost</th>
                    <th onClick={() => handleSort("lab")}>Lab</th>
                    <th onClick={() => handleSort("lectureSchedule")}>
                      Lecture Schedule
                    </th>
                    <th onClick={() => handleSort("description")}>
                      Description
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sortedLectures.map((lecture, index) => (
                    <tr
                      key={lecture._id}
                      onClick={() => openLectureDetailsModal(lecture)}
                    >
                      <td>{index + 1}</td>
                      <td>{lecture.name}</td>
                      <td>{lecture.status}</td>
                      <td>
                        {
                          batchList.find((batch) => batch._id === lecture.batch)
                            ?.name
                        }
                      </td>
                      <td>{lecture.hours}</td>
                      <td>{lecture.cost}</td>
                      <td>{lecture.room}</td>
                      <td>
                        <ul>
                          <li>
                            {`${lecture.weeklyHours.day}: From ${lecture.weeklyHours.from} to ${lecture.weeklyHours.to}`}
                          </li>
                        </ul>
                      </td>
                      <td>{lecture.description}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
          {selectedLecture && (
            <Modal
              show={showLectureDetailsModal}
              onHide={() => setShowLectureDetailsModal(false)}
            >
              <Modal.Header closeButton>
                <Modal.Title>Batch Details</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <p>Name: {selectedLecture.name}</p>
                <p>Status: {selectedLecture.status}</p>
                <p>Hours: {selectedLecture.hours}</p>
                <p>Cost: {selectedLecture.cost} EGP</p>
                <p>Limit Trainees: {selectedLecture.limitTrainees} Trainees</p>
                <p>
                  Start Date:{" "}
                  {new Date(selectedLecture.shouldStartAt).toLocaleDateString()}
                </p>
                <p>
                  End Date:{" "}
                  {new Date(selectedLecture.shouldEndAt).toLocaleDateString()}
                </p>
                <p>Room: {selectedLecture.room}</p>
                <p>Description: {selectedLecture.description}</p>

                <p>Lecture Times:</p>
                <ul>
                  <li>
                    {`${selectedLecture.weeklyHours.day}: From ${selectedLecture.weeklyHours.from} to ${selectedLecture.weeklyHours.to}`}
                  </li>
                </ul>
                <p>
                  Created Date:{" "}
                  {new Date(selectedLecture.createdDate).toLocaleDateString()}
                </p>
              </Modal.Body>
              <Modal.Footer>
                <Button
                  variant="secondary"
                  onClick={() => setShowLectureDetailsModal(false)}
                >
                  Close
                </Button>
                <Link
                  href={`/lectures/${selectedLecture._id}`}
                  className="btn btn-success text-decoration-none text-light"
                >
                  View Lecture Attendances
                </Link>
              </Modal.Footer>
            </Modal>
          )}
        </Card.Body>
      </Card>
    </AdminLayout>
  );
};

export default Lectures;
