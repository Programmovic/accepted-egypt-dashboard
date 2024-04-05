import React, { useState } from "react";
import { Card, Table } from "react-bootstrap";
import { BarcodeScanner } from "@alzera/react-scanner";
import { AdminLayout } from "@layout";
import { useRouter } from "next/router";

const InventoryScanPage = () => {
  const [scannedData, setScannedData] = useState("");
  const [itemData, setItemData] = useState(null);
  const router = useRouter();

  const handleScan = (data) => {
    if (data) {
      setScannedData(data);
      try {
        const parsedData = JSON.parse(data);
        setItemData(parsedData);
        const { SerialNumber } = parsedData; // Extracting _id from the scanned data
        const _id = SerialNumber
        if (_id) {
          // Navigating to the laptop page in a new tab
          window.open(`/inventory/laptops/${_id}`, "_blank");
        }
      } catch (error) {
        console.error("Error parsing scanned data:", error);
        setItemData(null);
      }
    }
  };

  return (
    <AdminLayout>
      <Card>
        <Card.Header>Scan Inventory Item</Card.Header>
        <Card.Body>
          <BarcodeScanner
            className="barcode-scanner"
            aspectRatio="16/9"
            onScan={handleScan}
          />
        </Card.Body>
      </Card>
      {itemData && (
        <Card className="mt-4">
          <Card.Header>Item Details</Card.Header>
          <Card.Body>
            <Table striped bordered hover>
              <tbody>
                {Object.entries(itemData).map(([key, value]) => (
                  <tr key={key}>
                    <td>{key}</td>
                    <td>{typeof value === 'object' ? JSON.stringify(value) : value}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      )}
    </AdminLayout>
  );
};

export default InventoryScanPage;
