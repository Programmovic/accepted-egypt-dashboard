// Import necessary libraries and components
import React, { useEffect, useState, useMemo } from "react";
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
import Link from "next/link"; // Import Link from Next.js
import { useRouter } from "next/router"; // Import useRouter from Next.js
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import useAuth from "../../hooks/useAuth";

const Employees = () => {
  const router = useRouter(); // Initialize the router
  const token = useAuth();
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterName, setFilterName] = useState("");
  const [filterEmail, setFilterEmail] = useState("");
  const [filterPhoneNumber, setFilterPhoneNumber] = useState("");
  const [showModal, setShowModal] = useState(false);
  // State for new Employee creation
  const [newEmployeeData, setNewEmployeeData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    address: "",
    department: "",
    position: "",
    salary: "",
    dateOfBirth: "",
    startDate: "", // Add start date field
  });

  // Function to fetch Employee data
  const fetchEmployeeData = async () => {
    try {
      const response = await axios.get("/api/employee", {
        headers: {
          Authorization: `Bearer ${token}`, // Adjust according to your API's authentication scheme
        },
      });
      if (response.status === 200) {
        const employeeData = response.data;
        setEmployees(employeeData);
        setFilteredEmployees(employeeData);
      }
    } catch (error) {
      console.error("Error fetching employee data:", error);
      setError("Failed to fetch employee data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };
  // Function to add a new Employee
  const handleAddEmployee = async () => {
    try {
      const response = await axios.post("/api/employee", newEmployeeData);
      if (response.status === 201) {
        // Data added successfully
        fetchEmployeeData();
        toast.success("Employee added successfully!", {
          position: "top-right",
          autoClose: 3000,
        });
        setShowModal(false);
        // Clear the form fields
        setNewEmployeeData({
          name: "",
          email: "",
          phoneNumber: "",
          address: "",
          department: "",
          position: "",
          salary: "",
          dateOfBirth: "",
          startDate: "", // Clear start date field
        });
      } else {
        // Handle other possible response status codes here
        console.error("Unexpected status code:", response.status);
      }
    } catch (error) {
      console.error("Error adding employee:", error);
      setError("Failed to add the employee. Please try again.");
      toast.error("Failed to add the employee. Please try again.", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };
  // Use useMemo to memoize the employees and filteredEmployees
  const memoizedEmployees = useMemo(() => employees, [employees]);
  const memoizedFilteredEmployees = useMemo(
    () => filteredEmployees,
    [filteredEmployees]
  );
  const [departments, setDepartments] = useState([]);
  const fetchDepartments = async () => {
    try {
      const response = await axios.get('/api/department');
      if (response.status === 200) {
        setDepartments(response.data);
      }
    } catch (error) {
      console.error("Error fetching Departments:", error);
    }
  };
  const [positions, setPositions] = useState([]);
  const fetchPositions = async () => {
    try {
      const response = await axios.get('/api/position');
      if (response.status === 200) {
        setPositions(response.data);
      }
    } catch (error) {
      console.error("Error fetching Departments:", error);
    }
  };
  useEffect(() => {
    fetchEmployeeData();
    fetchDepartments()
    fetchPositions();
  }, []);
  // Function to apply filters
  const handleFilter = () => {
    let filtered = [...memoizedEmployees];

    if (filterName) {
      filtered = filtered.filter((employee) =>
        employee.name.toLowerCase().includes(filterName.toLowerCase())
      );
    }
    if (filterEmail) {
      filtered = filtered.filter((employee) =>
        employee.email.toLowerCase().includes(filterEmail.toLowerCase())
      );
    }
    if (filterPhoneNumber) {
      filtered = filtered.filter((employee) =>
        employee.phoneNumber
          .toLowerCase()
          .includes(filterPhoneNumber.toLowerCase())
      );
    }

    setFilteredEmployees(filtered);
  };
  useEffect(() => {
    // Automatically apply filters when filter inputs change
    handleFilter();
  }, [filterName, filterEmail, filterPhoneNumber, memoizedEmployees]);
  // Function to clear filters
  const clearFilters = () => {
    setFilterName("");
    setFilterEmail("");
    setFilteredEmployees(employees);
  };
  console.log(employees)
  // Define the page structure and components
  return (
    <AdminLayout>
      <Card>
        <Card.Header>Employees</Card.Header>
        <Card.Body>
          <Form className="mb-3">
            <Row>
              <Col xs={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Filter by Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={filterName}
                    onChange={(e) => setFilterName(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col xs={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Filter by Email</Form.Label>
                  <Form.Control
                    type="text"
                    value={filterEmail}
                    onChange={(e) => setFilterEmail(e.target.value)}
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
            <Button variant="secondary" onClick={clearFilters}>
              Clear Filters
            </Button>
          </Form>

          <Button
            variant="success"
            onClick={() => setShowModal(true)}
            className="mb-3"
          >
            Add Employee
          </Button>

          <Table striped bordered hover>
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone Number</th>
                <th>Address</th>
                <th>Department</th>
                <th>Position</th>
                <th>Salary</th>
                <th>Start Date</th> {/* Add Start Date column */}
              </tr>
            </thead>
            <tbody>
              {memoizedFilteredEmployees.map((employee, index) => (
                <tr key={employee._id} onClick={() => {
                  router.push(`/employees/${employee._id}`); // Push the route
                }}>
                  <td>{index + 1}</td>
                  <td>{employee.name}</td>
                  <td>{employee.email}</td>
                  <td>{employee.phoneNumber}</td>
                  <td>{employee.address}</td>
                  <td>{employee?.department?.name}</td>
                  <td>{employee?.position?.name}</td>
                  <td>{employee.salary}</td>
                  <td>
                    {new Date(employee.startDate).toLocaleDateString()}
                  </td>{" "}
                  {/* Display Start Date */}
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
      <ToastContainer position="top-right" autoClose={3000} />
      <Modal show={showModal} onHide={() => setShowModal(false)} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>Create New Employee</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: "500px", overflowY: "auto" }}>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={newEmployeeData.name}
                onChange={(e) =>
                  setNewEmployeeData({
                    ...newEmployeeData,
                    name: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={newEmployeeData.email}
                onChange={(e) =>
                  setNewEmployeeData({
                    ...newEmployeeData,
                    email: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                type="text"
                value={newEmployeeData.phoneNumber}
                onChange={(e) =>
                  setNewEmployeeData({
                    ...newEmployeeData,
                    phoneNumber: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Address</Form.Label>
              <Form.Control
                type="text"
                value={newEmployeeData.address}
                onChange={(e) =>
                  setNewEmployeeData({
                    ...newEmployeeData,
                    address: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="me-2">Department</Form.Label>
              <div className="d-flex flex-grow-1">
                <Form.Control
                  as="select"
                  name="Department"
                  value={newEmployeeData.department}
                  onChange={(e) =>
                    setNewEmployeeData({
                      ...newEmployeeData,
                      department: e.target.value,
                    })
                  }
                  className="me-2"
                >
                  <option value="" hidden>Select Department</option>
                  {departments.map((department) => (
                    <option key={department._id} value={department._id}>
                      {department.name}
                    </option>
                  ))}
                </Form.Control>
                <Link href={`/departments`} target="_blank">
                  <Button variant="outline-primary"><AddOutlinedIcon /></Button>
                </Link>
              </div>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="me-2">Position</Form.Label>
              <div className="d-flex flex-grow-1">
                <Form.Control
                  as="select"
                  name="position"
                  value={newEmployeeData.position}
                  onChange={(e) =>
                    setNewEmployeeData({
                      ...newEmployeeData,
                      position: e.target.value,
                    })
                  }
                  className="me-2"
                >
                  <option value="" hidden>Select Position</option>
                  {positions.map((position) => (
                    <option key={position._id} value={position._id}>
                      {position.name}
                    </option>
                  ))}
                </Form.Control>
                <Link href={`/positions`} target="_blank">
                  <Button variant="outline-primary" className="d-flex align-items-center">
                    <AddOutlinedIcon />
                  </Button>
                </Link>
              </div>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Salary</Form.Label>
              <Form.Control
                type="text"
                value={newEmployeeData.salary}
                onChange={(e) =>
                  setNewEmployeeData({
                    ...newEmployeeData,
                    salary: e.target.value,
                  })
                }
              />
            </Form.Group>
            {/* Add Date of Birth field */}
            <Form.Group className="mb-3">
              <Form.Label>Date of Birth</Form.Label>
              <Form.Control
                type="date"
                value={newEmployeeData.dateOfBirth}
                onChange={(e) =>
                  setNewEmployeeData({
                    ...newEmployeeData,
                    dateOfBirth: e.target.value,
                  })
                }
              />
            </Form.Group>
            {/* Add Start Date field */}
            <Form.Group className="mb-3">
              <Form.Label>Start Date</Form.Label>
              <Form.Control
                type="date"
                value={newEmployeeData.startDate}
                onChange={(e) =>
                  setNewEmployeeData({
                    ...newEmployeeData,
                    startDate: e.target.value,
                  })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="success" onClick={handleAddEmployee}>
            Add Employee
          </Button>
        </Modal.Footer>
      </Modal>
    </AdminLayout>
  );
};

export default Employees;
