import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Table, Button, Modal, Form, Pagination } from "react-bootstrap";
import { AdminLayout } from "@layout";
import { useRouter } from "next/router";

const BatchAssessments = () => {
  const [assessments, setAssessments] = useState([]);
  const [batch, setBatch] = useState({});
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [levels, setLevels] = useState([]); // To store levels from /api/level
  const router = useRouter();
  const { id } = router.query;
  const apiUrl = `/api/assessment/batch_assessments?batchId=${id}`;

  useEffect(() => {
    // Fetch levels from /api/level when the component mounts
    axios.get("/api/level").then((response) => {
      if (response.status === 200) {
        setLevels(response.data);
      }
    });
  }, []);

  const fetchAssessments = async () => {
    try {
      const response = await axios.get(apiUrl);
      if (response.status === 200) {
        setAssessments(response.data.assessments);
        setBatch(response.data.batch);
      }
    } catch (error) {
      console.error("Error fetching assessments:", error);
    }
  };

  useEffect(() => {
    if (id) {
      fetchAssessments();
    }
  }, [id, apiUrl]);

  const handleOpenEditModal = (assessment) => {
    setSelectedAssessment(assessment);
    setEditModalVisible(true);
  };

  const handleCloseEditModal = () => {
    setSelectedAssessment(null);
    setEditModalVisible(false);
  };

  const handleSaveEdit = async () => {
    console.log(selectedAssessment);
    // Send the edited assessment data to the server
    try {
      const response = await axios.put(
        `/api/assessment/batch_assessments?assessmentId=${selectedAssessment._id}`,
        selectedAssessment
      );
      if (response.status === 200) {
        // Update your local state with the edited assessment
        const updatedAssessments = assessments.map((assessment) =>
          assessment._id === selectedAssessment._id
            ? selectedAssessment
            : assessment
        );
        setAssessments(updatedAssessments);
        handleCloseEditModal();
      }
    } catch (error) {
      console.error("Error saving edit:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    // If it's a radio input, handle the radio button logic
    if (type === "radio") {
      if (value === "Stay at the same") {
        setSelectedAssessment({
          ...selectedAssessment,
          stayAtTheSame: true,
          movedToHigherLevel: false,
        });
      } else if (value === "Moved to a higher level") {
        setSelectedAssessment({
          ...selectedAssessment,
          stayAtTheSame: false,
          movedToHigherLevel: true,
        });
      }
      if (value === "Show") {
        setSelectedAssessment({
          ...selectedAssessment,
          attendanceStatus: value,
        });
      } else if (value === "No Show") {
        setSelectedAssessment({
          ...selectedAssessment,
          attendanceStatus: value,
        });
      }
    } else {
      // Handle other input fields
      const newValue = type === "checkbox" ? checked : value;
      setSelectedAssessment({
        ...selectedAssessment,
        [name]: newValue,
      });
    }
  };

  console.log(selectedAssessment);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  const totalPageCount = Math.ceil(assessments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedAssessments = assessments.slice(startIndex, endIndex);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };
  return (
    <AdminLayout>
      <Card>
        <Card.Header>Assessments for Batch: {batch.name}</Card.Header>
        <Card.Body>
          <div style={{ overflowX: "auto" }}>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Assessment Type</th>
                  <th>Class Level</th>
                  <th>Class Code</th>
                  <th>Name</th>
                  <th>Phone Number</th>
                  <th>Attendance status</th>
                  <th>Moved to a higher Level</th>
                  <th>Feedback</th>
                  <th>Language Comment</th>
                  <th>Language Feedback</th>
                </tr>
              </thead>
              <tbody>
                {displayedAssessments.map((assessment, index) => (
                  <tr
                    key={assessment._id}
                    onClick={() => handleOpenEditModal(assessment)}
                  >
                    <td>{index + 1}</td>
                    <td>{assessment.assessmentType}</td>
                    <td>{assessment.classLevel}</td>
                    <td>{assessment.classCode}</td>
                    <td>{assessment.name}</td>
                    <td>{assessment.phoneNumber}</td>
                    <td>{assessment.attendanceStatus || "Not Assigned"}</td>
                    <td>{assessment.movedToHigherLevel ? `Yes` : "No"}</td>
                    <td>{assessment.assessmentFeedback || "-"}</td>
                    <td>
                      {assessment?.languageComment
                        ? `${assessment?.languageComment?.slice(0, 30)}...`
                        : "-"}
                    </td>
                    <td>{assessment.languageFeedback || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>
      <Modal show={editModalVisible} onHide={handleCloseEditModal}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Assessment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Attendance status</Form.Label>
              <div>
                <Form.Check
                  type="radio"
                  label="Show"
                  name="attendanceStatus"
                  value="Show"
                  checked={selectedAssessment?.attendanceStatus === "Show"}
                  onChange={handleInputChange}
                />
                <Form.Check
                  type="radio"
                  label="No Show"
                  name="attendanceStatus"
                  value="No Show"
                  checked={selectedAssessment?.attendanceStatus === "No Show"}
                  onChange={handleInputChange}
                />
              </div>
            </Form.Group>

            <Form.Group className="my-3">
              <Form.Label>Assessment feedback</Form.Label>
              <Form.Control
                as="textarea"
                name="assessmentFeedback"
                value={selectedAssessment?.assessmentFeedback}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group className="my-3">
              <Form.Check
                type="radio"
                label="Stay at the same"
                name="levelStatus"
                value="Stay at the same"
                checked={selectedAssessment?.stayAtTheSame}
                onChange={handleInputChange}
              />
              <Form.Check
                type="radio"
                label="Moved to a higher level"
                name="levelStatus"
                value="Moved to a higher level"
                checked={selectedAssessment?.movedToHigherLevel}
                onChange={handleInputChange}
              />
            </Form.Group>

            {selectedAssessment?.movedToHigherLevel && (
              <Form.Group className="my-3">
                <Form.Label>Specify the level</Form.Label>
                <Form.Control
                  as="select"
                  name="newLevel"
                  value={selectedAssessment?.higherLevel}
                  onChange={handleInputChange}
                >
                  <option value="">Select a level</option>
                  {levels.map((level) => (
                    <option key={level._id} value={level.name}>
                      {level.name}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
            )}

            <Form.Group className="my-3">
              <Form.Label>Language comment</Form.Label>
              <Form.Control
                as={"textarea"}
                type="text"
                name="languageComment"
                value={selectedAssessment?.languageComment}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group className="my-3">
              <Form.Label>Language feedback</Form.Label>
              <Form.Control
                type="text"
                name="languageFeedback"
                value={selectedAssessment?.languageFeedback}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseEditModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSaveEdit}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
      <div className="d-flex justify-content-center mt-3">
        <Pagination>
          {[...Array(totalPageCount).keys()].map((page) => (
            <Pagination.Item
              key={page + 1}
              active={page + 1 === currentPage}
              onClick={() => handlePageChange(page + 1)}
            >
              {page + 1}
            </Pagination.Item>
          ))}
        </Pagination>
      </div>
    </AdminLayout>
  );
};

export default BatchAssessments;
