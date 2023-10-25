import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Table, Badge } from "react-bootstrap";
import { AdminLayout } from "@layout";
import { useRouter } from "next/router";

const Instructor = () => {
  const [instructorClasses, setInstructorClasses] = useState([]);
  const [instructorBatches, setInstructorBatches] = useState([]);
  const router = useRouter();
  const { id } = router.query;
  const apiUrl = `/api/instructor/classes/${id}`; // Define the API route to fetch instructor's classes

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

  useEffect(() => {
    if (id) {
      fetchInstructorClasses();
      fetchInstructorBatches() // Fetch classes when the instructor ID is available
    }
  }, [id, apiUrl]);

  return (
    <AdminLayout>
      <Card>
        <Card.Header>Batches Taught by Instructor <Badge pill variant="primary" className="me-2">
              {instructorBatches.length}
            </Badge></Card.Header>
        <Card.Body>
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
