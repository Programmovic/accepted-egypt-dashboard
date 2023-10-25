import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Table } from "react-bootstrap";
import { AdminLayout } from "@layout";
import { useRouter } from "next/router";

const PlacementTests = () => {
  const [students, setStudents] = useState([]);
  const router = useRouter();
  const { id } = router.query;
  const apiUrl = `/api/placement_test_settings/${id}`;

  const fetchStudentData = async () => {
    try {
      const response = await axios.get(apiUrl);
      if (response.status === 200) {
        setStudents(response.data);
      }
    } catch (error) {
      console.error("Error fetching student data:", error);
    }
  };

  useEffect(() => {
    fetchStudentData();
  }, [apiUrl]);

  return (
    <AdminLayout>
      <Card>
        <Card.Header>Student List</Card.Header>
        <Card.Body>
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
                  <td>{new Date(student.placementTestDate).toLocaleDateString()}</td>
                  <td>{student.due}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </AdminLayout>
  );
};

export default PlacementTests;
