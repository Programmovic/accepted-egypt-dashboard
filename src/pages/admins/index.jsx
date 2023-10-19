import { NextPage } from "next";
import { Card, Form, Button, Row, Col } from "react-bootstrap"; // Import Row and Col
import { useEffect, useState } from "react";
import { AdminLayout } from "@layout";
import { UserList } from "@components/Users";
import { ClassCard } from "@components/Classes";
import axios from "axios";

const Users = () => {
  const [userResource, setUserResource] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get("/api/user");
        if (response.status === 200) {
          const userData = response.data;
          setUserResource(userData);
          setFilteredData(userData); // Initialize filteredData with all data
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError("Failed to fetch user data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleFilter = () => {
    // Perform client-side filtering
    if (startDate && endDate) {
      const filteredUsers = userResource.filter((user) => {
        const userDate = new Date(user.dateOfJoin);
        return userDate >= new Date(startDate) && userDate <= new Date(endDate);
      });
      setFilteredData(filteredUsers);
    } else if (startDate) {
      // If only the start date is specified, filter from the start date to the end of time
      const filteredUsers = userResource.filter((user) => {
        const userDate = new Date(user.dateOfJoin);
        return userDate >= new Date(startDate);
      });
      setFilteredData(filteredUsers);
    } else {
      // If no date range is specified, use the original data
      setFilteredData(userResource);
    }
  };

  return (
    <AdminLayout>
      <div className="row">
        <ClassCard data={filteredData.length} title={'Admins'} enableOptions={false}/>
        

        
      </div>
      <Card>
        <Card.Header>Users</Card.Header>
        <Card.Body>
          <Form className="mb-3">
            <Row>
              <Col xs={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Start Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col xs={6}>
                <Form.Group className="mb-3">
                  <Form.Label>End Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Button variant="primary" onClick={handleFilter}>
              Filter
            </Button>
          </Form>
          {loading ? (
            <p>Loading users data...</p>
          ) : error ? (
            <p>{error}</p>
          ) : (
            <UserList users={filteredData} />
          )}
        </Card.Body>
      </Card>
    </AdminLayout>
  );
};

export default Users;
