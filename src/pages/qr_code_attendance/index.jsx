import React, { useState, useEffect } from "react";
import { Card, Table, Button, Modal } from "react-bootstrap";
import { BarcodeScanner } from "@alzera/react-scanner";
import { AdminLayout } from "@layout";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify"; // Importing toastify
import 'react-toastify/dist/ReactToastify.css'; // Importing styles

const AttendancePage = () => {
  const [scannedData, setScannedData] = useState("");
  const [studentData, setStudentData] = useState(null);
  const [attendances, setAttendances] = useState([]);
  const [loading, setLoading] = useState(false);
  const [attendanceError, setAttendanceError] = useState(null);
  const [showModal, setShowModal] = useState(false); // State for modal visibility
  const [studentIdToMark, setStudentIdToMark] = useState(null); // State to hold student ID for marking attendance

  useEffect(() => {
    const fetchStudentData = async () => {
      if (scannedData) {
        setLoading(true);
        try {
          const response = await axios.get(`/api/student/${scannedData}`);
          if (response.status === 200) {
            setStudentData(response.data.student);
            fetchAttendances(response.data.student._id);
            toast.success("Student data fetched successfully!"); // Success toast
          }
        } catch (error) {
          console.error("Error fetching student data:", error);
          toast.error("Failed to fetch student data. Please try again later."); // Error toast
        } finally {
          setLoading(false);
        }
      }
    };

    const fetchAttendances = async (studentId) => {
      try {
        const response = await axios.get(
          `/api/attendance/student-attendances?studentId=${studentId}`
        );
        if (response.status === 200) {
          setAttendances(response.data);
        }
      } catch (error) {
        console.error("Error fetching attendance data:", error);
        toast.error("Failed to fetch attendance data. Please try again later."); // Error toast
      }
    };

    fetchStudentData();
  }, [scannedData]);

  // Function to handle attendance marking
  const handleAttendance = async (studentId) => {
    if (!studentId) return;

    try {
      const response = await axios.put(`/api/qrcode_attendance/${studentId}`);

      if (response.status === 200) {
        // Successfully marked attendance
        
        setAttendances((prev) => [
          ...prev,
          { ...response.data.attendance },
        ]);
        toast.success("Attendance marked successfully!"); // Success toast
      } else {
        // Handle any non-200 responses (e.g., not in attendance window)
        setAttendanceError("Attendance marking not allowed at this time.");
        toast.error("Attendance marking not allowed at this time."); // Error toast
      }
    } catch (error) {
      console.error("Error marking attendance:", error);
      setAttendanceError("Failed to mark attendance. Please try again later.");
      toast.error("Failed to mark attendance. Please try again later."); // Error toast
    }
  };

  const confirmAttendance = () => {
    if (studentIdToMark) {
      handleAttendance(studentIdToMark);
      setShowModal(false); // Close modal after marking attendance
    }
  };

  return (
    <AdminLayout>
      <Card>
        <Card.Header>Attendance Page</Card.Header>
        <Card.Body>
          <BarcodeScanner
            className="barcode-scanner"
            aspectRatio="16/9"
            onScan={(data) => data && setScannedData(data)}
          />
        </Card.Body>
      </Card>
      {studentData && (
        <Card className="mt-4">
          <Card.Header>Student Details</Card.Header>
          <Card.Body>
            {loading && <p>Loading student data...</p>}
            {studentData && (
              <Table striped bordered hover>
                <tbody>
                  <tr>
                    <td>Name:</td>
                    <td>{studentData.name}</td>
                  </tr>
                  <tr>
                    <td>Phone Number:</td>
                    <td>{studentData.phoneNumber}</td>
                  </tr>
                  <tr>
                    <td>Email:</td>
                    <td>{studentData.email}</td>
                  </tr>
                  {/* Add additional rows for other student data */}
                </tbody>
              </Table>
            )}
            {attendances.length > 0 && (
              <div>
                <h4>Attendances:</h4>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Remarks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendances.map((attendance) => (
                      <tr key={attendance._id}>
                        <td>
                          {new Date(attendance.date).toLocaleDateString()}
                        </td>
                        <td>{attendance.status}</td>
                        <td>{attendance.remarks || "N/A"}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            )}
            {attendanceError && <p style={{ color: 'red' }}>{attendanceError}</p>}
            <Button 
              variant="primary" 
              onClick={() => {
                setStudentIdToMark(studentData._id); // Set the student ID
                setShowModal(true); // Show the confirmation modal
              }}
            >
              Mark Attendance
            </Button>
          </Card.Body>
        </Card>
      )}
      <ToastContainer /> {/* Adding the ToastContainer to render the toasts */}

      {/* Confirmation Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Attendance</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to mark attendance for {studentData?.name}?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={confirmAttendance}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </AdminLayout>
  );
};

export default AttendancePage;
