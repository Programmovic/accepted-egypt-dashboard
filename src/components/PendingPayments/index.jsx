import React, { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import axios from 'axios';
import { Spinner, Alert, Form, Button } from 'react-bootstrap';

const PendingPaymentsTable = ({ marketingDataId }) => {
  console.log(marketingDataId)
  const [pendingPayments, setPendingPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const fetchPendingPayments = async () => {
    try {
      const response = await axios.get(`/api/marketing/verify-payment?leadId=${marketingDataId}`);
      const data = response.data;
      console.log("data", data);
      setPendingPayments(data); // Assuming the API response includes `pendingPayments`
    } catch (err) {
      setError('Failed to fetch pending payments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {

    if (marketingDataId) fetchPendingPayments();
  }, [marketingDataId]);

  const handleStatusChange = async (paymentId, newStatus) => {
    try {
      await axios.put(`/api/marketing/verify-payment?id=${paymentId}`, { paymentStatus: newStatus });
      setPendingPayments((prevPayments) =>
        prevPayments.map((payment) =>
          payment._id === paymentId ? { ...payment, paymentStatus: newStatus } : payment
        )
      );
    } catch (err) {
      setError('Failed to update payment status');
    }
  };

  if (loading) return <Spinner animation="border" />;
  if (error) return <Alert variant="danger">{error}</Alert>;
  console.log(pendingPayments)
  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>Customer Name</th>
          <th>Customer Phone</th>
          <th>Amount Paid</th>
          <th>Payment Method</th>
          <th>Payment Status</th>
          <th>Payment Date</th>
          <th>Reference Number</th>
          <th>Notes</th>
        </tr>
      </thead>
      <tbody>
        {pendingPayments?.map((payment) => (
          <tr key={payment._id}>
            <td>{payment.customerName}</td>
            <td>{payment.customerPhone}</td>
            <td>{payment.amountPaid}</td>
            <td>{payment.paymentMethod}</td>
            <td>
              <Form.Control
                as="select"
                value={payment.paymentStatus}
                onChange={(e) => handleStatusChange(payment._id, e.target.value)}
              >
                <option value="Pending">Pending</option>
                <option value="Verified">Verified</option>
                <option value="Rejected">Rejected</option>
              </Form.Control>
            </td>
            <td>{new Date(payment.paymentDate).toLocaleDateString()}</td>
            <td>{payment.referenceNumber}</td>
            <td>{payment.notes}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default PendingPaymentsTable;
