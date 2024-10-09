import { useState, useEffect, useRef } from "react";
import { Card, Form, Button, Row, Col, Modal, Table, Tabs, Tab, Badge } from "react-bootstrap";
import axios from "axios";
import { AdminLayout } from "@layout";
import { useRouter } from "next/router";
import { useQRCode } from "next-qrcode";
import { DownloadTableExcel } from "react-export-table-to-excel";
import { faFile, faPrint } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Inventory = () => {
  const router = useRouter(); // Initialize useRouter
  const { Canvas } = useQRCode(); // Destructure Canvas from useQRCode
  const inventoryTable = useRef(null);
  const [items, setItems] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [itemTypeFilter, setItemTypeFilter] = useState(""); // Adjust filters based on your API schema
  const [itemNameFilter, setItemNameFilter] = useState(""); // Adjust filters based on your API schema
  const [assignedToFilter, setAssignedToFilter] = useState(""); // Adjust filters based on your API schema
  const [assignedDateFilter, setAssignedDateFilter] = useState(""); // Adjust filters based on your API schema
  const [itemTypeModal, setItemTypeModal] = useState(""); // Adjust modal state based on your API schema
  const [itemNameModal, setItemNameModal] = useState(""); // Adjust modal state based on your API schema
  const [itemDescriptionModal, setItemDescriptionModal] = useState(""); // Adjust modal state based on your API schema
  const [assignedToModal, setAssignedToModal] = useState(""); // Adjust modal state based on your API schema
  const [assignedDateModal, setAssignedDateModal] = useState(""); // Adjust modal state based on your API schema
  const [showModal, setShowModal] = useState(false);
  const [itemTypes, setItemTypes] = useState([
    "Mobiles",
    "Laptops",
    "Tablets",
    "Cameras",
    "Printers",
    "Monitors",
    "Keyboards",
    "Mice",
    "Headphones",
    "Speakers",
    "Other",
    // Add your additional item types here
  ]);

  const [sortByCreatedAt, setSortByCreatedAt] = useState({
    order: "desc", // Default sorting order
    checked: false, // Initial checkbox state
  });
  const handlePrintQRCodes = () => {
    window.print();
  };
  const fetchInventoryData = async () => {
    try {
      const response = await axios.get("/api/inventory"); // Adjust API endpoint URL
      if (response.status === 200) {
        const inventoryData = response.data;
        setItems(inventoryData);
      }
    } catch (error) {
      console.error("Error fetching inventory data:", error);
      setError("Failed to fetch inventory data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployeesData = async () => {
    try {
      const response = await axios.get("/api/employee"); // Adjust API endpoint URL
      if (response.status === 200) {
        const employeesData = response.data;
        setEmployees(employeesData);
      }
    } catch (error) {
      console.error("Error fetching employees data:", error);
      setError("Failed to fetch employees data. Please try again later.");
    }
  };

  useEffect(() => {
    fetchInventoryData();
    fetchEmployeesData();
  }, []);

  const handleAddItem = async () => {
    // Mix category and name for description if description is not provided
    const finalDescription = itemDescriptionModal || `${itemTypeModal}: ${itemNameModal}`;

    // Assign today's date if assignedTo is selected and assignedDate is not provided
    const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
    const finalAssignedDate = assignedToModal && !assignedDateModal ? today : assignedDateModal;

    const formData = {
      itemCategory: itemTypeModal,
      itemName: itemNameModal,
      description: finalDescription,
      assignedTo: assignedToModal || null,
      assignedDate: finalAssignedDate || null,
    };
    try {
      const response = await axios.post("/api/inventory", formData);
      if (response.status === 201) {
        setItems([...items, response.data]);
        setItemTypeModal("");
        setItemNameModal("");
        setAssignedToModal("");
        setAssignedDateModal("");
        setShowModal(false);
        fetchInventoryData();
        fetchEmployeesData();
      }
    } catch (error) {
      console.error("Error adding item:", error);
      setError("Failed to add item. Please try again later.");
    }
  };

  const handleDeleteAllItems = async () => {
    // Prompt user to confirm deletion
    const userConfirmed = window.confirm("Are you sure you want to delete all items?");

    if (!userConfirmed) {
      return; // If user cancels, exit the function without deleting
    }

    try {
      const response = await axios.delete("/api/inventory"); // Adjust API endpoint URL
      if (response.status === 204) {
        setItems([]); // Clear items list if deletion is successful
      }
    } catch (error) {
      console.error("Error deleting all items:", error);
      setError("Failed to delete all items. Please try again later.");
    }
  };

  const handleSortByCreatedAt = () => {
    // Toggle the sorting order
    const newOrder = sortByCreatedAt.order === "asc" ? "desc" : "asc";
    setSortByCreatedAt({ order: newOrder, checked: !sortByCreatedAt.checked });
  };

  const handleRowClick = (itemId) => {
    // Navigate to the item's page using router.push
    router.push(`/inventory/items/${itemId}`); // Adjust route path based on your application
  };

  const handleTypeSelect = (type) => {
    setItemTypeFilter(type);
    // Add any filtering or other logic based on the selected type here
  };
  return (
    <AdminLayout>
      <Row>
        <Col xs={12}>
          <Form.Group className="mb-3">
            <Tabs activeKey={itemTypeFilter} onSelect={(k) => handleTypeSelect(k)} >
              {itemTypes.map((type) => (
                <Tab eventKey={type} title={type} />
              ))}
            </Tabs>
          </Form.Group>
        </Col>

      </Row>
      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center">
          {itemTypeFilter ? itemTypeFilter : "Inventory"}
          <div className="d-flex align-items-center">
            <Form.Check
              type="checkbox"
              id="sortCheckbox"
              label="Sort"
              checked={sortByCreatedAt.checked}
              onChange={handleSortByCreatedAt}
              className="me-2"
            />



            <Button
              variant="outline-primary"
              className="me-2"
              onClick={() => setShowModal(true)}
            >
              Add Item
            </Button>
            <Button className="me-2" variant="outline-danger" onClick={handleDeleteAllItems}>
              Delete All Items
            </Button>
            <Button
              variant="outline-primary"
              className="me-2"
              onClick={handlePrintQRCodes}
            >
              <FontAwesomeIcon icon={faPrint} className="me-1" />
              Print QR Codes
            </Button>
            <DownloadTableExcel
              filename="Inventory Summary"
              sheet="InventorySummary"
              currentTableRef={inventoryTable.current}
            >
              <Button variant="outline-light" className="fw-bold">
                <FontAwesomeIcon icon={faFile} className="me-1" />
                Export
              </Button>
            </DownloadTableExcel>
          </div>
        </Card.Header>
        <Card.Body>
          <Form className="mb-3">

            <Row>
              <Col xs={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={itemNameFilter}
                    onChange={(e) => setItemNameFilter(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col xs={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Assigned To</Form.Label>
                  <Form.Control
                    type="text"
                    value={assignedToFilter}
                    onChange={(e) => setAssignedToFilter(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col xs={4}>
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

          </Form>
          {loading ? (
            <p>Loading inventory data...</p>
          ) : error ? (
            <p>{error}</p>
          ) : (
            <>
              <Table striped bordered hover ref={inventoryTable}>
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Name</th>
                    <th>Assigned To</th>
                    <th>Assigned Date</th>
                    <th>Status</th>
                    <th>QR Code</th>
                  </tr>
                </thead>
                <tbody>
                  {items
                    .filter((item) =>
                      (itemTypeFilter === "" ||
                        item.itemCategory.toLowerCase() === itemTypeFilter.toLowerCase()) &&
                      item.itemName.toLowerCase().includes(itemNameFilter.toLowerCase()) &&
                      // Include items where assignedTo is empty or matches the filter
                      (!assignedToFilter || !item.assignedTo || item.assignedTo.name.toLowerCase().includes(assignedToFilter.toLowerCase())) &&
                      // Include items where assignedDate is empty or matches the filter
                      (!assignedDateFilter || item.assignedDate.includes(assignedDateFilter))
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
                    .map((item) => (
                      <tr key={item._id} onClick={() => handleRowClick(item._id)}>
                        <td className="align-middle">{item.itemCategory}</td>
                        <td className="align-middle">{item.itemName}</td>
                        <td className="align-middle">{item.assignedTo ? item.assignedTo.name : 'N/A'}</td>
                        <td className="align-middle">{item.assignedDate ? new Date(item.assignedDate).toLocaleString() : 'N/A'}</td>
                        <td className="align-middle text-center">
                          {item.assignedTo ? (
                            <Badge bg="success">Assigned</Badge>
                          ) : (
                            <Badge bg="danger">Not Assigned</Badge>
                          )}
                        </td>
                        {/* QR Code column */}
                        <td className="text-center">
                          <Canvas
                            text={JSON.stringify({
                              SerialNumber: item._id,
                              Type: item.itemType,
                              Name: item.itemName,
                              AssignedTo: item.assignedTo ? item.assignedTo.name : 'N/A',
                              AssignedDate: item.assignedDate || 'N/A',
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
            </>
          )}
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Item</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Type</Form.Label>
              <Form.Control
                as="select"
                value={itemTypeModal}
                onChange={(e) => setItemTypeModal(e.target.value)}
              >
                <option value="">Select Type</option>
                {itemTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={itemNameModal}
                onChange={(e) => setItemNameModal(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                as={"textarea"}
                value={itemDescriptionModal}
                onChange={(e) => setItemDescriptionModal(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Assigned To</Form.Label>
              <Form.Control
                as="select"
                value={assignedToModal}
                onChange={(e) => setAssignedToModal(e.target.value)}
              >
                <option value="">Select Employee</option>
                {employees.map((employee) => (
                  <option key={employee._id} value={employee._id}>
                    {employee.name}
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
          <Button variant="primary" onClick={handleAddItem}>
            Add
          </Button>
        </Modal.Footer>
      </Modal>
    </AdminLayout>
  );
};

export default Inventory;
