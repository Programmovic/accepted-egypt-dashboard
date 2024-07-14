import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Button,
  Card,
  Form,
  Modal,
  Table,
  Row
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
  const [currentPaymentMethod, setCurrentPaymentMethod] = useState({ id: null, type: "", configuration: { bankAccountNumber: "", walletNumber: [""] } });

  const possiblePaymentMethods = [
    "Credit Card",
    "Debit Card",
    "Bank Transfer",
    "Vodafone Cash",
    "Orange Money",
    "Etisalat Cash",
    "Fawry",
    "Meeza",
    "Cash",
    "ValU",
  ];

  const fetchPaymentMethods = async () => {
    try {
      const response = await axios.get("/api/payment-method");
      if (response.status === 200) {
        setPaymentMethods(response.data);
        console.log(response.data)
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
      const response = await axios[method](url, {
        type: currentPaymentMethod.type,
        configuration: currentPaymentMethod.configuration,
      });
      if (response.status === 201 || response.status === 200) {
        toast.success(`Payment Method ${isEdit ? 'updated' : 'added'} successfully!`);
        fetchPaymentMethods();
        setShowModal(false);
        setCurrentPaymentMethod({ id: null, type: "", configuration: { bankAccountNumber: "", walletNumber: [""] } });
      }
    } catch (error) {
      toast.error("Failed to update the payment method. Please try again.");
      console.error("Error saving payment method:", error);
    }
  };

  const handleDelete = async (id) => {
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

  const handleWalletNumberChange = (index, value) => {
    const newWalletNumbers = [...currentPaymentMethod.configuration.walletNumber];
    newWalletNumbers[index] = value;
    setCurrentPaymentMethod({
      ...currentPaymentMethod,
      configuration: { ...currentPaymentMethod.configuration, walletNumber: newWalletNumbers },
    });
  };

  const addWalletNumberField = () => {
    setCurrentPaymentMethod({
      ...currentPaymentMethod,
      configuration: { ...currentPaymentMethod.configuration, walletNumber: [...currentPaymentMethod.configuration.walletNumber, ""] },
    });
  };

  const removeWalletNumberField = (index) => {
    const newWalletNumbers = currentPaymentMethod.configuration.walletNumber.filter((_, i) => i !== index);
    setCurrentPaymentMethod({
      ...currentPaymentMethod,
      configuration: { ...currentPaymentMethod.configuration, walletNumber: newWalletNumbers },
    });
  };
  const handleBankAccountNumberChange = (index, value) => {
    const newBankAccountNumbers = [...currentPaymentMethod.configuration.walletNumber];
    newBankAccountNumbers[index] = value;
    setCurrentPaymentMethod({
      ...currentPaymentMethod,
      configuration: { ...currentPaymentMethod.configuration, bankAccountNumber: newBankAccountNumbers },
    });
  };

  const addBankAccountNumberField = () => {
    setCurrentPaymentMethod({
      ...currentPaymentMethod,
      configuration: { ...currentPaymentMethod.configuration, bankAccountNumber: [...currentPaymentMethod.configuration.bankAccountNumber, ""] },
    });
  };

  const removeBankAccountNumberField = (index) => {
    const newBankAccountNumbers = currentPaymentMethod.configuration.bankAccountNumber.filter((_, i) => i !== index);
    setCurrentPaymentMethod({
      ...currentPaymentMethod,
      configuration: { ...currentPaymentMethod.configuration, bankAccountNumber: newBankAccountNumbers },
    });
  };

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
                <th>Configuration</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paymentMethods.map((method, index) => (
                <tr key={method._id}>
                  <td>{index + 1}</td>
                  <td>{method.type}</td>
                  <td>{["Vodafone Cash", "Orange Money", "Etisalat Cash"].includes(currentPaymentMethod.type) && method.configuration.walletNumber.join(',')}</td>
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
                as="select"
                value={currentPaymentMethod.type}
                onChange={(e) => setCurrentPaymentMethod({ ...currentPaymentMethod, type: e.target.value })}
              >
                <option value="">Select Payment Method</option>
                {possiblePaymentMethods.map((method) => (
                  <option key={method} value={method}>
                    {method}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            {currentPaymentMethod.type === "Bank Transfer" && (
              <>
                {currentPaymentMethod.configuration.walletNumber.map((number, index) => (
                  <Form.Group key={index} className="mb-3">
                    <Form.Label>{currentPaymentMethod.type} Number {index + 1}</Form.Label>
                    <div className="d-flex">
                      <Form.Control
                        type="text"
                        value={number}
                        onChange={(e) => handleBankAccountNumberChange(index, e.target.value)}
                      />
                      <Button
                        variant="danger"
                        onClick={() => removeBankAccountNumberField(index)}
                        className="ms-2"
                      >
                        Remove
                      </Button>
                    </div>
                  </Form.Group>
                ))}
                <Button variant="success" onClick={addBankAccountNumberField}>
                  Add Another Number
                </Button>
              </>
            )}
            {["Vodafone Cash", "Orange Money", "Etisalat Cash"].includes(currentPaymentMethod.type) && (
              <>
                {currentPaymentMethod.configuration.walletNumber.map((number, index) => (
                  <Form.Group key={index} className="mb-3">
                    <Form.Label>{currentPaymentMethod.type} Number {index + 1}</Form.Label>
                    <div className="d-flex">
                      <Form.Control
                        type="text"
                        value={number}
                        onChange={(e) => handleWalletNumberChange(index, e.target.value)}
                      />
                      <Button
                        variant="danger"
                        onClick={() => removeWalletNumberField(index)}
                        className="ms-2"
                      >
                        Remove
                      </Button>
                    </div>
                  </Form.Group>
                ))}
                <Button variant="success" onClick={addWalletNumberField}>
                  Add Another Number
                </Button>
              </>
            )}
            {/* Add more conditional form fields as needed */}
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
