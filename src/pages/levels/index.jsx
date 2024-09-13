import React, { useState, useEffect } from "react";
import { Card, Form, Button, Row, Col, Table, Modal } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { AdminLayout } from "@layout";

const Levels = () => {
  const [levelResource, setLevelResource] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterName, setFilterName] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [newLevelName, setNewLevelName] = useState("");
  const [newLevelCode, setNewLevelCode] = useState("");
  const [newLevelPrice, setNewLevelPrice] = useState("");

  const fetchLevelData = async () => {
    try {
      const response = await axios.get("/api/level");
      if (response.status === 200) {
        const levels = response.data;
        setLevelResource(levels);
        setFilteredData(levels);
      }
    } catch (error) {
      console.error("Error fetching level data:", error);
      setError("Failed to fetch level data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLevelData();
  }, []);

  useEffect(() => {
    // Automatically apply filters when filter inputs change
    handleFilter();
  }, [filterName, levelResource]);

  const handleFilter = () => {
    let filteredLevels = [...levelResource];

    if (filterName) {
      filteredLevels = filteredLevels.filter((level) =>
        level.name.toLowerCase().includes(filterName.toLowerCase())
      );
    }

    setFilteredData(filteredLevels);
  };

  const openModal = () => setShowModal(true);
  const closeModal = () => {
    setShowModal(false);
    setFilterName("");
    setNewLevelName("");
  };

  const handleAddLevel = async () => {
    try {
      // Send a POST request to your API to create a new level
      const response = await axios.post("/api/level", {
        name: newLevelName,
        code: newLevelCode,
        price: +newLevelPrice,
      });

      if (response.status === 201) {
        closeModal();
        fetchLevelData(); // Refresh the level list
        toast.success("Level added successfully!"); // Success toast
      } else {
        toast.error("Failed to add the level. Please try again."); // Error toast
      }
    } catch (error) {
      console.error("Error adding level:", error);
      toast.error("Failed to add the level. Please try again."); // Error toast
    }
  };

  return (
    <AdminLayout>
      <ToastContainer />

      <Modal show={showModal} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>Create New Level</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={newLevelName}
                onChange={(e) => setNewLevelName(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Code</Form.Label>
              <Form.Control
                type="text"
                value={newLevelCode}
                onChange={(e) => setNewLevelCode(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="text"
                value={newLevelPrice}
                onChange={(e) => setNewLevelPrice(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Close
          </Button>
          <Button variant="success" onClick={handleAddLevel}>
            Add New Level
          </Button>
        </Modal.Footer>
      </Modal>

      <Card>
        <Card.Header>Levels</Card.Header>
        <Card.Body>
          <Form className="mb-3">
            <Row>
              <Col xs={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Filter by Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={filterName}
                    onChange={(e) => setFilterName(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col xs={6}>
                <Button variant="secondary" onClick={() => setFilterName("")}>
                  Clear Filters
                </Button>
              </Col>
              <Col xs={6}>
                <Button variant="success" onClick={openModal}>
                  Add New Level
                </Button>
              </Col>
            </Row>
          </Form>

          {loading ? (
            <p>Loading levels...</p>
          ) : error ? (
            <p>{error}</p>
          ) : (
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Class Level</th>
                  <th>Level Code</th>
                  <th>Level Price</th>
                  <th>Number of batches</th>
                  <th>Batch codes</th>
                  <th>Number of students</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((level) => (
                  <tr key={level._id}>
                    <td>{level.name}</td>
                    <td>{level.code}</td>
                    <td>{level.price}</td>
                    <td>{level.batchCount}</td>
                    <td>{level.batchCodes.join(", ") || '-'}</td>
                    <td>{level.studentCount}</td>
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

export default Levels;
