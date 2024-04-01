import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Table, Badge, Button } from "react-bootstrap";
import { AdminLayout } from "@layout";
import { useRouter } from "next/router";
import { usePDF, Resolution } from "react-to-pdf";

const TransactionDetails = () => {
  const [transaction, setTransaction] = useState(null);
  const router = useRouter();
  const { id } = router.query;
  const transactionApiUrl = `/api/transaction/${id}`;
  const { toPDF, targetRef } = usePDF({
    filename: `Transaction - ${id}.pdf`,
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

  const fetchTransaction = async () => {
    try {
      const response = await axios.get(transactionApiUrl);
      console.log(response);
      if (response.status === 200) {
        setTransaction(response.data);
      }
    } catch (error) {
      console.error("Error fetching transaction:", error);
    }
  };

  useEffect(() => {
    if (id) {
      fetchTransaction(); // Fetch transaction when the ID is available
    }
  }, [id, transactionApiUrl]);

  return (
    <AdminLayout>
      <Button variant="outline-primary" className="mb-2" onClick={toPDF}>
        Export as PDF
      </Button>
      <Card ref={targetRef}>
        <Card.Header>
          Transaction Details
          {transaction && (
            <Badge pill variant="primary" className="ms-2">
              {transaction._id}
            </Badge>
          )}
        </Card.Header>
        <Card.Body>
          {transaction && (
            <Table striped bordered hover>
              <tbody>
                <tr>
                  <td>Student</td>
                  <td>{transaction?.student?.name}</td>
                </tr>
                <tr>
                  <td>Batch</td>
                  <td>{transaction?.batch?.name}</td>
                </tr>
                <tr>
                  <td>Type</td>
                  <td>{transaction.type}</td>
                </tr>
                <tr>
                  <td>Amount (EGP)</td>
                  <td>{transaction.amount} EGP</td>
                </tr>
                <tr>
                  <td>Description</td>
                  <td>{transaction.description}</td>
                </tr>
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>
    </AdminLayout>
  );
};

export default TransactionDetails;
