// Import necessary libraries and components
import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import {
  Badge,
  Button,
  Card,
  Col,
  Form,
  Modal,
  Row,
  Table,
} from "react-bootstrap";
import { AdminLayout } from "@layout";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SalesMembers = () => {
  const [salesMembers, setSalesMembers] = useState([]);
  const [filteredSalesMembers, setFilteredSalesMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterName, setFilterName] = useState("");
  const [filterEmail, setFilterEmail] = useState("");
  const [filterPhoneNumber, setFilterPhoneNumber] = useState("");
  const [showModal, setShowModal] = useState(false);
  // State for new Sales Member creation
  const [newSalesMemberName, setNewSalesMemberName] = useState("");
  const [newSalesMemberEmail, setNewSalesMemberEmail] = useState("");
  const [newSalesMemberPhoneNumber, setNewSalesMemberPhoneNumber] = useState("");

  // Function to fetch Sales Member data
  const fetchSalesMemberData = async () => {
    try {
      const response = await axios.get("/api/sales_member");
      if (response.status === 200) {
        const salesMemberData = response.data;
        setSalesMembers(salesMemberData);
        setFilteredSalesMembers(salesMemberData);
      }
    } catch (error) {
      console.error("Error fetching sales member data:", error);
      setError("Failed to fetch sales member data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchSalesMemberData()
  }, []);
  // Function to add a new Sales Member
  const handleAddSalesMember = async () => {
    try {
      const response = await axios.post("/api/sales_member", {
        name: newSalesMemberName,
        email: newSalesMemberEmail,
        phoneNumber: newSalesMemberPhoneNumber,
      });
      if (response.status === 201) {
        // Data added successfully
        fetchSalesMemberData();
        toast.success("Sales member added successfully!", {
          position: "top-right",
          autoClose: 3000,
        });
        setShowModal(false);
        // Clear the form fields
        setNewSalesMemberName("");
        setNewSalesMemberEmail("");
        setNewSalesMemberPhoneNumber("");
      } else {
        // Handle other possible response status codes here
        console.error("Unexpected status code:", response.status);
      }
    } catch (error) {
      console.error("Error adding sales member:", error);
      setError("Failed to add the sales member. Please try again.");
      toast.error("Failed to add the sales member. Please try again.", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };
  const memoizedSalesMembers = useMemo(() => salesMembers, [salesMembers]);
  const memoizedFilteredSalesMembers = useMemo(() => filteredSalesMembers, [filteredSalesMembers]);

  // Function to apply filters
  const handleFilter = () => {
    let filtered = [...memoizedSalesMembers];

    if (filterName) {
      filtered = filtered.filter((salesMember) =>
        salesMember.name.toLowerCase().includes(filterName.toLowerCase())
      );
    }
    if (filterEmail) {
      filtered = filtered.filter((salesMember) =>
        salesMember.email.toLowerCase().includes(filterEmail.toLowerCase())
      );
    }
    if (filterPhoneNumber) {
      filtered = filtered.filter((salesMember) =>
        salesMember.phoneNumber.toLowerCase().includes(filterPhoneNumber.toLowerCase())
      );
    }

    setFilteredSalesMembers(filtered);
  };
  useEffect(() => {
    // Automatically apply filters when filter inputs change
    handleFilter();
  }, [
    filterName,
    filterEmail,
    filterPhoneNumber,
    memoizedSalesMembers
  ]);
  // Function to clear filters
  const clearFilters = () => {
    setFilterName("");
    setFilterEmail("");
    setFilteredSalesMembers(salesMembers);
  };

  // Define the page structure and components
  return (
    <AdminLayout>
      <Card>
        <Card.Header>Sales Members</Card.Header>
        <Card.Body>
          <Form className="mb-3">
            <Row>
              <Col xs={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Filter by Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={filterName}
                    onChange={(e) => setFilterName(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col xs={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Filter by Email</Form.Label>
                  <Form.Control
                    type="text"
                    value={filterEmail}
                    onChange={(e) => setFilterEmail(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col xs={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Filter by Phone Number</Form.Label>
                  <Form.Control
                    type="text"
                    value={filterPhoneNumber}
                    onChange={(e) => setFilterPhoneNumber(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Button variant="secondary" onClick={clearFilters}>
              Clear Filters
            </Button>
          </Form>

          <Button
            variant="success"
            onClick={() => setShowModal(true)}
            className="mb-3"
          >
            Add Sales Member
          </Button>

          <Table striped bordered hover>
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone Number</th>
              </tr>
            </thead>
            <tbody>
              {memoizedFilteredSalesMembers.map((salesMember, index) => (
                <tr key={salesMember._id}>
                  <td>{index + 1}</td>
                  <td>{salesMember.name}</td>
                  <td>{salesMember.email}</td>
                  <td>{salesMember.phoneNumber}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
      <ToastContainer position="top-right" autoClose={3000} />
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Create New Sales Member</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={newSalesMemberName}
                onChange={(e) => setNewSalesMemberName(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={newSalesMemberEmail}
                onChange={(e) => setNewSalesMemberEmail(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                type="text"
                value={newSalesMemberPhoneNumber}
                onChange={(e) => setNewSalesMemberPhoneNumber(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="success" onClick={handleAddSalesMember}>
            Add Sales Member
          </Button>
        </Modal.Footer>
      </Modal>
    </AdminLayout>
  );
};

export default SalesMembers;
