import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Table, Button, Row, Modal, Form } from "react-bootstrap";
import { AdminLayout } from "@layout";
import { useRouter } from "next/router";

const PlacementTests = () => {
  const [students, setStudents] = useState([]);
  const [placementTest, setPlacementTest] = useState([]);
  const router = useRouter();
  const { id } = router.query;
  const apiUrl = `/api/placement_test_settings/${id}`;

  const fetchStudentData = async () => {
    try {
      const response = await axios.get(apiUrl);
      console.log(response);
      if (response.status === 200) {
        setStudents(response.data.students);
        setPlacementTest(response.data.placementTestSettings);
      }
    } catch (error) {
      console.error("Error fetching student data:", error);
    }
  };

  useEffect(() => {
    fetchStudentData();
  }, [apiUrl]);
  const handleDeleteTest = async (testId) => {
    try {
      // Send a DELETE request to your API to delete the placement test
      const response = await axios.delete(`/api/placement_tests_settings/${testId}`);
      if (response.status === 200) {
        // Update the students list to reflect the deleted test
        setStudents(students.filter((student) => student._id !== testId));
      }
    } catch (error) {
      console.error("Error deleting test:", error);
    }
  };
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingTest, setEditingTest] = useState(null);

  const handleEditChange = (e, fieldName) => {
    const updatedValue = e.target.value;

    // Create a copy of the current editingTest object and update the specific field
    const updatedTest = { ...editingTest, [fieldName]: updatedValue };

    // Update the editingTest state with the new data
    setEditingTest(updatedTest);
  };

  // Function to open the edit modal
  const openEditModal = (test) => {
    setEditingTest(test);
    setEditModalVisible(true);
  };

  // Function to close the edit modal
  const closeEditModal = () => {
    setEditingTest(null);
    setEditModalVisible(false);
  };
  const handleSaveEdit = async () => {
    if (editingTest) {
      try {
        // Create an object with the updated data
        const updatedTest = {
          cost: editingTest.cost, // Add other properties here
          // Include other properties you want to update
        };

        // Send a PUT or PATCH request to update the placement test
        const response = await axios.put(
          `/api/placement_tests/${editingTest._id}`,
          updatedTest
        );

        if (response.status === 200) {
          // Update the students list to reflect the edited test
          setStudents((prevStudents) =>
            prevStudents.map((student) =>
              student._id === editingTest._id
                ? { ...student, ...updatedTest }
                : student
            )
          );

          // Close the edit modal
          closeEditModal();
        }
      } catch (error) {
        console.error("Error saving edit:", error);
      }
    }
  };
  console.log(placementTest);
  return (
    <AdminLayout>
      <Card>
        <Card.Header>Student List</Card.Header>
        <Card.Body>
          <Row className="m-3 justify-content-between">
            <Button
              variant="danger"
              onClick={() => handleDeleteTest(id)}
              className="w-auto"
            >
              Delete
            </Button>
            <Button
              variant="warning"
              onClick={() => openEditModal(placementTest)}
              className="w-auto"
            >
              Edit
            </Button>
          </Row>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Phone Number</th>
                <th>Email</th>
                <th>National ID</th>
                <th>Interested Course</th>
                <th>Status</th>
                <th>Paid</th>
                <th>Level</th>
                <th>Waiting List</th>
                <th>Placement Test Date</th>
                <th>Due</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student, index) => (
                <tr key={student._id}>
                  <td>{index + 1}</td>
                  <td>{student.name}</td>
                  <td>{student.phoneNumber}</td>
                  <td>{student.email}</td>
                  <td>{student.nationalId}</td>
                  <td>{student.interestedInCourse}</td>
                  <td>{student.status}</td>
                  <td>{student.paid}</td>
                  <td>{student.level}</td>
                  <td>{student.waitingList}</td>
                  <td>
                    {new Date(student.placementTestDate).toLocaleDateString()}
                  </td>
                  <td>{student.due}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
      <Modal show={editModalVisible} onHide={closeEditModal}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Placement Test</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Add a form here to edit the test information */}
          {editingTest && (
            <Form>
              <Form.Group controlId="formCost">
                <Form.Label>Cost</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter cost"
                  value={editingTest.cost}
                  onChange={(e) => handleEditChange(e, "cost")}
                />
              </Form.Group>

              <Form.Group controlId="formInstructions">
                <Form.Label>Instructions</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Enter instructions"
                  value={editingTest.instructions}
                  onChange={(e) => handleEditChange(e, "instructions")}
                />
              </Form.Group>

              <Form.Group controlId="formDate">
                <Form.Label>Date</Form.Label>
                <Form.Control
                  type="date"
                  placeholder="Select date"
                  value={editingTest.date}
                  onChange={(e) => handleEditChange(e, "date")}
                />
              </Form.Group>

              {/* Add input fields for other fields like room, instructor, createdByAdmin, adminName, etc. */}
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeEditModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSaveEdit}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </AdminLayout>
  );
};

export default PlacementTests;
