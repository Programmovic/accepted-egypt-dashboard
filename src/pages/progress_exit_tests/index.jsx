// Assessments.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Button, Table, Form, Modal } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AdminLayout } from "@layout";
import { useRouter } from "next/router";
import { Loader } from "@components/Loader";

const Assessments = () => {
  const [batches, setBatches] = useState([]);
  const fetchBatches = async () => {
    try {
      const response = await axios.get("/api/batch");

      if (response.status === 200) {
        setBatches(response.data);
      }
    } catch (error) {
      console.error("Error fetching batches:", error);
      toast.error("Failed to fetch batches. Please try again later.", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  useEffect(() => {
    fetchBatches();
  }, []);
  const [assessments, setAssessments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newAssessment, setNewAssessment] = useState({
    assessmentType: "",
    batch: "",
    date: ""
  });
  const handleDateChange = (e) => {
    setNewAssessment({
      ...newAssessment,
      date: e.target.value,
    });
  };
  const fetchAssessmentData = async () => {
    try {
      const response = await axios.get("/api/assessment");

      if (response.status === 200) {
        setAssessments(response.data);
      }
    } catch (error) {
      console.error("Error fetching assessment data:", error);
      toast.error("Failed to fetch assessment data. Please try again later.", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  useEffect(() => {
    fetchAssessmentData();
  }, []);

  const handleAddAssessment = async () => {
    try {
      const response = await axios.post("/api/assessment", newAssessment);

      if (response.status === 201) {
        // Data added successfully
        fetchAssessmentData();
        toast.success("Assessment added successfully!", {
          position: "top-right",
          autoClose: 3000,
        });
        setShowModal(false);
        setNewAssessment({
          assessmentType: "",
          batch: "",
        });
      } else {
        // Handle other possible response status codes here
        console.error("Unexpected status code:", response.status);
      }
    } catch (error) {
      console.error("Error adding assessment:", error);
      toast.error("Failed to add the assessment. Please try again.", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };
  const countTestsInBatch = (batchId) => {
    return assessments.filter((assessment) => assessment.batch === batchId)
      .length;
  };
  const router = useRouter();
  return (
    <AdminLayout>
      <Card>
        <Card.Header>Assessments</Card.Header>
        <Card.Body>
          <Button
            variant="success"
            onClick={() => setShowModal(true)}
            className="mb-3"
          >
            Add Assessment
          </Button>
          <div style={{ overflowX: "auto" }}>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Assessment Type</th>
                  <th>Batch</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {assessments.map((assessment) => {
                  return (
                    <tr key={assessment._id}>
                      <td>{assessment.assessmentType}</td>
                      <td>{assessment?.batch?.name}</td>
                      <td>{assessment?.date}</td>
                      <td>
                        <Button
                          variant="info"
                          onClick={() => {
                            router.push(`/progress_exit_tests/${assessment?.batch?._id}`);
                          }}
                        >
                          Details
                        </Button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>
      <ToastContainer position="top-right" autoClose={3000} />
      {/* Modal for adding a new assessment */}
      <Modal
        show={showModal}
        onHide={() => {
          setShowModal(false);
          setNewAssessment({
            assessmentType: "",
            batch: "",
            date: "",
          });
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Create New Assessment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Assessment Type</Form.Label>
              <Form.Control
                as="select"
                value={newAssessment.assessmentType}
                onChange={(e) =>
                  setNewAssessment({
                    ...newAssessment,
                    assessmentType: e.target.value,
                  })
                }
              >
                <option value="">Select Assessment Type</option>
                <option value="Exit Interview">Exit Interview</option>
                <option value="Progress Test">Progress Test</option>
              </Form.Control>
            </Form.Group>
            <Form.Group className="my-3">
              <Form.Label>Batch</Form.Label>
              <Form.Control
                as="select"
                value={newAssessment.batch}
                onChange={(e) =>
                  setNewAssessment({ ...newAssessment, batch: e.target.value })
                }
              >
                <option value="">Select a batch</option>
                {batches.map((batch) => (
                  <option key={batch._id} value={batch._id}>
                    {batch.name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group className="my-3">
              <Form.Label>Test Date</Form.Label>
              <Form.Control
                type="date"
                value={newAssessment.date}
                onChange={handleDateChange}
              />
            </Form.Group>
            {/* Add other form fields for assessment details */}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              setShowModal(false);
              setNewAssessment({
                assessmentType: "",
                batch: "",
                date: "",
              });
            }}
          >
            Close
          </Button>
          <Button variant="success" onClick={handleAddAssessment}>
            Add Assessment
          </Button>
        </Modal.Footer>
      </Modal>
    </AdminLayout>
  );
};

export default Assessments;
