import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  Table,
  Form,
  Modal,
  Accordion,
  Button,
  Row,
  Container,
  Col,
} from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AdminLayout } from "@layout";
import { ClassCard } from "@components/Classes";
import { useRouter } from "next/router";

const StudentProfile = () => {
  const [studentData, setStudentData] = useState({});
  const [batchData, setBatchData] = useState({});
  const [loading, setLoading] = useState(true);
  const [lectures, setLectures] = useState([]);
  const [attendances, setAttendances] = useState([]);
  const router = useRouter();
  const { id } = router.query;
  const [name, setName] = useState(studentData.name);
  const [phoneNumber, setPhoneNumber] = useState(studentData.phoneNumber);
  const [email, setEmail] = useState(studentData.email);
  const [nationalId, setNationalId] = useState(studentData.nationalId);
  const [status, setStatus] = useState(studentData.status);

  // Add state variables for other fields as needed
  const handleSave = async () => {
    try {
      const response = await axios.put(`/api/student/${id}`, {
        name,
        phoneNumber,
        email,
        nationalId,
        status,
        // Include other fields in the request body as needed
      });

      if (response.status === 200) {
        toast.success("Student information updated successfully.", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error("Error updating student data:", error);
      toast.error(
        "Failed to update student information. Please try again later.",
        {
          position: "top-right",
          autoClose: 3000,
        }
      );
    }
  };

  // Function to fetch student data
  const fetchStudentData = async () => {
    try {
      const response = await axios.get(`/api/student/${id}`); // Replace with your actual API endpoint

      if (response.status === 200) {
        console.log(response);
        setStudentData(response.data.students[0]);
      }
    } catch (error) {
      console.error("Error fetching student data:", error);
      toast.error("Failed to fetch student data. Please try again later.", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };
  const fetchBatchData = async () => {
    try {
      const response = await axios.get(`/api/batch/${studentData.batch}/batch`); // Replace with your actual API endpoint for batch data

      if (response.status === 200) {
        console.log(response);
        setBatchData(response.data); // Adjust the response data structure accordingly
      }
    } catch (error) {
      console.error("Error fetching batch data:", error);
      toast.error("Failed to fetch batch data. Please try again later.", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };
  const [batches, setBatches] = useState([]);
  const fetchBatchesData = async () => {
    try {
      const response = await axios.get(`/api/batch`); // Replace with your actual API endpoint for batch data

      if (response.status === 200) {
        console.log(response);
        setBatches(response.data); // Adjust the response data structure accordingly
      }
    } catch (error) {
      console.error("Error fetching batch data:", error);
      toast.error("Failed to fetch batch data. Please try again later.", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };
  const fetchLecturesForBatch = async () => {
    try {
      const response = await axios.get(`/api/batch/${studentData.batch}`); // Replace with your actual API endpoint for batch lectures

      if (response.status === 200) {
        setLectures(response.data);
      }
    } catch (error) {
      console.error("Error fetching batch lectures:", error);
      toast.error("Failed to fetch batch lectures. Please try again later.", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };
  const fetchAttendancesForStudent = async () => {
    try {
      const response = await axios.get(
        `/api/attendance/student-attendances?studentId=${studentData._id}`
      ); // Replace with your actual API endpoint for batch lectures

      if (response.status === 200) {
        console.log(response);
        setAttendances(response.data);
      }
    } catch (error) {
      console.error("Error fetching batch lectures:", error);
      toast.error("Failed to fetch batch lectures. Please try again later.", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };
  useEffect(() => {
    if (id) {
      fetchStudentData();
      {
        studentData.batch && fetchBatchData();
      }
      {
        studentData.batch && fetchLecturesForBatch();
      }
      {
        studentData._id && fetchAttendancesForStudent();
      }
      fetchPlacementTests();
      fetchBatchesData();
    }
  }, [id, studentData.batch, studentData._id, studentData.placementTestDate]);
  function calculateTimeDuration(startTime, endTime) {
    // Split the time strings into hours and minutes
    const [startHour, startMinute] = startTime.split(":");
    const [endHour, endMinute] = endTime.split(":");

    // Convert hours and minutes to numbers
    const startHourNum = parseInt(startHour, 10);
    const startMinuteNum = parseInt(startMinute, 10);
    const endHourNum = parseInt(endHour, 10);
    const endMinuteNum = parseInt(endMinute, 10);

    // Calculate the duration in minutes
    const totalMinutesStart = startHourNum * 60 + startMinuteNum;
    const totalMinutesEnd = endHourNum * 60 + endMinuteNum;
    const duration = totalMinutesEnd - totalMinutesStart;

    return duration;
  }
  const [placementTests, setPlacementTests] = useState([]);

  const [showPlacementTestModal, setShowPlacementTestModal] = useState(false);
  const [selectedPlacementTest, setSelectedPlacementTest] = useState(null);
  const openPlacementTestModal = (student) => {
    setSelectedPlacementTest(null); // Clear the selected placement test
    setShowPlacementTestModal(true);
  };
  const handlePlacementTestSelect = (event) => {
    const testId = event.target.value;
    setSelectedPlacementTest(testId);
  };
  const fetchPlacementTests = async () => {
    try {
      const response = await axios.get("/api/placement_test_settings");
      if (response.status === 200) {
        setPlacementTests(response.data);
      }
    } catch (error) {
      console.error("Error fetching placement tests:", error);
      toast.error("Failed to fetch placement tests. Please try again later.", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const [showBatchModal, setShowBatchModal] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState(studentData.batch);

  // Function to open the batch update modal
  const openBatchModal = () => {
    setShowBatchModal(true);
  };

  // Function to handle the batch update
  const handleBatchUpdate = async () => {
    try {
      // Send a request to update the student's batch with selectedBatch
      const response = await axios.put(`/api/student/${id}`, {
        batch: selectedBatch,
      });

      if (response.status === 200) {
        toast.success("Student's batch updated successfully.", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error("Error updating student's batch:", error);
      toast.error("Failed to update student's batch. Please try again later.", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      // Close the modal and refresh data
      setShowBatchModal(false);
      fetchStudentData(); // You should implement fetchStudentData to update the student's batch data
    }
  };
  return (
    <AdminLayout>
      <div className="row">
        <ClassCard
          data={lectures.length}
          title="Total Lectures"
          enableOptions={false}
          isLoading={loading}
        />
        <ClassCard
          data={`${
            attendances.filter((attendance) => attendance.status === "Attended")
              .length
          } (${(
            (attendances.filter(
              (attendance) => attendance.status === "Attended"
            ).length /
              attendances.length) *
            100
          ).toFixed(2)}%)`}
          title="Total Attendend Lectures"
          enableOptions={false}
          isLoading={loading}
        />
        <ClassCard
          data={`${
            attendances.filter((attendance) => attendance.status === "Absent")
              .length
          } (${(
            (attendances.filter((attendance) => attendance.status === "Absent")
              .length /
              attendances.length) *
            100
          ).toFixed(2)}%)`}
          title="Total Absent Lectures"
          enableOptions={false}
          isLoading={loading}
        />
        <ClassCard
          data={`${
            attendances.filter((attendance) => attendance.status === "Execused")
              .length
          } (${(
            (attendances.filter(
              (attendance) => attendance.status === "Execused"
            ).length /
              attendances.length) *
            100
          ).toFixed(2)}%)`}
          title="Total Execused Lectures"
          enableOptions={false}
          isLoading={loading}
        />
        <ClassCard
          data={`${
            attendances.filter((attendance) => attendance.status === "Late")
              .length
          } (${(
            (attendances.filter((attendance) => attendance.status === "Late")
              .length /
              attendances.length) *
            100
          ).toFixed(2)}%)`}
          title="Total Late Lectures"
          enableOptions={false}
          isLoading={loading}
        />
        <ClassCard
          data={`${
            attendances.filter(
              (attendance) => attendance.status === "Not Assigned"
            ).length
          } (${(
            (attendances.filter(
              (attendance) => attendance.status === "Not Assigned"
            ).length /
              attendances.length) *
            100
          ).toFixed(2)}%)`}
          title="Not Assigned Lectures"
          enableOptions={false}
          isLoading={loading}
        />
      </div>
      <Container className="mt-5">
        <Row className="mb-3">
          <h4 className="text-right">{studentData.name}</h4>
        </Row>
        <Row>
          <Col md={12}>
            <Form.Group controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="First name"
                defaultValue={studentData.name}
              />
            </Form.Group>
          </Col>
          <Col md={12}>
            <Form.Group controlId="phoneNumber">
              <Form.Label>Mobile Number</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter phone number"
                defaultValue={studentData.phoneNumber}
              />
            </Form.Group>
          </Col>
          <Col md={12}>
            <Form.Group controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter email id"
                defaultValue={studentData.email}
              />
            </Form.Group>
          </Col>
          <Col md={12}>
            <Form.Group controlId="nationalId">
              <Form.Label>National Id</Form.Label>
              <Form.Control
                type="text"
                placeholder="National Id"
                defaultValue={studentData.nationalId}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="status">
              <Form.Label>Status</Form.Label>
              <Form.Control
                type="text"
                placeholder="Status"
                defaultValue={studentData.status}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="paid">
              <Form.Label>Paid</Form.Label>
              <Form.Control
                type="text"
                defaultValue={studentData.paid}
                disabled
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="due">
              <Form.Label>Due</Form.Label>
              <Form.Control
                type="text"
                defaultValue={studentData.due}
                disabled
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="level">
              <Form.Label>Level</Form.Label>
              <Form.Control
                type="text"
                defaultValue={studentData.level}
                disabled
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="placementTest">
              <Form.Label>Placement Test</Form.Label>
              <Form.Control
                type="text"
                defaultValue={new Date(
                  studentData.placementTestDate
                ).toLocaleDateString()}
                disabled
              />
            </Form.Group>
          </Col>
        </Row>
        <Row className="mt-3 justify-content-center d-flex">
          <Col>
            <Button
              variant="primary"
              className="profile-button"
              type="button"
              onClick={handleSave}
            >
              Update
            </Button>
          </Col>
          <Col>
            <Button
              variant="primary"
              className="profile-button"
              type="button"
              onClick={openBatchModal}
            >
              Update Batch
            </Button>
          </Col>
          {/* Button to open the batch update modal */}
        </Row>
      </Container>
      <Modal show={showBatchModal} onHide={() => setShowBatchModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Update Student's Batch</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="batchSelect">
            <Form.Label>Select Batch</Form.Label>
            <Form.Control
              as="select"
              value={selectedBatch}
              onChange={(e) => setSelectedBatch(e.target.value)}
            >
              <option value="">Select a batch</option>
              {batches.map((batch) => (
                <option key={batch.id} value={batch._id}>
                  {batch.name}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowBatchModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleBatchUpdate}>
            Update
          </Button>
        </Modal.Footer>
      </Modal>
      <Card className="mt-5">
        <Card.Header>Lectures for {batchData.name}</Card.Header>
        <Card.Body>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Lecture Name</th>
                <th>Date</th>
                <th>Time</th>
                <th>Duration</th>
                <th>Attendance Status</th>
              </tr>
            </thead>
            <tbody>
              {lectures.map((lecture) => {
                // Find the attendance record for this lecture
                const attendanceRecord = attendances.find(
                  (attendance) => attendance.lecture === lecture._id
                );
                const status = attendanceRecord
                  ? attendanceRecord.status
                  : "Not Assigned";

                return (
                  <tr key={lecture._id}>
                    <td>{lecture.name}</td>
                    <td>{new Date(lecture.date).toLocaleDateString()}</td>
                    <td>{`${lecture.weeklyHours.day}: ${lecture.weeklyHours.from} to ${lecture.weeklyHours.to}`}</td>
                    <td>
                      {calculateTimeDuration(
                        lecture.weeklyHours.from,
                        lecture.weeklyHours.to
                      )}{" "}
                      Minutes
                    </td>
                    <td>{status}</td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
      <ToastContainer />
    </AdminLayout>
  );
};

export default StudentProfile;
