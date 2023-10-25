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
import { ClassCard } from "@components/Classes";

const Students = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
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
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showStudentDetailsModal, setShowStudentDetailsModal] = useState(false);

  // State for new student creation
  const [newStudentName, setNewStudentName] = useState("");
  const [newStudentPhoneNumber, setNewStudentPhoneNumber] = useState("");
  const [newStudentEmail, setNewStudentEmail] = useState("");
  const [newStudentNationalId, setNewStudentNationalId] = useState("");
  const [newStudentPaid, setNewStudentPaid] = useState(0);
  const [newStudentPlacementTestDate, setNewStudentPlacementTestDate] =
    useState("");
    const [newStudentPlacementTest, setNewStudentPlacementTest] =
    useState("");
  const [maxPaid, setMaxPaid] =
    useState(0);
  const [newStudentDue, setNewStudentDue] = useState(0);
  const [loadingAddStudent, setLoadingAddStudent] = useState(false);

  const fetchStudentData = async () => {
    try {
      const response = await axios.get("/api/student");
      if (response.status === 200) {
        const studentData = response.data;
        setStudents(studentData.students);
        setFilteredStudents(studentData.students);
      }
    } catch (error) {
      console.error("Error fetching student data:", error);
      setError("Failed to fetch student data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudentData();
  }, []);
  console.log(filteredStudents.students);
  useEffect(() => {
    // Automatically apply filters when filter inputs change
    handleFilter();
  }, [
    filterName,
    filterEmail,
    filterPhoneNumber,
    students,
    startDate,
    endDate,
  ]);

  const handleFilter = () => {
    let filtered = [...students];

    if (filterName) {
      filtered = filtered.filter((student) =>
        student.name.toLowerCase().includes(filterName.toLowerCase())
      );
    }
    if (filterEmail) {
      filtered = filtered.filter((student) =>
        student.email.toLowerCase().includes(filterEmail.toLowerCase())
      );
    }
    if (filterPhoneNumber) {
      filtered = filtered.filter((student) =>
        student.phoneNumber
          .toLowerCase()
          .includes(filterPhoneNumber.toLowerCase())
      );
    }
    if (startDate && endDate) {
      filtered = filtered.filter((student) => {
        const joinedDate = new Date(student.joinedDate);
        return (
          joinedDate >= new Date(startDate) && joinedDate <= new Date(endDate)
        );
      });
    } else if (startDate && !endDate) {
      filtered = filtered.filter((student) => {
        const joinedDate = new Date(student.joinedDate);
        const startDateValue = new Date(startDate);
        const currentDate = new Date();
        return joinedDate >= startDateValue && joinedDate <= currentDate;
      });
    }

    setFilteredStudents(filtered);
  };

  const clearFilters = () => {
    setFilterName("");
    setFilterEmail("");
    setStartDate("");
    setEndDate("");
    setFilteredStudents(students);
  };

  const handleAddStudent = async () => {
    try {
      setLoadingAddStudent(true);
      if (newStudentPaid > maxPaid) {
          toast.error("Paid amount cannot be more than the test cost.", {
            position: "top-right",
            autoClose: 3000,
          });
          return; // Exit the function without adding the student
        }
      const response = await axios.post("/api/student", {
        name: newStudentName,
        phoneNumber: newStudentPhoneNumber,
        email: newStudentEmail,
        nationalId: newStudentNationalId,
        paid: newStudentPaid,
        placementTest: newStudentPlacementTest,
        placementTestDate: newStudentPlacementTestDate,
        due: newStudentDue,
        status: `Under Placement Test at ${new Date(
          newStudentPlacementTestDate
        ).toLocaleDateString()}`,
        level: "N/A",
      });
      if (response.status === 201) {
        // Data added successfully
        fetchStudentData();
        toast.success("Student added successfully!", {
          position: "top-right",
          autoClose: 3000,
        });
        setShowModal(false);
        // Clear the form fields
        setNewStudentName("");
        setNewStudentPhoneNumber("");
        setNewStudentEmail("");
        setNewStudentNationalId("");
        setNewStudentPaid(0);
        setNewStudentPlacementTestDate("");
        setNewStudentDue(0);
      } else {
        // Handle other possible response status codes here
        console.error("Unexpected status code:", response.status);
      }
    } catch (error) {
      console.error("Error adding student:", error);
      setError(error.message);
      toast.error("Failed to add the student. Please try again.", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      // Set loading to false when the request is complete, regardless of success or failure
      setLoadingAddStudent(false);
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

  const sortedStudents = [...filteredStudents].sort((a, b) => {
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

  const openStudentDetailsModal = (student) => {
    setSelectedStudent(student);
    setShowStudentDetailsModal(true);
  };

  const closeStudentDetailsModal = () => {
    setSelectedStudent(null);
    setShowStudentDetailsModal(false);
  };
  const totalStudentsCount = sortedStudents.length;
  const waitingListStudentsCount =
    sortedStudents.filter((student) => student.status === "Waiting List")
      .length || "N/A";
  const a1LevelStudentsCount =
    sortedStudents.filter((student) => student.level === "A1").length || "N/A";
  const [placementTests, setPlacementTests] = useState([]);
  const [selectedPlacementTest, setSelectedPlacementTest] = useState(null);
  const fetchPlacementTests = async () => {
    try {
      const response = await axios.get("/api/placement_test_settings");
      if (response.status === 200) {
        const testsData = response.data;
        console.log(response);
        setPlacementTests(testsData);
      }
    } catch (error) {
      console.error("Error fetching placement tests:", error);
    }
  };

  useEffect(() => {
    fetchPlacementTests();
  }, []);

  return (
    <AdminLayout>
      <div className="row">
        <ClassCard
          data={totalStudentsCount}
          title="Total Students"
          enableOptions={false}
          isLoading={loading}
        />
        <ClassCard
          data={waitingListStudentsCount}
          title="Waiting List Students"
          enableOptions={false}
          isLoading={loading}
        />
        <ClassCard
          data={a1LevelStudentsCount}
          title="A1 Students"
          enableOptions={false}
          isLoading={loading}
        />
      </div>
      <Card>
        <Card.Header>Students</Card.Header>
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
            onClick={() => setShowModal(true)}
            className="mb-3"
          >
            Add Student
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
              {sortedStudents.map((student, index) => (
                <tr
                  key={student._id}
                  onClick={() => openStudentDetailsModal(student)}
                >
                  <td>{index + 1}</td>
                  <td>{student.name}</td>
                  <td>{student.email}</td>
                  <td>{student.phoneNumber}</td>
                  <td>{new Date(student.joinedDate).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
      <ToastContainer position="top-right" autoClose={3000} />
      <Modal show={showStudentDetailsModal} onHide={closeStudentDetailsModal}>
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title className="mb-0">Student Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedStudent && (
            <div>
              <p>Name: {selectedStudent.name}</p>
              <p>Email: {selectedStudent.email}</p>
              <p>Phone Number: {selectedStudent.phoneNumber}</p>
              <p>National ID: {selectedStudent.nationalId}</p>
              <p>Paid: {selectedStudent.paid} EGP</p>
              <p>Placement Test Date: {selectedStudent.placementTestDate}</p>
              <p>Due: {selectedStudent.due} EGP</p>
              <p>Level: {selectedStudent.level}</p>
              <p>Status: {selectedStudent.status}</p>
              <p>
                Joined Date:{" "}
                {new Date(selectedStudent.joinedDate).toLocaleDateString()}
              </p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            className="text-white"
            onClick={closeStudentDetailsModal}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Create New Student</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={newStudentName}
                onChange={(e) => setNewStudentName(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={newStudentEmail}
                onChange={(e) => setNewStudentEmail(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                type="text"
                value={newStudentPhoneNumber}
                onChange={(e) => setNewStudentPhoneNumber(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>National ID</Form.Label>
              <Form.Control
                type="text"
                value={newStudentNationalId}
                onChange={(e) => setNewStudentNationalId(e.target.value)}
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Placement Test</Form.Label>
              <Form.Control
                as="select"
                value={newStudentPlacementTestDate}
                onChange={(e) => {
                  setNewStudentPlacementTest(e.target.value);
                  // Find the selected test by its ID
                  const selectedTest = placementTests.find(
                    (test) => test._id === e.target.value
                  );
                  setSelectedPlacementTest(selectedTest);
                  setMaxPaid(selectedTest.cost)
                  setNewStudentPlacementTestDate(selectedTest.date);
                  // Update the paid and due based on the selected test
                  if (selectedTest) {
                    if (newStudentPaid < selectedTest.cost) {
                      setNewStudentDue(selectedTest.cost - newStudentPaid);
                    } else {
                      setNewStudentDue(0);
                    }
                  }
                }}
              >
                <option value="" hidden>
                  {placementTests.length > 0
                    ? newStudentPlacementTestDate
                    : "No Placement Tests Available"}
                </option>
                {placementTests.map((test) => (
                  <option key={test._id} value={test._id}>
                    {new Date(test.date).toLocaleDateString()} - {test.room} -{" "}
                    {test.cost} EGP
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Paid (EGP)</Form.Label>
              <Form.Control
                type="number"
                value={newStudentPaid}
                disabled={selectedPlacementTest ? false : true}
                onChange={(e) => {
                  setNewStudentPaid(e.target.value)
                  setNewStudentDue(maxPaid - e.target.value);
                }}
                
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Due (EGP)</Form.Label>
              <Form.Control
                type="number"
                value={newStudentDue}
                onChange={(e) => setNewStudentDue(e.target.value)}
                disabled
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="success" onClick={handleAddStudent} disabled={placementTests.length > 0 ? false : true}>
            {loadingAddStudent ? "Adding Student..." : "Add Student"}
          </Button>
        </Modal.Footer>
      </Modal>
    </AdminLayout>
  );
};

export default Students;
