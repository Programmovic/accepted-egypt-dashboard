// Import necessary components and libraries
import { useState, useEffect } from "react";
import { Card, Form, Button, Row, Col, Table, Modal } from "react-bootstrap";
import { AdminLayout } from "@layout";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Create a functional component for managing branches
const Branches = () => {
  // Define state variables
  const [branchResource, setBranchResource] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newBranchData, setNewBranchData] = useState({
    name: "",
    location: "",
    address: "",
    phoneNumber: "",
    email: "",
    manager: "", // Assuming manager is a string field for simplicity
  });
  const [filterName, setFilterName] = useState("");
  const [filterLocation, setFilterLocation] = useState("");

  // Function to fetch branch data from the API
  const fetchBranchData = async () => {
    try {
      const response = await axios.get("/api/branch");
      if (response.status === 200) {
        const branchData = response.data;
        setBranchResource(branchData);
        setFilteredData(branchData);
      }
    } catch (error) {
      console.error("Error fetching branch data:", error);
      setError("Failed to fetch branch data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };
  const [managers, setManagers] = useState([]);

  const fetchManagers = async () => {
    try {
      const response = await axios.get("/api/employee");
      if (response.status === 200) {
        setManagers(response.data);
      }
    } catch (error) {
      console.error("Error fetching managers:", error);
      toast.error("Failed to fetch managers.");
    }
  };

  useEffect(() => {
    fetchBranchData();
    fetchManagers();
  }, []);

  // Function to handle opening the modal for adding a new branch
  const handleShowModal = () => setShowModal(true);

  // Function to handle closing the modal for adding a new branch
  const handleCloseModal = () => setShowModal(false);

  // Function to handle input changes in the modal form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewBranchData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Function to handle submitting the form and adding a new branch
  const handleAddBranch = async () => {
    try {
      // Make a POST request to the API to add a new branch
      const response = await axios.post("/api/branch", newBranchData);
      if (response.status === 201) {
        // If successful, display a success toast
        toast.success("Branch added successfully!");
        // Close the modal and fetch updated branch data
        handleCloseModal();
        fetchBranchData();
      }
    } catch (error) {
      console.error("Error adding branch:", error);
      // If an error occurs, display an error toast
      toast.error("Failed to add the branch. Please try again.");
    }
  };

  // Function to handle applying filters
  const handleFilter = () => {
    let filteredBranches = [...branchResource];

    if (filterName) {
      filteredBranches = filteredBranches.filter((branch) =>
        branch.name.toLowerCase().includes(filterName.toLowerCase())
      );
    }

    if (filterLocation) {
      filteredBranches = filteredBranches.filter((branch) =>
        branch.location.toLowerCase().includes(filterLocation.toLowerCase())
      );
    }

    setFilteredData(filteredBranches);
  };

  // JSX for rendering the component
  return (
    <AdminLayout>
      <ToastContainer />
      {/* Modal for adding a new branch */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Branch</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Form for adding a new branch */}
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={newBranchData.name}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Location</Form.Label>
              <Form.Control
                type="text"
                name="location"
                value={newBranchData.location}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Address</Form.Label>
              <Form.Control
                type="text"
                name="address"
                value={newBranchData.address}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                type="text"
                name="phoneNumber"
                value={newBranchData.phoneNumber}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={newBranchData.email}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Manager</Form.Label>
              <Form.Control
                as="select"
                name="manager"
                value={newBranchData.manager}
                onChange={handleInputChange}
              >
                <option value="">Select Manager</option>
                {managers.map((manager) => (
                  <option key={manager._id} value={manager._id}>{manager.name}</option>
                ))}
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleAddBranch}>
            Add Branch
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Display branch data in a table */}
      <Card>
        <Card.Header>Branches</Card.Header>
        <Card.Body>
          {/* Form for applying filters */}
          <Form>
            <Row>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Filter by Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={filterName}
                    onChange={(e) => setFilterName(e.target.value)}
                    onKeyUp={handleFilter}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Filter by Location</Form.Label>
                  <Form.Control
                    type="text"
                    value={filterLocation}
                    onChange={(e) => setFilterLocation(e.target.value)}
                    onKeyUp={handleFilter}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Form>
          {/* Button to add a new branch */}
          <Button variant="primary" onClick={handleShowModal} className="mb-3">
            Add New Branch
          </Button>
          {/* Table to display branch data */}
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Location</th>
                <th>Address</th>
                <th>Phone Number</th>
                <th>Email</th>
                <th>Manager</th>
              </tr>
            </thead>
            <tbody>
              {/* Map through the filtered branch data and display each branch */}
              {filteredData.map((branch, index) => (
                <tr key={branch._id}>
                  <td>{index + 1}</td>
                  <td>{branch.name}</td>
                  <td>{branch.location}</td>
                  <td>{branch.address}</td>
                  <td>{branch.phoneNumber}</td>
                  <td>{branch.email}</td>
                  <td>{branch?.manager.name}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </AdminLayout>
  );
};

// Export the Branches component
export default Branches;
