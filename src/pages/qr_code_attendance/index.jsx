import { useState, useEffect } from "react";
import { Card } from "react-bootstrap";
import { BarcodeScanner } from "@alzera/react-scanner";
import { AdminLayout } from "@layout";
import axios from "axios";

const AttendancePage = () => {
  const [scannedData, setScannedData] = useState("");
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudentData = async () => {
      if (scannedData) {
        setLoading(true);
        try {
          const response = await axios.get(`/api/student/${scannedData}`);
          console.log(response)
          if (response.status === 200) {
            setStudentData(response.data.students[0]);
          }
        } catch (error) {
          console.error("Error fetching student data:", error);
          setError("Failed to fetch student data. Please try again later.");
        } finally {
          setLoading(false);
        }
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
        </Card.Body>
      </Card>
    </AdminLayout>
  );
};

export default AttendancePage;
