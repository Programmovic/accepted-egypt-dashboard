import { useEffect, useState } from "react";
import axios from "axios";
import { AdminLayout } from "@layout";
import { Table, Modal, Card } from "react-bootstrap";

const StudentsWithDue = () => {
  const [studentsWithDue, setStudentsWithDue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStudentsWithDue = async () => {
    try {
      const response = await axios.get("/api/student");
      if (response.status === 200) {
        const studentsData = response.data.students;
        const studentsWithDue = studentsData.filter((student) => student.due > 0);
        setStudentsWithDue(studentsWithDue);
      }
    } catch (error) {
      console.error("Error fetching students with due amounts:", error);
      setError("Failed to fetch students with due amounts. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudentsWithDue();
  }, []);

  return (
    <AdminLayout>
      <Card>
        <Card.Header>Students With Due Amount</Card.Header>
        <Card.Body>
      {loading ? (
        <p>Loading students...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Phone Number</th>
                <th>Email</th>
                <th>National ID</th>
                <th>Interested In Course</th>
                <th>Status</th>
                <th>Paid</th>
                <th>Level</th>
                <th>Due</th>
              </tr>
            </thead>
            <tbody>
              {studentsWithDue.map((student, index) => (
                <tr key={student._id}>
                  <td>{index + 1}</td>
                  <td>{student.name}</td>
                  <td>{student.phoneNumber}</td>
                  <td>{student.email || "N/A"}</td>
                  <td>{student.nationalId || "N/A"}</td>
                  <td>{student.interestedInCourse || "N/A"}</td>
                  <td>{student.status}</td>
                  <td>{student.paid} EGP</td>
                  <td>{student.level || "N/A"}</td>
                  <td>{student.due} EGP</td>
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

export default StudentsWithDue;
