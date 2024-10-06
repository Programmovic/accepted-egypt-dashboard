import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Card, Table, Badge, Modal, Button, Form } from "react-bootstrap";
import { AdminLayout } from "@layout";
import { useRouter } from "next/router";
import html2canvas from "html2canvas";
import { useQRCode } from "next-qrcode";
import { usePDF, Resolution } from "react-to-pdf";
import Select from "react-select"; // Import react-select

const LaptopDetails = () => {
  const [laptop, setLaptop] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [showQRModal, setShowQRModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [updatedLaptop, setUpdatedLaptop] = useState({});
  const [brands] = useState([
    { value: 'apple', label: 'Apple' },
    { value: 'dell', label: 'Dell' },
    { value: 'hp', label: 'HP' },
    { value: 'lenovo', label: 'Lenovo' },
    { value: 'asus', label: 'Asus' },
    { value: 'acer', label: 'Acer' },
    { value: 'samsung', label: 'Samsung' },
    { value: 'microsoft', label: 'Microsoft' },
    { value: 'razer', label: 'Razer' },
    { value: 'toshiba', label: 'Toshiba' },
    // Add more brands as needed
  ]);
  const router = useRouter();
  const { id } = router.query;
  const laptopApiUrl = `/api/inventory/${id}`;
  const { Canvas } = useQRCode();
  const modalRef = useRef(null);
  const { toPDF, targetRef } = usePDF({
    filename: `Laptop_Details_${id}.pdf`,
    resolution: Resolution.HIGH,
    canvas: {
      mimeType: "image/png",
      qualityRatio: 1,
    },
    overrides: {
      pdf: {
        compress: true,
      },
      canvas: {
        useCORS: true,
      },
    },
    page: {
      margin: 10,
    },
  });

  const fetchLaptop = async () => {
    try {
      const response = await axios.get(laptopApiUrl);
      console.log(response)
      if (response.status === 200) {
        setLaptop(response.data);
        setUpdatedLaptop({
          itemType: response.data.itemType,
          itemName: response.data.itemName,
          assignedTo: response.data.assignedTo?._id,
        });
      }
    } catch (error) {
      console.error("Error fetching laptop:", error);
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await axios.get('/api/employee');
      if (response.status === 200) {
        setEmployees(response.data.map(emp => ({
          value: emp._id,
          label: emp.name,
        })));
      }
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  useEffect(() => {
    if (id) {
      fetchLaptop();
      fetchEmployees();
    }
  }, [id]);

  const handleDownloadImage = async () => {
    try {
      const modalContent = modalRef.current;
      const canvas = await html2canvas(modalContent);
      const imageData = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = imageData;
      link.download = `laptop_details.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error generating image:", error);
    }
  };

  const handleDownloadQRCodeImage = async () => {
    try {
      const canvas = document.querySelector("canvas");
      const imageData = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = imageData;
      link.download = `qr_code.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error generating QR code image:", error);
    }
  };

  const handleEditLaptop = async () => {
    try {
      const response = await axios.put(laptopApiUrl, updatedLaptop);

      if (response.status === 200) {
        fetchLaptop()
        setLaptop(response.data);
        setShowEditModal(false);
      }
    } catch (error) {
      console.error("Error updating laptop:", error);
    }
  };

  const handleDeleteLaptop = async () => {
    try {
      const response = await axios.delete(laptopApiUrl);
      if (response.status === 200) {
        alert("Laptop deleted successfully!");
        router.push("/laptops");
      }
    } catch (error) {
      console.error("Error deleting laptop:", error);
    }
  };
  function calculateDuration(assignedDate, unassignedDate) {
    const assignedTime = new Date(assignedDate).getTime();
    const unassignedTime = unassignedDate ? new Date(unassignedDate).getTime() : Date.now();
    const differenceInSeconds = Math.round((unassignedTime - assignedTime) / 1000);

    if (differenceInSeconds < 60) {
      return `${differenceInSeconds} second${differenceInSeconds !== 1 ? 's' : ''}`;
    } else if (differenceInSeconds < 3600) {
      const differenceInMinutes = Math.round(differenceInSeconds / 60);
      return `${differenceInMinutes} minute${differenceInMinutes !== 1 ? 's' : ''}`;
    } else if (differenceInSeconds < 86400) {
      const differenceInHours = Math.round(differenceInSeconds / 3600);
      return `${differenceInHours} hour${differenceInHours !== 1 ? 's' : ''}`;
    } else {
      const differenceInDays = Math.round(differenceInSeconds / 86400);
      return `${differenceInDays} day${differenceInDays !== 1 ? 's' : ''}`;
    }
  }

  return (
    <AdminLayout>
      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <div>
            Laptop Details
            {laptop && (
              <Badge pill variant="primary" className="ms-2">
                {laptop._id}
              </Badge>
            )}
          </div>
          <div>
            <Button variant="outline-light" className="me-2" onClick={() => setShowQRModal(true)}>
              Generate QR Code
            </Button>
            <Button variant="outline-light" className="me-2" onClick={toPDF}>
              Download PDF
            </Button>
            <Button variant="outline-danger" className="me-2" onClick={handleDeleteLaptop}>
              Delete Laptop
            </Button>
            <Button variant="outline-primary" onClick={() => setShowEditModal(true)}>
              Edit Laptop
            </Button>
          </div>
        </Card.Header>
        <Card.Body>
          {laptop && (
            <div ref={modalRef}>
              <h5 className="fw-bold mb-4">Laptop Information</h5>
              <Table bordered responsive>
                <tbody>
                  <tr>
                    <td className="fw-bold">Brand:</td>
                    <td>{laptop.itemName}</td>
                  </tr>
                  <tr>
                    <td className="fw-bold">Model:</td>
                    <td>{laptop.itemType}</td>
                  </tr>
                  <tr>
                    <td className="fw-bold">Assigned To:</td>
                    <td>{laptop?.assignedTo?.name}</td>
                  </tr>
                  <tr>
                    <td className="fw-bold">Assigned Date:</td>
                    <td>{new Date(laptop?.assignedDate).toLocaleString()}</td>
                  </tr>
                </tbody>
              </Table>

              <h5 className="fw-bold mb-4">Assignment History</h5>
              <Table bordered responsive>
                <thead>
                  <tr>
                    <th>Assigned To</th>
                    <th>Assigned Date</th>
                    <th>Returned Date</th>
                    <th>Duration</th>
                  </tr>
                </thead>
                <tbody>
                  {laptop.history && laptop.history.length > 0 ? (
                    laptop.history.map((assignment, index) => (
                      <tr key={index}>
                        <td>{assignment?.employeeId?.name}</td>
                        <td>{new Date(assignment?.assignedDate).toLocaleString()}</td>
                        <td>{assignment?.assignedDate ? new Date(assignment.unassignedDate).toLocaleString() : 'N/A'}</td>
                        <td>
                          {assignment.unassignedDate ? (
                            calculateDuration(assignment.assignedDate, assignment.unassignedDate)
                          ) : (
                            'Ongoing'
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center">No assignment history available.</td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* QR Code Modal */}
      <Modal show={showQRModal} onHide={() => setShowQRModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>QR Code for Laptop</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Canvas text={`http://example.com/laptop/${id}`} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleDownloadQRCodeImage}>
            Download QR Code
          </Button>
          <Button variant="secondary" onClick={() => setShowQRModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Laptop Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Laptop</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="itemType">
              <Form.Label>Brand</Form.Label>
              <Select
                options={brands}
                value={brands.find(brand => brand.value === updatedLaptop.itemType)}
                onChange={(selected) => setUpdatedLaptop(prev => ({ ...prev, itemType: selected.value }))}
              />
            </Form.Group>
            <Form.Group controlId="itemName">
              <Form.Label>Model</Form.Label>
              <Form.Control
                type="text"
                value={updatedLaptop.itemName}
                onChange={(e) => setUpdatedLaptop(prev => ({ ...prev, itemName: e.target.value }))}
              />
            </Form.Group>
            <Form.Group controlId="assignedTo">
              <Form.Label>Assign To</Form.Label>
              <Select
                options={employees}
                value={employees.find(emp => emp.value === updatedLaptop.assignedTo)}
                onChange={(selected) => setUpdatedLaptop(prev => ({ ...prev, assignedTo: selected.value }))}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleEditLaptop}>
            Save Changes
          </Button>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </AdminLayout>
  );
};

export default LaptopDetails;
