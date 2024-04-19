// Import necessary libraries and components
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Button,
  Card,
  Form,
  Modal,
  Table,
} from "react-bootstrap";
import { AdminLayout } from "@layout";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PaymentMethods = () => {
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentPaymentMethod, setCurrentPaymentMethod] = useState({ id: null, type: "" });

  const fetchPaymentMethods = async () => {
    try {
      const response = await axios.get("/api/payment-method");
      if (response.status === 200) {
        setPaymentMethods(response.data);
      }
    } catch (error) {
      setError("Failed to fetch payment methods. Please try again later.");
      console.error("Error fetching payment methods:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    const method = isEdit ? 'put' : 'post';
    const url = isEdit ? `/api/payment-method?id=${currentPaymentMethod._id}` : "/api/payment-method";
    
    try {
      const response = await axios[method](url, { type: currentPaymentMethod.type });
      if (response.status === 201 || response.status === 200) {
        toast.success(`Payment Method ${isEdit ? 'updated' : 'added'} successfully!`);
        fetchPaymentMethods();
        setShowModal(false);
        setCurrentPaymentMethod({ id: null, type: "" });
      }
    } catch (error) {
      toast.error("Failed to update the payment method. Please try again.");
      console.error("Error saving payment method:", error);
    }
  };

  const handleDelete = async (id) => {
    // Ask user to confirm the deletion
    const userConfirmed = window.confirm("Are you sure you want to delete this payment method?");
    
    if (userConfirmed) {
      try {
        const response = await axios.delete(`/api/payment-method?id=${id}`);
        if (response.status === 200) {
          toast.success("Payment Method deleted successfully!");
          fetchPaymentMethods();
        }
      } catch (error) {
        toast.error("Failed to delete the payment method. Please try again.");
        console.error("Error deleting payment method:", error);
      }
    }
  };
  

  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  return (
    <AdminLayout>
      <Card>
        <Card.Header>Payment Methods</Card.Header>
        <Card.Body>
          <Button variant="success" onClick={() => { setShowModal(true); setIsEdit(false); }}>
            Add Payment Method
          </Button>

          <Table striped bordered hover className="mt-3">
            <thead>
              <tr>
                <th>#</th>
                <th>Type</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paymentMethods.map((method, index) => (
                <tr key={method.id}>
                  <td>{index + 1}</td>
                  <td>{method.type}</td>
                  <td>
                    <Button variant="primary" onClick={() => { setShowModal(true); setIsEdit(true); setCurrentPaymentMethod(method); }}>
                      Edit
                    </Button>
                    <Button variant="danger" onClick={() => handleDelete(method._id)} className="ms-2">
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
      <ToastContainer position="top-right" autoClose={3000} />

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{isEdit ? 'Edit' : 'Add'} Payment Method</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Type</Form.Label>
              <Form.Control
                type="text"
                value={currentPaymentMethod.type}
                onChange={(e) => setCurrentPaymentMethod({ ...currentPaymentMethod, type: e.target.value })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="success" onClick={handleSave}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </AdminLayout>
  );
};

export default PaymentMethods;
