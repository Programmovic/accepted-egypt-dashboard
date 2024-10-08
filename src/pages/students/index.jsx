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
import Link from "next/link";
import { Pagination } from "react-bootstrap";
import Select from "react-select";


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
  const [newStudentPlacementTest, setNewStudentPlacementTest] = useState("");
  const [maxPaid, setMaxPaid] = useState(0);
  const [newStudentDue, setNewStudentDue] = useState(0);
  const [loadingAddStudent, setLoadingAddStudent] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [salesMembers, setSalesMembers] = useState([]);
  const [selectedSalesMember, setSelectedSalesMember] = useState(null);
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
  const fetchRooms = async () => {
    try {
      const response = await axios.get("/api/room");
      if (response.status === 200) {
        const roomData = response.data;
        setRooms(roomData);
      }
    } catch (error) {
      console.error("Error fetching student data:", error);
      setError("Failed to fetch student data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchRooms();
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
      const existingStudent = students.find(
        (student) => student.phoneNumber === newStudentPhoneNumber
      );

      if (existingStudent) {
        toast.error(
          "Student with the same email or phone number already exists.",
          {
            position: "top-right",
            autoClose: 3000,
          }
        );
        return; // Exit the function without adding the student
      }
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
        salesMember: selectedSalesMember.value,
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
  console.log(selectedSalesMember);
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
  console.log(filteredStudents);
  const getStudentsCountByStatus = (status) => {
    return filteredStudents.filter((student) => student.status === status)
      .length;
  };
  const [levels, setLevels] = useState([]);
  useEffect(() => {
    // Fetch levels from the /api/level endpoint when the component mounts
    fetch("/api/level")
      .then((response) => response.json())
      .then((data) => {
        setLevels(data.levels); // Set the levels in the state
      })
      .catch((error) => {
        console.error("Error fetching levels:", error);
      });
  }, []);
  const getLevelCount = (level) => {
    return filteredStudents.filter((test) => test.level === level).length;
  };
  const handleDeleteStudent = async (studentId) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      try {
        const response = await axios.delete(`/api/student?id=${studentId}`);
        if (response.status === 200) {
          // Remove the deleted student from the local state
          setStudents((prevStudents) =>
            prevStudents.filter((student) => student._id !== studentId)
          );
          toast.success("Student deleted successfully!", {
            position: "top-right",
            autoClose: 3000,
          });
        } else {
          // Handle other possible response status codes here
          console.error("Unexpected status code:", response.status);
        }
      } catch (error) {
        console.error("Error deleting student:", error);
        toast.error("Failed to delete the student. Please try again.", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    }
  };
  const [currentPage, setCurrentPage] = useState(1);
  const [studentsPerPage] = useState(10); // Number of students to display per page

  // Calculate the index of the last student to display
  const indexOfLastStudent = currentPage * studentsPerPage;
  // Calculate the index of the first student to display
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;

  // Get the current page of students
  const currentStudents = sortedStudents.slice(
    indexOfFirstStudent,
    indexOfLastStudent
  );

  // Calculate the total number of pages
  const totalPages = Math.ceil(sortedStudents.length / studentsPerPage);

  // Function to change the current page
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Function to go to the previous page
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  useEffect(() => {
    // Fetch sales members from your API
    const fetchSalesMembers = async () => {
      try {
        const response = await axios.get("/api/sales_member"); // Replace with your API endpoint
        if (response.status === 200) {
          setSalesMembers(response.data);
        }
      } catch (error) {
        console.error("Error fetching sales members:", error);
      }
    };

    fetchSalesMembers();
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
        {levels?.map((level, i) => (
          <ClassCard
            data={getLevelCount(level.name)}
            title={`Level ${level.name}`}
            enableOptions={false}
            isLoading={loading}
          />
        ))}
      </div>
      <Card>
        <Card.Header className='d-flex justify-content-between'>
          Students{" "}
          <p className='mb-0'>
            Showing {indexOfFirstStudent + 1} -{" "}
            {Math.min(indexOfLastStudent, totalStudentsCount)} of{" "}
            {totalStudentsCount} students
          </p>
        </Card.Header>
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
              <Col xs={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Joined Date Start</Form.Label>
                  <Form.Control
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col xs={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Joined Date End</Form.Label>
                  <Form.Control
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col xs={4}>
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
            <div className='d-flex justify-content-between'>
              <Button variant="secondary" onClick={clearFilters}>
                Clear Filters
              </Button>
              <Button
                variant="success"
                onClick={() => setShowModal(true)}
              >
                Add New Student
              </Button>
            </div>
          </Form>


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
                <th className="text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {currentStudents.map((student, index) => (
                <tr
                  key={student._id}
                  onClick={() => openStudentDetailsModal(student)}
                >
                  <td>{index + 1}</td>
                  <td>{student.name}</td>
                  <td>{student.email || "-"}</td>
                  <td>{student.phoneNumber}</td>
                  <td>{new Date(student.joinedDate).toLocaleString(undefined, { year: 'numeric', day: 'numeric', month: 'long', hour: 'numeric', minute: 'numeric', second: 'numeric' })}</td>
                  {/* Inside your table row */}
                  <td className="text-center">
                    {/* Add the delete button or icon */}
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDeleteStudent(student._id)}
                    >
                      Delete
                    </Button>
                  </td>
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
        {selectedStudent && (
          <>
            <Modal.Body>
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
                <div className="container">
                  <ol className="progress-meter">
                    <li className="progress-point done">Joined</li>
                    <li
                      className={`progress-point ${selectedStudent.status === "Under Placement Test" ||
                          selectedStudent.status === "Waiting List" ||
                          selectedStudent.status === "Joined Batch"
                          ? "done"
                          : "todo"
                        }`}
                    >
                      Placement Test
                    </li>
                    <li
                      className={`progress-point ${(selectedStudent.status === "Waiting List" ||
                          selectedStudent.status === "Joined Batch") &&
                          selectedStudent.status !== "Under Placement Test" &&
                          selectedStudent.status !==
                          "Under Placement Test at " +
                          new Date(
                            selectedStudent.placementTestDate
                          ).toLocaleDateString()
                          ? "done"
                          : "todo"
                        }`}
                    >
                      Waiting List
                    </li>
                    <li
                      className={`progress-point ${selectedStudent.status === "Joined Batch"
                          ? "done"
                          : "todo"
                        }`}
                    >
                      Joined Batch
                    </li>
                  </ol>
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="secondary"
                className="text-white"
                onClick={closeStudentDetailsModal}
              >
                Close
              </Button>
              <Button variant="success">
                <Link
                  href={`/students/${selectedStudent._id}`}
                  className="text-decoration-none text-light"
                >
                  View Student Profile
                </Link>
              </Button>
            </Modal.Footer>
          </>
        )}
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
              <Form.Label>Email (Optional)</Form.Label>
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
              <Form.Label>National ID (Optional)</Form.Label>
              <Form.Control
                type="text"
                value={newStudentNationalId}
                onChange={(e) => setNewStudentNationalId(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Select Sales Member:</Form.Label>
              <Select
                options={salesMembers.map((member) => ({
                  value: member._id,
                  label: member.name,
                }))}
                value={selectedSalesMember}
                onChange={(selectedOption) =>
                  setSelectedSalesMember(selectedOption)
                }
                isSearchable
                isClearable
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Placement Test</Form.Label>
              <Form.Control
                as="select"
                value={newStudentPlacementTest}
                onChange={(e) => {
                  setNewStudentPlacementTest(e.target.value);
                  // Find the selected test by its ID
                  const selectedTest = placementTests.find(
                    (test) => test._id === e.target.value
                  );
                  setSelectedPlacementTest(selectedTest);
                  setMaxPaid(selectedTest.cost);
                  setNewStudentPaid(selectedTest.cost);
                  setNewStudentPlacementTestDate(selectedTest.date);
                  setNewStudentDue(0);
                }}
              >
                <option value="" hidden>
                  {placementTests.length > 0
                    ? newStudentPlacementTestDate
                    : "No Placement Tests Available"}
                </option>
                {placementTests.map((test) => (
                  <option key={test._id} value={test._id}>
                    {new Date(test.date).toLocaleDateString()} -{" "}
                    {rooms.find((room) => room._id === test.room)?.name} -{" "}
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
                disabled={true}
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
          <Button
            variant="success"
            onClick={handleAddStudent}
            disabled={placementTests.length > 0 ? false : true}
          >
            {loadingAddStudent ? "Adding Student..." : "Add Student"}
          </Button>
        </Modal.Footer>
      </Modal>
      <Pagination className="py-3 flex justify-content-between">
        <Button
          variant="secondary"
          onClick={prevPage}
          disabled={currentPage === 1}
        >
          Back
        </Button>
        <Button
          variant="secondary"
          onClick={nextPage}
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </Pagination>
    </AdminLayout>
  );
};

export default Students;
