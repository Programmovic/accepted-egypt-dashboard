import { useState, useEffect } from "react";
import { Card, Form, Button, Row, Col } from "react-bootstrap";
import axios from "axios";
import { AdminLayout } from "@layout";
import { UserList } from "@components/Users";
import { ClassCard } from "@components/Classes";

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
          setUserResource(response.data);
          setFilteredData(response.data);
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
    if (startDate && endDate) {
      const filteredUsers = userResource.filter((user) => {
        const userDate = new Date(user.dateOfJoin);
        return userDate >= new Date(startDate) && userDate <= new Date(endDate);
      });
      setFilteredData(filteredUsers);
    } else if (startDate) {
      const filteredUsers = userResource.filter((user) => {
        const userDate = new Date(user.dateOfJoin);
        return userDate >= new Date(startDate);
      });
      setFilteredData(filteredUsers);
    } else {
      setFilteredData(userResource);
    }
  };

  const handleDelete = async (id) => {
    // Ask for confirmation before deleting
    const confirmDelete = window.confirm("Are you sure you want to delete this user?");
  
    if (confirmDelete) {
      try {
        await axios.delete(`/api/user/specific_user/${id}`);
        const updatedUsers = userResource.filter((user) => user._id !== id);
        setUserResource(updatedUsers);
        setFilteredData(updatedUsers);
      } catch (error) {
        console.error("Error deleting user:", error);
        setError("Failed to delete user. Please try again later.");
      }
    }
  };
  
  const handleUpdate = async (id, newData) => {
    try {
      await axios.put(`/api/user?id=${id}`, newData);
      const updatedUsers = userResource.map((user) => {
        if (user._id === id) {
          return { ...user, ...newData };
        }
        return user;
      });
      setUserResource(updatedUsers);
      setFilteredData(updatedUsers);
    } catch (error) {
      console.error("Error updating user:", error);
      setError("Failed to update user. Please try again later.");
    }
  };

  return (
    <AdminLayout>
      <div className="row">
        <ClassCard data={filteredData.length} title={"Admins"} enableOptions={false} />
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
            <UserList
              users={filteredData}
              onDelete={handleDelete}
              onUpdate={handleUpdate}
            />
          )}
        </Card.Body>
      </Card>
    </AdminLayout>
  );
};

export default Users;
