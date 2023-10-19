import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Card,
  Table,
  Form,
  Button,
  Row,
  Col,
  Badge,
} from "react-bootstrap";
import Select from "react-select";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AdminLayout } from "@layout";

const Students = () => {
  const [students, setStudents] = useState([]);
  const [groups, setGroups] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterName, setFilterName] = useState("");
  const [selectedGroups, setSelectedGroups] = useState([]);
  const [sortBy, setSortBy] = useState("");
  const [sortOrder, setSortOrder] = useState(1);
  const [newStudentName, setNewStudentName] = useState("");

  const fetchStudentData = async () => {
    try {
      const response = await axios.get("/api/student");
      if (response.status === 200) {
        const studentData = response.data;
        setStudents(studentData);
        setFilteredStudents(studentData);
      }
    } catch (error) {
      console.error("Error fetching student data:", error);
      setError("Failed to fetch student data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const fetchGroupData = async () => {
    try {
      const response = await axios.get("/api/group");
      if (response.status === 200) {
        const groupData = response.data;
        setGroups(groupData);
      }
    } catch (error) {
      console.error("Error fetching group data:", error);
      setError("Failed to fetch group data. Please try again later.");
    }
  };

  useEffect(() => {
    fetchStudentData();
    fetchGroupData();
  }, []);

  useEffect(() => {
    // Automatically apply filters when filter inputs change
    handleFilter();
  }, [filterName, selectedGroups, sortBy, sortOrder, students]);

  const handleFilter = () => {
    let filtered = [...students];

    if (filterName) {
      filtered = filtered.filter((student) =>
        student.name.toLowerCase().includes(filterName.toLowerCase())
      );
    }

    if (selectedGroups.length > 0) {
      filtered = filtered.filter((student) =>
        selectedGroups.every((groupId) => student.groups.includes(groupId))
      );
    }

    if (sortBy === "cost") {
      filtered.sort((a, b) => (a.cost - b.cost) * sortOrder);
    } else if (sortBy === "createdDate") {
      filtered.sort(
        (a, b) =>
          (new Date(a.createdDate) - new Date(b.createdDate)) * sortOrder
      );
    }

    setFilteredStudents(filtered);
  };

  const handleSort = (field) => {
    if (field === sortBy) {
      setSortOrder(-sortOrder);
    } else {
      setSortBy(field);
      setSortOrder(1);
    }
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/student", {
        name: newStudentName,
        groups: selectedGroups.map((group) => group.value),
      });
      if (response.status === 201) {
        // Data added successfully
        fetchStudentData();
        setNewStudentName("");
        setSelectedGroups([]);
        toast.success("Student added successfully!", {
          position: "top-right",
          autoClose: 3000,
        });
      } else {
        console.error("Unexpected status code:", response.status);
      }
    } catch (error) {
      console.error("Error adding student:", error);
      setError("Failed to add the student. Please try again.");
      toast.error(error.message, {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const clearFilters = () => {
    setFilterName("");
    setSelectedGroups([]);
    setSortBy("");
    setSortOrder(1);
    setFilteredStudents(students);
  };

  return (
    <AdminLayout>
      <div className="row">
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
                    <Form.Label>Filter by Groups</Form.Label>
                    <Select
                      value={selectedGroups}
                      isMulti={true}
                      options={groups.map((group) => ({
                        value: group._id,
                        label: group.name,
                      }))}
                      onChange={(selectedOptions) => {
                        setSelectedGroups(selectedOptions);
                      }}
                      placeholder="Select one or more groups"
                    />
                  </Form.Group>
                </Col>
                <Col xs={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Sort by</Form.Label>
                    <Form.Control
                      as="select"
                      value={sortBy}
                      onChange={(e) => handleSort(e.target.value)}
                    >
                      <option value="">None</option>
                      <option value="cost">Cost</option>
                      <option value="createdDate">Created Date</option>
                    </Form.Control>
                  </Form.Group>
                </Col>
              </Row>
              <Button variant="secondary" onClick={clearFilters}>
                Clear Filters
              </Button>
            </Form>

            <Form className="mb-3" onSubmit={handleAddStudent}>
              <Row>
                <Col xs={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Student Name</Form.Label>
                    <Form.Control
                      type="text"
                      value={newStudentName}
                      onChange={(e) => setNewStudentName(e.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col xs={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Groups</Form.Label>
                    <Select
                      value={selectedGroups}
                      isMulti={true}
                      options={groups.map((group) => ({
                        value: group._id,
                        label: group.name,
                      }))}
                      onChange={(selectedOptions) => {
                        setSelectedGroups(selectedOptions);
                      }}
                      placeholder="Select one or more groups"
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Button variant="success" type="submit">
                Add Student
              </Button>
            </Form>

            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Groups</th>
                  <th>Cost</th>
                  <th>Created Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student, index) => (
                  <tr key={student._id}>
                    <td>{index + 1}</td>
                    <td>{student.name}</td>
                    <td>
                      {student.groups.map((groupId) => {
                        const group = groups.find((g) => g._id === groupId);
                        return group ? (
                          <Badge key={group._id} pill variant="primary">
                            {group.name}
                          </Badge>
                        ) : null;
                      })}
                    </td>
                    <td>{student.cost}</td>
                    <td>
                      {new Date(student.createdDate).toLocaleDateString()}
                    </td>
                    <td>
                      {/* Add edit and delete buttons */}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </AdminLayout>
  );
};

export default Students;
