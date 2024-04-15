import React, { useEffect, useState } from "react";
import { AdminLayout } from "@layout";
import { useRouter } from "next/router";
import axios from "axios";
import { Form, Button, Row, Col, Card } from "react-bootstrap";

const RoomEdit = () => {
  const router = useRouter();
  const { id } = router.query;
  const [room, setRoom] = useState({});
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchRoomData(id);
      fetchBranches();
    }
  }, [id]);

  const fetchRoomData = async (roomId) => {
    try {
      const response = await axios.get(`/api/room/${roomId}`);
      setRoom(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching room data:", error);
    }
  };

  const fetchBranches = async () => {
    try {
      const response = await axios.get("/api/branch");
      setBranches(response.data);
    } catch (error) {
      console.error("Error fetching branches:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRoom({ ...room, [name]: value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/room/${id}`, room);
      // Handle success scenario (e.g., show a success message, redirect to a different page)
      router.push("/rooms"); // Example redirection to rooms page
    } catch (error) {
      console.error("Error updating room:", error);
      // Handle error scenario (e.g., show an error message)
    }
  };

  return (
    <AdminLayout>
      <Card>
        <Card.Header as="h5">Edit Room</Card.Header>
        <Card.Body>
          <Form onSubmit={handleFormSubmit}>
            <Row className="mb-3">
              <Form.Group as={Col} controlId="formName">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter room name"
                  name="name"
                  value={room.name}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group as={Col} controlId="formCapacity">
                <Form.Label>Capacity</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter capacity"
                  name="capacity"
                  value={room.capacity}
                  onChange={handleInputChange}
                />
              </Form.Group>
            </Row>
            <Row className="mb-3">
              <Form.Group as={Col} controlId="formFrom">
                <Form.Label>Working Hours From</Form.Label>
                <Form.Control
                  type="time"
                  name="actualWorkingHours.from"
                  value={room?.actualWorkingHours?.from}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group as={Col} controlId="formTo">
                <Form.Label>Working Hours To</Form.Label>
                <Form.Control
                  type="time"
                  name="actualWorkingHours.to"
                  value={room?.actualWorkingHours?.to}
                  onChange={handleInputChange}
                />
              </Form.Group>
            </Row>
            <Form.Group className="mb-3" controlId="formLocation">
              <Form.Label>Location</Form.Label>
              <Form.Control
                as="select"
                name="location"
                value={room.location}
                onChange={handleInputChange}
              >
                <option value="">Select location</option>
                {branches.map((branch) => (
                  <option key={branch._id} value={branch._id}>
                    {branch.name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                placeholder="Enter description"
                name="description"
                value={room.description}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Save Changes
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </AdminLayout>
  );
};

export default RoomEdit;
