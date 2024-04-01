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
    filename: `Invoice_${id}.pdf`,
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
      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <div>
            Invoice Details
            {transaction && (
              <Badge pill variant="primary" className="ms-2">
                {transaction._id}
              </Badge>
            )}
          </div>
          <Button
            variant="outline-light"
            className="fw-bold pt-1"
            onClick={toPDF}
          >
            Export as PDF
          </Button>
        </Card.Header>
        <Card.Body ref={targetRef}>
          {transaction && (
            <div>
              <h5 className="fw-bold mb-4">Invoice Information</h5>
              <Table>
                <tbody>
                  <tr>
                    <td className="fw-bold">Invoice Number:</td>
                    <td>{transaction._id}</td>
                  </tr>
                  <tr>
                    <td className="fw-bold">Date:</td>
                    <td>{new Date().toLocaleString()}</td>
                  </tr>
                  {/* Add more invoice details here */}
                </tbody>
              </Table>

              <h5 className="fw-bold mt-4 mb-4">Billing Details</h5>
              <Table hover>
                <tbody>
                  <tr>
                    <td className="fw-bold">Transaction Date:</td>
                    <td>{new Date(transaction?.createdAt).toLocaleString()}</td>
                  </tr>

                  {transaction?.student ? (
                    <tr>
                      <td className="fw-bold">Student Name:</td>
                      <td>{transaction.student.name}</td>
                    </tr>
                  ) : (
                    <tr>
                      <td className="fw-bold">Student Name:</td>
                      <td colSpan="2" className="text-danger">
                        No student associated with this transaction
                      </td>
                    </tr>
                  )}

                  {transaction?.batch ? (
                    <tr>
                      <td className="fw-bold">Batch:</td>
                      <td>{transaction.batch.name}</td>
                    </tr>
                  ) : (
                    <tr>
                      <td className="fw-bold">Batch:</td>
                      <td colSpan="2" className="text-danger">
                        No batch associated with this transaction
                      </td>
                    </tr>
                  )}

                  <tr>
                    <td className="fw-bold">Type:</td>
                    <td>{transaction.type}</td>
                  </tr>
                  <tr>
                    <td className="fw-bold">Amount (EGP):</td>
                    <td>{transaction.amount} EGP</td>
                  </tr>
                  <tr>
                    <td className="fw-bold">Description:</td>
                    <td>{transaction.description}</td>
                  </tr>
                  {/* Add more billing details if necessary */}
                </tbody>
              </Table>
            </div>
          )}
        </Card.Body>
      </Card>
    </AdminLayout>
  );
};

export default TransactionDetails;
