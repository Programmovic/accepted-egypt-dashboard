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

const SalesStatuses = () => {
  const [salesStatuses, setSalesStatuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentSalesStatus, setCurrentSalesStatus] = useState({ id: null, status: "" });

  const fetchSalesStatuses = async () => {
    try {
      const response = await axios.get("/api/sales-status");
      if (response.status === 200) {
        setSalesStatuses(response.data);
      }
    } catch (error) {
      setError("Failed to fetch sales statuses. Please try again later.");
      console.error("Error fetching sales statuses:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    const method = isEdit ? 'put' : 'post';
    const url = isEdit ? `/api/sales-status?id=${currentSalesStatus._id}` : "/api/sales-status";
    
    try {
      const response = await axios[method](url, { status: currentSalesStatus.status });
      if (response.status === 201 || response.status === 200) {
        toast.success(`Sales Status ${isEdit ? 'updated' : 'added'} successfully!`);
        fetchSalesStatuses();
        setShowModal(false);
        setCurrentSalesStatus({ id: null, status: "" });
      }
    } catch (error) {
      toast.error("Failed to update the sales status. Please try again.");
      console.error("Error saving sales status:", error);
    }
  };

  const handleDelete = async (id) => {
    const userConfirmed = window.confirm("Are you sure you want to delete this sales status?");
    
    if (userConfirmed) {
      try {
        const response = await axios.delete(`/api/sales-status?id=${id}`);
        if (response.status === 200) {
          toast.success("Sales Status deleted successfully!");
          fetchSalesStatuses();
        }
      } catch (error) {
        toast.error("Failed to delete the sales status. Please try again.");
        console.error("Error deleting sales status:", error);
      }
    }
  };

  useEffect(() => {
    fetchSalesStatuses();
  }, []);

  return (
    <AdminLayout>
      <Card>
        <Card.Header>Sales Statuses</Card.Header>
        <Card.Body>
          <Button variant="success" onClick={() => { setShowModal(true); setIsEdit(false); }}>
            Add Sales Status
          </Button>

          <Table striped bordered hover className="mt-3">
            <thead>
              <tr>
                <th>#</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {salesStatuses.map((status, index) => (
                <tr key={status.id}>
                  <td>{index + 1}</td>
                  <td>{status.status}</td>
                  <td>
                    <Button variant="primary" onClick={() => { setShowModal(true); setIsEdit(true); setCurrentSalesStatus(status); }}>
                      Edit
                    </Button>
                    <Button variant="danger" onClick={() => handleDelete(status._id)} className="ms-2">
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
          <Modal.Title>{isEdit ? 'Edit' : 'Add'} Sales Status</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Control
                type="text"
                value={currentSalesStatus.status}
                onChange={(e) => setCurrentSalesStatus({ ...currentSalesStatus, status: e.target.value })}
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

export default SalesStatuses;
