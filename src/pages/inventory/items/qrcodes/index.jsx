import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom'; // Import ReactDOM
import axios from 'axios';
import QRCode from 'qrcode.react';
import { Card, Button } from 'react-bootstrap';
import { AdminLayout } from '@layout';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const QRCodeGrid = ({ qrCodeData }) => (
  <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', margin: '20px' }}>
    {qrCodeData.map((qrCode, index) => (
      <div key={index} style={{ margin: '10px', textAlign: 'center' }}>
        <QRCode value={qrCode} size={100} />
        <div>{qrCode}</div>
      </div>
    ))}
  </div>
);

const InventoryQRCodePage = () => {
  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    fetchInventoryData();
  }, []);

  // Extract the _id values for QR codes
  const qrCodeData = items.map(item => item._id);

  const downloadPDF = async () => {
    const pdf = new jsPDF();

    // Create a div to hold the QR codes
    const grid = document.createElement('div');
    document.body.appendChild(grid);
    ReactDOM.render(<QRCodeGrid qrCodeData={qrCodeData} />, grid);

    // Use html2canvas to capture the QR code grid
    const canvas = await html2canvas(grid, {
      useCORS: true, // Allow cross-origin images (for QR codes)
      scale: 2 // Increase scale for better quality
    });
    
    const imgData = canvas.toDataURL('image/png');

    // Remove the temporary grid after capturing
    ReactDOM.unmountComponentAtNode(grid);
    document.body.removeChild(grid);

    // Add image to PDF
    pdf.addImage(imgData, 'PNG', 10, 10, 190, 0); // Adjust the position and size as needed
    pdf.save('qr_codes.pdf'); // Save the PDF
  };

  return (
    <AdminLayout>
      <Card>
        <Card.Header>Inventory QR Codes</Card.Header>
        <Card.Body>
          {loading && <p>Loading...</p>}
          {error && <p style={{ color: 'red' }}>{error}</p>}
          {!loading && !error && (
            <div>
              <Button variant="primary" style={{ marginBottom: '20px' }} onClick={downloadPDF}>
                Download QR Codes as PDF
              </Button>
              {/* The QR codes component that will be captured for PDF */}
              <QRCodeGrid qrCodeData={qrCodeData} />
            </div>
          )}
        </Card.Body>
      </Card>
    </AdminLayout>
  );
};

export default InventoryQRCodePage;
