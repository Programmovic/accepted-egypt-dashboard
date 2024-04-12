import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Card, Table, Badge, Modal, Button } from "react-bootstrap";
import { AdminLayout } from "@layout";
import { useRouter } from "next/router";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useQRCode } from "next-qrcode";
import { usePDF, Resolution } from "react-to-pdf";

const LaptopDetails = () => {
  const [laptop, setLaptop] = useState(null);
  const [showQRModal, setShowQRModal] = useState(false);
  const router = useRouter();
  const { id } = router.query;
  const laptopApiUrl = `/api/laptops/${id}`;
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
      if (response.status === 200) {
        setLaptop(response.data);
      }
    } catch (error) {
      console.error("Error fetching laptop:", error);
    }
  };

  useEffect(() => {
    if (id) {
      fetchLaptop();
    }
  }, [id, laptopApiUrl]);

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
            <Button
              variant="outline-light"
              className="me-2"
              onClick={() => setShowQRModal(true)}
            >
              Generate QR Code
            </Button>
            <Button variant="outline-light" onClick={toPDF}>
              Download PDF
            </Button>
          </div>
        </Card.Header>
        <Card.Body ref={targetRef}>
          {laptop && (
            <div ref={modalRef}>
              <h5 className="fw-bold mb-4">Laptop Information</h5>
              <Table bordered responsive>
                <tbody>
                  <tr>
                    <td className="fw-bold">Brand:</td>
                    <td>{laptop.brand}</td>
                  </tr>
                  <tr>
                    <td className="fw-bold">Model:</td>
                    <td>{laptop.model}</td>
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
            </div>
          )}
        </Card.Body>
      </Card>

      <Modal show={showQRModal} onHide={() => setShowQRModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>QR Code</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div style={{ textAlign: "center" }}>
            <Canvas
              text={JSON.stringify({
                SerialNumber: laptop?._id,
                Brand: laptop?.brand,
                Model: laptop?.model,
                AssignedTo: laptop?.assignedTo?.name,
                AssignedDate: new Date(laptop?.assignedDate).toLocaleString()
              })}
              options={{
                errorCorrectionLevel: "M",
                margin: 1,
                scale: 10,
                width: 300,
                color: {
                  dark: "#000",
                  light: "#fff",
                },
              }}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowQRModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleDownloadQRCodeImage}>
            Print QR Code
          </Button>
        </Modal.Footer>
      </Modal>
    </AdminLayout>
  );
};

export default LaptopDetails;
