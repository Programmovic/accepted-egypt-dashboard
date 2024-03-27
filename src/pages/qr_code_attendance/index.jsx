import { useState, useEffect } from "react";
import { Card, Table } from "react-bootstrap";
import { BarcodeScanner } from "@alzera/react-scanner";
import { AdminLayout } from "@layout";
import axios from "axios";

const AttendancePage = () => {
  const [scannedData, setScannedData] = useState("");
  const [studentData, setStudentData] = useState(null);
  const [attendances, setAttendances] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudentData = async () => {
      if (scannedData) {
        setLoading(true);
        try {
          const response = await axios.get(`/api/student/${scannedData}`);
          if (response.status === 200) {
            setStudentData(response.data.students[0]);
            fetchAttendances(response.data.students[0]._id);
          }
        } catch (error) {
          console.error("Error fetching student data:", error);
          setError("Failed to fetch student data. Please try again later.");
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
        console.log(response)
        if (response.status === 200) {
          setAttendances(response.data);
        }
      } catch (error) {
        console.error("Error fetching attendance data:", error);
        setError("Failed to fetch attendance data. Please try again later.");
      }
    };

    fetchStudentData();
  }, [scannedData]);

  return (
    <AdminLayout>
      <Card>
        <Card.Header>Attendance Page</Card.Header>
        <Card.Body>
          <BarcodeScanner onScan={(data) => data && setScannedData(data)} />
          {loading && <p>Loading student data...</p>}
          {error && <p>{error}</p>}
          {studentData && (
            <div>
              <h4>Student Details:</h4>
              <p>Name: {studentData.name}</p>
              <p>Phone Number: {studentData.phoneNumber}</p>
              <p>Email: {studentData.email}</p>
              {/* Display other student data as needed */}
            </div>
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
                      <td>{new Date(attendance.date).toLocaleDateString()}</td>
                      <td>{attendance.status}</td>
                      <td>{attendance.remarks || "N/A"}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </Card.Body>
      </Card>
    </AdminLayout>
  );
};

export default AttendancePage;
