import React, { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import axios from 'axios';
import { Spinner, Alert, Form } from 'react-bootstrap';

const PendingPaymentsTable = ({ marketingDataId }) => {
  const [pendingPayments, setPendingPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPendingPayments = async () => {
    try {
      let response;
      if (marketingDataId) {
        // Fetch payments for a specific lead ID
        response = await axios.get(`/api/marketing/verify-payment?leadId=${marketingDataId}`);
      } else {
        // Fetch all pending payments if no marketingDataId is provided
        response = await axios.get(`/api/marketing/verify-payment`);
      }

      const data = response.data;
      setPendingPayments(data); // Assuming the API response includes `pendingPayments`
    } catch (err) {
      setError('Failed to fetch pending payments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    marketingDataId && fetchPendingPayments(); // Fetch payments whether `marketingDataId` is present or not
  }, [marketingDataId]);

  const handleStatusChange = async (paymentId, newStatus, paymentType, marketingDataId) => {
    try {
      // Step 1: Fetch data from `/api/marketing?id={paymentId}`
      const marketingResponse = await axios.get(`/api/marketing?id=${marketingDataId}`);
      const marketingData = marketingResponse.data; // Assuming this returns the data you want to send

      // Step 2: Send the fetched data to `/api/marketing/verify-payment?id=${paymentId}`
      await axios.put(`/api/marketing/verify-payment?id=${paymentId}`, {
        paymentType: paymentType,
        paymentStatus: newStatus,
        marketingData, // Send the fetched marketing data along with the update
      });

      // Step 3: Update the payment status locally
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

  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>Payment Type</th>
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
            <td>{payment.paymentType}</td>
            <td>{payment.customerName}</td>
            <td>{payment.customerPhone}</td>
            <td>{payment.amountPaid}</td>
            <td>{payment.paymentMethod}</td>
            <td>
              <Form.Control
                as="select"
                disabled={payment.paymentStatus === "Pending" ? false : true}
                value={payment.paymentStatus}
                onChange={(e) => handleStatusChange(payment._id, e.target.value, payment.paymentType, payment.leadId)}
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
