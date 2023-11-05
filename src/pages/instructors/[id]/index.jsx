import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Table, Badge, Button, Form } from "react-bootstrap";
import { AdminLayout } from "@layout";
import { useRouter } from "next/router";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Instructor = () => {
  const [instructorClasses, setInstructorClasses] = useState([]);
  const [instructorBatches, setInstructorBatches] = useState([]);
  const router = useRouter();
  const { id } = router.query;
  const apiUrl = `/api/instructor/classes/${id}`;
  const [editMode, setEditMode] = useState(false);
  const [instructorData, setInstructorData] = useState({});

  const fetchInstructorClasses = async () => {
    try {
      const response = await axios.get(apiUrl);
      if (response.status === 200) {
        setInstructorClasses(response.data);
      }
    } catch (error) {
      console.error("Error fetching instructor's classes:", error);
    }
  };

  const fetchInstructorBatches = async () => {
    try {
      const response = await axios.get(apiUrl);
      if (response.status === 200) {
        setInstructorBatches(response.data);
      }
    } catch (error) {
      console.error("Error fetching instructor's classes:", error);
    }
  };

  const fetchInstructorData = async () => {
    try {
      const response = await axios.get(`/api/instructor/${id}`);
      if (response.status === 200) {
        setInstructorData(response.data[0]);
      }
    } catch (error) {
      console.error("Error fetching instructor data:", error);
    }
  };

  const updateInstructorData = async () => {
    try {
      const response = await axios.put(`/api/instructor/${id}`, instructorData);
      if (response.status === 200) {
        setEditMode(false);
        fetchInstructorData();
        toast.success("Instructor data updated successfully", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
        });
      }
    } catch (error) {
      console.error("Error updating instructor data:", error);
      toast.error("Failed to update instructor data", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
      });
    }
  };

  useEffect(() => {
    if (id) {
      fetchInstructorData();
      fetchInstructorClasses();
      fetchInstructorBatches();
    }
  }, [id, apiUrl]);

  const deleteInstructor = async () => {
    if (window.confirm("Are you sure you want to delete this instructor?")) {
      try {
        const response = await axios.delete(`/api/instructor/${id}`);
        if (response.status === 204) {
          console.log("Instructor deleted successfully");
          toast.success("Instructor deleted successfully", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
          });
          // Optionally, you can redirect the user after successful deletion
          router.push("/instructors"); // Replace with the appropriate route
        }
      } catch (error) {
        console.error("Error deleting instructor:", error);
        toast.error("Failed to delete instructor", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
        });
      }
    }
  };

  return (
    <AdminLayout>
      <ToastContainer />
      <Card>
        <Card.Header>
          Batches Taught by Instructor{" "}
          <Badge pill variant="primary" className="me-2">
            {instructorBatches.length}
          </Badge>
        </Card.Header>
        <Card.Body>
          {editMode ? (
            <div>
              <Form>
                {/* Edit form fields for instructor data */}
                <Form.Group className="mb-3">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={instructorData.name}
                    onChange={(e) =>
                      setInstructorData({
                        ...instructorData,
                        name: e.target.value,
                      })
                    }
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="text"
                    value={instructorData.email}
                    onChange={(e) =>
                      setInstructorData({
                        ...instructorData,
                        email: e.target.value,
                      })
                    }
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Phone Number</Form.Label>
                  <Form.Control
                    type="text"
                    value={instructorData.phoneNumber}
                    onChange={(e) =>
                      setInstructorData({
                        ...instructorData,
                        phoneNumber: e.target.value,
                      })
                    }
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Joined Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={instructorData.joinedDate}
                    onChange={(e) =>
                      setInstructorData({
                        ...instructorData,
                        joinedDate: e.target.value,
                      })
                    }
                  />
                </Form.Group>
                {/* Add more form fields for other properties */}
              </Form>
              <Button variant="success" onClick={updateInstructorData}>
                Save Changes
              </Button>
              <Button
                variant="danger"
                className="ms-2"
                onClick={deleteInstructor}
              >
                Delete Instructor
              </Button>
            </div>
          ) : (
            <div>
              <Button variant="primary" onClick={() => setEditMode(true)}>
                Edit Instructor
              </Button>
            </div>
          )}
          {instructorClasses.length > 0 && (
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Title</th>
                  <th>Cost (EGP)</th>
                  <th>Created Date</th>
                  <th>Code</th>
                  <th>Description</th>
                  <th>Hours</th>
                </tr>
              </thead>
              <tbody>
                {instructorClasses.map((cls, index) => (
                  <tr key={cls._id}>
                    <td>{index + 1}</td>
                    <td>{cls.name}</td>
                    <td>{cls.cost} EGP</td>
                    <td>{new Date(cls.createdDate).toLocaleDateString()}</td>
                    <td>{cls.code}</td>
                    <td>{cls.description}</td>
                    <td>{cls.hours}</td>
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

export default Instructor;
