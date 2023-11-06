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
} from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AdminLayout } from "@layout";
import { ClassCard } from "@components/Classes";
import { useRouter } from "next/router";
import Link from "next/link";

const BatchLectures = () => {
  const [batchLectures, setBatchLectures] = useState([]);
  const [batchStudents, setBatchStudents] = useState([]);
  const [batchInstructors, setBatchInstructors] = useState([]); // New state for batch instructors
  const [selectedLecture, setSelectedLecture] = useState(null);
  const [showLectureDetailsModal, setShowLectureDetailsModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { id } = router.query;

  // Function to fetch batch lectures
  const fetchBatchLectures = async () => {
    try {
      const response = await axios.get(`/api/batch/${id}`);

      if (response.status === 200) {
        setBatchLectures(response.data);
      }
    } catch (error) {
      console.error("Error fetching batch lectures:", error);
      toast.error("Failed to fetch batch lectures. Please try again later.", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  // Function to fetch batch students
  const fetchBatchStudents = async () => {
    try {
      const response = await axios.get(`/api/batch/${id}/students`);

      if (response.status === 200) {
        setBatchStudents(response.data);
      }
    } catch (error) {
      console.error("Error fetching batch students:", error);
      toast.error("Failed to fetch batch students. Please try again later.", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  // Function to fetch batch instructors
  const fetchBatchInstructors = async () => {
    try {
      const response = await axios.get(`/api/batch/${id}/instructors`); // Fetch all instructors

      if (response.status === 200) {
        setBatchInstructors(response.data);
      }
    } catch (error) {
      console.error("Error fetching batch instructors:", error);
      toast.error(
        "Failed to fetch batch instructors. Please try again later.",
        {
          position: "top-right",
          autoClose: 3000,
        }
      );
    }
  };

  useEffect(() => {
    if (id) {
      fetchBatchLectures();
      fetchBatchStudents();
      fetchBatchInstructors();
    }
  }, [id]);

  const openLectureDetailsModal = (lecture) => {
    setSelectedLecture(lecture);
    setShowLectureDetailsModal(true);
  };

  // Calculate lecture progress
  const calculateProgress = () => {
    const currentDate = new Date();

    const completedLectures = batchLectures.filter((lecture) => {
      const lectureDate = new Date(lecture.date);
      return lectureDate <= currentDate;
    });

    const remainingLectures = batchLectures.filter((lecture) => {
      const lectureDate = new Date(lecture.date);
      return lectureDate > currentDate;
    });

    const progress = (
      (completedLectures.length / batchLectures.length) *
      100
    ).toFixed(2);
    return {
      progress,
      completed: completedLectures.length,
      remaining: remainingLectures.length,
    };
  };

  const progressInfo = calculateProgress();
  const handleStudentClick = (studentId) => {
    router.push(`/students/${studentId}`);
  };

  return (
    <AdminLayout>
      <Row>
        <ClassCard
          data={batchLectures.length}
          title="Total Batch Lectures"
          enableOptions={false}
          isLoading={loading}
        />
        <ClassCard
          data={`${progressInfo.progress}%`}
          title="Lectures Progress"
          enableOptions={false}
          isLoading={loading}
        />
        <ClassCard
          data={progressInfo.completed}
          title="Completed Lectures"
          enableOptions={false}
          isLoading={loading}
        />
        <ClassCard
          data={progressInfo.remaining}
          title="Remaining Lectures"
          enableOptions={false}
          isLoading={loading}
        />
      </Row>

      <Card>
        <Card.Header>Batch Lectures</Card.Header>
        <Card.Body>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Lecture Name</th>
                <th>Status</th>
                <th>Date</th>
                <th>Time</th>
                <th>Duration</th>
              </tr>
            </thead>
            <tbody>
              {batchLectures.map((lecture) => (
                <tr key={lecture._id}>
                  <td>{lecture.name}</td>
                  <td>{lecture.status}</td>
                  <td>{new Date(lecture.date).toLocaleDateString()}</td>
                  <td>{`${lecture.weeklyHours.day}: ${lecture.weeklyHours.from} to ${lecture.weeklyHours.to}`}</td>
                  <td>{lecture.hours} hours</td>
                  <td>
                    <button
                      className="btn btn-info btn-sm"
                      onClick={() => openLectureDetailsModal(lecture)}
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <Card>
        <Card.Header>Batch Students</Card.Header>
        <Card.Body>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Student Name</th>
                <th>Email</th>
                <th>Phone</th>
              </tr>
            </thead>
            <tbody>
              {batchStudents.map((student) => (
                <tr key={student._id}>
                  <td>
                    <Link href={`/students/${student._id}`}>
                      {student.name}
                    </Link>
                  </td>
                  <td>{student.email}</td>
                  <td>{student.phoneNumber}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <Card>
        <Card.Header>Batch Instructors</Card.Header>
        <Card.Body>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Instructor Name</th>
                <th>Email</th>
                <th>Phone</th>
                {/* Add more instructor-related table headers */}
              </tr>
            </thead>
            <tbody>
              {batchInstructors.map((instructor) => (
                <tr key={instructor._id}>
                  <td>{instructor.name}</td>
                  <td>{instructor.email}</td>
                  <td>{instructor.phoneNumber}</td>
                  {/* Display more instructor details */}
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Lecture Details Modal */}
      <Modal
        show={showLectureDetailsModal}
        onHide={() => setShowLectureDetailsModal(false)}
      >
        <Modal.Header>
          <Modal.Title>Lecture Details</Modal.Title>
        </Modal.Header>
        {selectedLecture && (
          <>
            <Modal.Body>
              <div>
                <p>Lecture Name: {selectedLecture.name}</p>
                <p>Status: {selectedLecture.status}</p>
                <p>Duration: {selectedLecture.hours} hours</p>
                {/* Display more lecture details */}
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Link
                href={`/lectures/${selectedLecture._id}`}
                className="btn btn-success text-decoration-none text-light"
              >
                View Lecture Attendances
              </Link>
            </Modal.Footer>
          </>
        )}
      </Modal>

      <ToastContainer />
    </AdminLayout>
  );
};

export default BatchLectures;
