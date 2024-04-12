import { useState, useEffect, useRef } from "react";
import { Card, Form, Button, Row, Col, Modal, Table, Badge } from "react-bootstrap";
import axios from "axios";
import { AdminLayout } from "@layout";
import { useRouter } from "next/router"; // Import useRouter from next/router
import { useQRCode } from "next-qrcode";
import { DownloadTableExcel } from "react-export-table-to-excel";
import { faFile } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Laptops = () => {
  const router = useRouter(); // Initialize useRouter
  const { Canvas } = useQRCode(); // Destructure Canvas from useQRCode
  const laptopsTable = useRef(null)
  const [laptops, setLaptops] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [brandFilter, setBrandFilter] = useState("");
  const [modelFilter, setModelFilter] = useState("");
  const [assignedToFilter, setAssignedToFilter] = useState("");
  const [assignedDateFilter, setAssignedDateFilter] = useState("");
  const [brandModal, setBrandModal] = useState("");
  const [modelModal, setModelModal] = useState("");
  const [assignedToModal, setAssignedToModal] = useState("");
  const [assignedDateModal, setAssignedDateModal] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [brands, setBrands] = useState([
    "Apple",
    "Lenovo",
    "Dell",
    "HP",
    "Asus",
    "Acer",
    "Microsoft",
    "Samsung",
    "Toshiba",
    "Sony",
    "MSI",
  ]);
  const [sortByCreatedAt, setSortByCreatedAt] = useState({
    order: "desc", // Default sorting order
    checked: false, // Initial checkbox state
  });

  const fetchLaptopsData = async () => {
    try {
      const response = await axios.get("/api/laptops");
      if (response.status === 200) {
        const laptopsData = response.data;
        setLaptops(laptopsData);
      }
    } catch (error) {
      console.error("Error fetching laptop data:", error);
      setError("Failed to fetch laptop data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const fetchInstructorsData = async () => {
    try {
      const response = await axios.get("/api/instructor");
      if (response.status === 200) {
        const instructorsData = response.data;
        setInstructors(instructorsData);
      }
    } catch (error) {
      console.error("Error fetching instructor data:", error);
      setError("Failed to fetch instructor data. Please try again later.");
    }
  };

  useEffect(() => {
    fetchLaptopsData();
    fetchInstructorsData();
  }, []);

  const handleAddLaptop = async () => {
    try {
      const response = await axios.post("/api/laptops", {
        brand: brandModal,
        model: modelModal,
        assignedTo: assignedToModal || null,
        assignedDate: assignedDateModal || null,
      });
      if (response.status === 201) {
        setLaptops([...laptops, response.data]);
        setBrandModal("");
        setModelModal("");
        setAssignedToModal("");
        setAssignedDateModal("");
        setShowModal(false);
        fetchLaptopsData();
        fetchInstructorsData();
      }
    } catch (error) {
      console.error("Error adding laptop:", error);
      setError("Failed to add laptop. Please try again later.");
    }
  };

  const handleDeleteAllLaptops = async () => {
    // Prompt user to confirm deletion
    const userConfirmed = window.confirm("Are you sure you want to delete all laptops?");
  
    if (!userConfirmed) {
      return; // If user cancels, exit the function without deleting
    }
  
    try {
      const response = await axios.delete("/api/laptops");
      if (response.status === 204) {
        setLaptops([]); // Clear laptops list if deletion is successful
      }
    } catch (error) {
      console.error("Error deleting all laptops:", error);
      setError("Failed to delete all laptops. Please try again later.");
    }
  };
  
  const handleSortByCreatedAt = () => {
    // Toggle the sorting order
    const newOrder = sortByCreatedAt.order === "asc" ? "desc" : "asc";
    setSortByCreatedAt({ order: newOrder, checked: !sortByCreatedAt.checked });
  };

  const handleRowClick = (laptopId) => {
    // Navigate to the laptop's page using router.push
    router.push(`/inventory/laptops/${laptopId}`);
  };

  return (
    <AdminLayout>
      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center">
          Laptops{" "}
          <DownloadTableExcel
            filename="Laptops Summary"
            sheet="LaptopsSummary"
            currentTableRef={laptopsTable.current}
          >
            <Button variant="outline-light" className="fw-bold">
              <FontAwesomeIcon icon={faFile} className="me-1" />
              Export
            </Button>
          </DownloadTableExcel>
        </Card.Header>
        <Card.Body>
          <Form className="mb-3">
            <Row>
              <Col xs={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Brand</Form.Label>
                  <Form.Control
                    as="select"
                    value={brandFilter}
                    onChange={(e) => setBrandFilter(e.target.value)}
                  >
                    <option value="">All Brands</option>
                    {brands.map((brand) => (
                      <option key={brand} value={brand}>
                        {brand}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col xs={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Model</Form.Label>
                  <Form.Control
                    type="text"
                    value={modelFilter}
                    onChange={(e) => setModelFilter(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col xs={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Assigned To</Form.Label>
                  <Form.Control
                    type="text"
                    value={assignedToFilter}
                    onChange={(e) => setAssignedToFilter(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col xs={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Assigned Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={assignedDateFilter}
                    onChange={(e) => setAssignedDateFilter(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>
            <div className="mb-3">
            <Form.Check
                type="checkbox"
                id="sortCheckbox"
                label="Sort"
                checked={sortByCreatedAt.checked}
                onChange={handleSortByCreatedAt}
              />
              <Button
                variant="outline-primary"
                className="me-3"
                onClick={() => setShowModal(true)}
              >
                Add Laptop
              </Button>
              <Button variant="outline-danger" onClick={handleDeleteAllLaptops}>
                Delete All Laptops
              </Button>
              
            </div>
          </Form>
          {loading ? (
            <p>Loading laptops data...</p>
          ) : error ? (
            <p>{error}</p>
          ) : (
            <Table striped bordered hover ref={laptopsTable}>
              <thead>
                <tr>
                  <th>Brand</th>
                  <th>Model</th>
                  <th>Assigned To</th>
                  <th>Assigned Date</th>
                  <th>Status</th>
                  <th>QR Code</th>
                </tr>
              </thead>
              <tbody>
                {laptops
                  .filter((laptop) =>
                    (brandFilter === "" ||
                      laptop.brand.toLowerCase() === brandFilter.toLowerCase()) &&
                    laptop.model.toLowerCase().includes(modelFilter.toLowerCase()) &&
                    // Include laptops where assignedTo is empty or matches the filter
                    (!assignedToFilter || !laptop.assignedTo || laptop.assignedTo.name.toLowerCase().includes(assignedToFilter.toLowerCase())) &&
                    // Include laptops where assignedDate is empty or matches the filter
                    (!assignedDateFilter || laptop.assignedDate.includes(assignedDateFilter))
                  )
                  // Sort by createdAt if checked
                  .sort((a, b) => {
                    if (sortByCreatedAt.checked) {
                      if (sortByCreatedAt.order === "asc") {
                        return new Date(a.createdAt) - new Date(b.createdAt);
                      } else {
                        return new Date(b.createdAt) - new Date(a.createdAt);
                      }
                    } else {
                      // If not checked, maintain the original order
                      return 0;
                    }
                  })
                  .map((laptop) => (
                    <tr key={laptop._id} onClick={() => handleRowClick(laptop._id)}>
                      <td className="align-middle">{laptop.brand}</td>
                      <td className="align-middle">{laptop.model}</td>
                      <td className="align-middle">{laptop.assignedTo ? laptop.assignedTo.name : 'N/A'}</td>
                      <td className="align-middle">{laptop.assignedDate ? new Date(laptop.assignedDate).toLocaleString() : 'N/A'}</td>
                      <td className="align-middle text-center">
                        {laptop.assignedTo ? (
                          <Badge bg="success">Assigned</Badge>
                        ) : (
                          <Badge bg="danger">Not Assigned</Badge>
                        )}
                      </td>
                      {/* QR Code column */}
                      <td className="text-center">
                        <Canvas
                          text={JSON.stringify({
                            SerialNumber: laptop._id,
                            Brand: laptop.brand,
                            Model: laptop.model,
                            AssignedTo: laptop.assignedTo ? laptop.assignedTo.name : 'N/A',
                            AssignedDate: laptop.assignedDate || 'N/A',
                          })}
                          options={{
                            errorCorrectionLevel: "M",
                            margin: 1,
                            scale: 10,
                            width: 150,
                            color: {
                              dark: "#000",
                              light: "#fff",
                            },
                          }}
                        />
                      </td>
                    </tr>
                  ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Laptop</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Brand</Form.Label>
              <Form.Control
                as="select"
                value={brandModal}
                onChange={(e) => setBrandModal(e.target.value)}
              >
                <option value="">Select Brand</option>
                {brands.map((brand) => (
                  <option key={brand} value={brand}>
                    {brand}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Model</Form.Label>
              <Form.Control
                type="text"
                value={modelModal}
                onChange={(e) => setModelModal(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Assigned To</Form.Label>
              <Form.Control
                as="select"
                value={assignedToModal}
                onChange={(e) => setAssignedToModal(e.target.value)}
              >
                <option value="">Select Instructor</option>
                {instructors.map((instructor) => (
                  <option key={instructor._id} value={instructor._id}>
                    {instructor.name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Assigned Date</Form.Label>
              <Form.Control
                type="date"
                value={assignedDateModal}
                onChange={(e) => setAssignedDateModal(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAddLaptop}>
            Add
          </Button>
        </Modal.Footer>
      </Modal>
    </AdminLayout>
  );
};

export default Laptops;
