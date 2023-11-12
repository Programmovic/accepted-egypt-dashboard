import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Badge,
  Button,
  Card,
  Col,
  Form,
  Modal,
  Row,
  Table,
} from "react-bootstrap";
import { AdminLayout } from "@layout";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/router";

const Instructors = () => {
  const [instructors, setInstructors] = useState([]);
  const [filteredInstructors, setFilteredInstructors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterName, setFilterName] = useState("");
  const [filterEmail, setFilterEmail] = useState("");
  const [filterPhoneNumber, setFilterPhoneNumber] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [sortBy, setSortBy] = useState("name"); // Default sorting criteria
  const [sortOrder, setSortOrder] = useState("asc"); // Default sorting order
  const [selectedInstructor, setSelectedInstructor] = useState(null);
  const [showInstructorDetailsModal, setShowInstructorDetailsModal] =
    useState(false);
  const [instructorClasses, setInstructorClasses] = useState([]);
  const [batchesData, setBatchesData] = useState([]);
  // State for new instructor creation
  const [showCreateInstructorModal, setShowCreateInstructorModal] =
    useState(false);
  const [newInstructorName, setNewInstructorName] = useState("");
  const [newInstructorEmail, setNewInstructorEmail] = useState("");
  const [newInstructorPhoneNumber, setNewInstructorPhoneNumber] = useState("");
  const [newInstructorPicture, setNewInstructorPicture] = useState("");
  const openCreateInstructorModal = () => {
    setShowCreateInstructorModal(true);
  };

  const closeCreateInstructorModal = () => {
    setShowCreateInstructorModal(false);
  };

  const fetchInstructorData = async () => {
    try {
      const response = await axios.get("/api/instructor");
      if (response.status === 200) {
        const instructorData = response.data;
        setInstructors(instructorData);
        setFilteredInstructors(instructorData);
      }
    } catch (error) {
      console.error("Error fetching instructor data:", error);
      setError("Failed to fetch instructor data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };
  const fetchBatchesData = async () => {
    try {
      const response = await axios.get("/api/batch");
      console.log(response);
      if (response.status === 200) {
        const batchesData = response.data;
        setBatchesData(batchesData);
      }
    } catch (error) {
      console.error("Error fetching instructor data:", error);
      setError("Failed to fetch instructor data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInstructorData();
    fetchBatchesData();
  }, []);

  useEffect(() => {
    // Automatically apply filters when filter inputs change
    handleFilter();
  }, [
    filterName,
    filterEmail,
    filterPhoneNumber,
    instructors,
    startDate,
    endDate,
  ]);

  const handleFilter = () => {
    let filtered = [...instructors];

    if (filterName) {
      filtered = filtered.filter((instructor) =>
        instructor.name.toLowerCase().includes(filterName.toLowerCase())
      );
    }
    if (filterEmail) {
      filtered = filtered.filter((instructor) =>
        instructor.email.toLowerCase().includes(filterEmail.toLowerCase())
      );
    }
    if (filterPhoneNumber) {
      filtered = filtered.filter((instructor) =>
        instructor.phoneNumber
          .toLowerCase()
          .includes(filterPhoneNumber.toLowerCase())
      );
    }
    if (startDate && endDate) {
      filtered = filtered.filter((instructor) => {
        const joinedDate = new Date(instructor.joinedDate);
        return (
          joinedDate >= new Date(startDate) && joinedDate <= new Date(endDate)
        );
      });
    } else if (startDate && !endDate) {
      filtered = filtered.filter((instructor) => {
        const joinedDate = new Date(instructor.joinedDate);
        const startDateValue = new Date(startDate);
        const currentDate = new Date();
        return joinedDate >= startDateValue && joinedDate <= currentDate;
      });
    }

    setFilteredInstructors(filtered);
  };

  const clearFilters = () => {
    setFilterName("");
    setFilterEmail("");
    setStartDate("");
    setEndDate("");
    setFilteredInstructors(instructors);
  };

  const handleCreateInstructor = async () => {
    try {
      const response = await axios.post("/api/instructor", {
        name: newInstructorName,
        email: newInstructorEmail,
        phoneNumber: newInstructorPhoneNumber,
        // Other properties as needed
      });
      if (response.status === 201) {
        // Data added successfully
        fetchInstructorData(); // Refresh the instructor list
        toast.success("Instructor added successfully!", {
          position: "top-right",
          autoClose: 3000,
        });
        closeCreateInstructorModal(); // Close the modal
        // Clear the form fields
        setNewInstructorName("");
        setNewInstructorEmail("");
        setNewInstructorPhoneNumber("");
        setNewInstructorPicture("");
      } else {
        // Handle other possible response status codes here
        console.error("Unexpected status code:", response.status);
      }
    } catch (error) {
      console.error("Error adding instructor:", error);
      toast.error("Failed to add the instructor. Please try again.", {
        position: "top-right",
        autoClose: 3000,
      });
    }
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
  const sortedInstructors = [...filteredInstructors].sort((a, b) => {
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
  const openInstructorDetailsModal = (instructor) => {
    setSelectedInstructor(instructor);
    setShowInstructorDetailsModal(true);
    fetchInstructorClasses(instructor._id);
  };
  const closeInstructorDetailsModal = () => {
    setShowInstructorDetailsModal(false);
  };
  const fetchInstructorClasses = async (instructorId) => {
    try {
      const response = await axios.get(
        `/api/batch/instructor_batches?instructorId=${instructorId}`
      );
      if (response.status === 200) {
        const classesData = response.data;
        setInstructorClasses(classesData);
        console.log(classesData);
      }
    } catch (error) {
      console.error("Error fetching instructor classes:", error);
      setError("Failed to fetch instructor classes. Please try again later.");
    }
  };
  console.log(instructorClasses);
  console.log(selectedInstructor);
  const router = useRouter();
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [showAssignBatchModal, setShowAssignBatchModal] = useState(false);
  const handleAssignToBatch = async () => {
    if (!selectedInstructor || !selectedBatch) {
      return;
    }

    try {
      const response = await axios.put(`/api/instructor`, {
        instructorId: selectedInstructor._id,
        batchId: selectedBatch,
      });

      if (response.status === 200) {
        // Assignment successful
        toast.success("Instructor assigned to the batch successfully!", {
          position: "top-right",
          autoClose: 3000,
        });
        setShowAssignBatchModal(false);
      } else {
        console.error("Unexpected status code:", response.status);
      }
    } catch (error) {
      console.error("Error assigning instructor to batch:", error);
      toast.error(error.message, {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };
  const getBatchName = (instructorId) => {
    const selectedInstructor = batchesData.find(
      (instructor) => instructor._id === instructorId
    );
    console.log(instructorId);
    return selectedInstructor ? selectedInstructor : "Unknown"; // You can provide a default value like 'Unknown'
  };
  return (
    <AdminLayout>
      <Card>
        <Card.Header>Instructors</Card.Header>
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
                  <Form.Label>Filter by Email</Form.Label>
                  <Form.Control
                    type="text"
                    value={filterEmail}
                    onChange={(e) => setFilterEmail(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col xs={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Joined Date Start</Form.Label>
                  <Form.Control
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col xs={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Joined Date End</Form.Label>
                  <Form.Control
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col xs={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Filter by Phone Number</Form.Label>
                  <Form.Control
                    type="text"
                    value={filterPhoneNumber}
                    onChange={(e) => setFilterPhoneNumber(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Button variant="secondary" onClick={clearFilters}>
              Clear Filters
            </Button>
          </Form>

          <Button
            variant="success"
            onClick={() => openCreateInstructorModal(true)}
            className="mb-3"
          >
            Add Instructor
          </Button>

          <Table striped bordered hover>
            <thead>
              <tr>
                <th>#</th>
                <th onClick={() => handleSort("name")} className="clickable">
                  Name {sortBy === "name" && (sortOrder === "asc" ? "↑" : "↓")}
                </th>
                <th onClick={() => handleSort("email")} className="clickable">
                  Email{" "}
                  {sortBy === "email" && (sortOrder === "asc" ? "↑" : "↓")}
                </th>
                <th
                  onClick={() => handleSort("phoneNumber")}
                  className="clickable"
                >
                  Phone Number{" "}
                  {sortBy === "phoneNumber" &&
                    (sortOrder === "asc" ? "↑" : "↓")}
                </th>
                <th
                  onClick={() => handleSort("joinedDate")}
                  className="clickable"
                >
                  Joined Date{" "}
                  {sortBy === "joinedDate" && (sortOrder === "asc" ? "↑" : "↓")}
                </th>
              </tr>
            </thead>

            <tbody>
              {sortedInstructors.map((instructor, index) => (
                <tr
                  key={instructor._id}
                  onClick={() => openInstructorDetailsModal(instructor)}
                >
                  <td>{index + 1}</td>
                  <td>{instructor.name}</td>
                  <td>{instructor.email}</td>
                  <td>{instructor.phoneNumber}</td>
                  <td>
                    {new Date(instructor.joinedDate).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
      <ToastContainer position="top-right" autoClose={3000} />
      <Modal
        show={showInstructorDetailsModal}
        onHide={closeInstructorDetailsModal}
      >
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title className="mb-0">Instructor Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedInstructor && (
            <div>
              <p>Name: {selectedInstructor.name}</p>
              <p>Email: {selectedInstructor.email}</p>
              <p>Phone Number: {selectedInstructor.phoneNumber}</p>
              <p>
                Joined Date:{" "}
                {new Date(selectedInstructor.joinedDate).toLocaleDateString()}
              </p>
              <p>
                Batch:
                <ul>
                  {instructorClasses.map((batch) => (
                    <li key={batch.id}>{batch.name}</li>
                  ))}
                </ul>
              </p>

              {/* Display instructor's classes in a table */}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            className="text-white"
            onClick={closeInstructorDetailsModal}
          >
            Close
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              router.push(`/instructors/${selectedInstructor._id}`);
            }}
          >
            View Instructor
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showCreateInstructorModal}
        onHide={closeCreateInstructorModal}
      >
        <Modal.Header closeButton>
          <Modal.Title>Create New Instructor</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={newInstructorName}
                onChange={(e) => setNewInstructorName(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="text"
                value={newInstructorEmail}
                onChange={(e) => setNewInstructorEmail(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                type="text"
                value={newInstructorPhoneNumber}
                onChange={(e) => setNewInstructorPhoneNumber(e.target.value)}
              />
            </Form.Group>
            {/* Add other form fields for additional properties */}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeCreateInstructorModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleCreateInstructor}>
            Create Instructor
          </Button>
        </Modal.Footer>
      </Modal>
    </AdminLayout>
  );
};

export default Instructors;
