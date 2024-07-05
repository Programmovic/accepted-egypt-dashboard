// Import necessary libraries and components
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Button,
  Card,
  Form,
  Modal,
  Table,
  Tabs,
  Tab,
} from "react-bootstrap";
import { AdminLayout } from "@layout";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminManagement = () => {
  const [salesStatuses, setSalesStatuses] = useState([]);
  const [candidateSignUpFors, setCandidateSignUpFors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentItem, setCurrentItem] = useState({ id: null, status: "", order: null });
  const [activeTab, setActiveTab] = useState("salesStatuses");

  const fetchData = async (endpoint, setState) => {
    try {
      const response = await axios.get(endpoint);
      if (response.status === 200) {
        setState(response.data);
      }
    } catch (error) {
      setError("Failed to fetch data. Please try again later.");
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    const method = isEdit ? 'put' : 'post';
    const url = isEdit
      ? `api/${activeTab === "salesStatuses" ? "sales-status" : "candidate_signup_for"}?id=${currentItem._id}`
      : `api/${activeTab === "salesStatuses" ? "sales-status" : "candidate_signup_for"}`;
    
    const data = activeTab === "salesStatuses"
      ? { status: currentItem.status }
      : { order: currentItem.order, status: currentItem.status };

    try {
      const response = await axios[method](url, data);
      if (response.status === 201 || response.status === 200) {
        toast.success(`${activeTab === "salesStatuses" ? 'Sales Status' : 'Candidate Sign Up For'} ${isEdit ? 'updated' : 'added'} successfully!`);
        fetchData(`/api/${activeTab === "salesStatuses" ? "sales-status" : "candidate_signup_for"}`, activeTab === "salesStatuses" ? setSalesStatuses : setCandidateSignUpFors);
        setShowModal(false);
        setCurrentItem({ id: null, status: "", order: null });
      }
    } catch (error) {
      toast.error(`Failed to ${isEdit ? 'update' : 'add'} the ${activeTab === "salesStatuses" ? 'sales status' : 'candidate sign up for'}. Please try again.`);
      console.error(`Error saving ${activeTab === "salesStatuses" ? 'sales status' : 'candidate sign up for'}:`, error);
    }
  };

  const handleDelete = async (id) => {
    const userConfirmed = window.confirm(`Are you sure you want to delete this ${activeTab === "salesStatuses" ? 'sales status' : 'candidate sign up for'}?`);
    
    if (userConfirmed) {
      try {
        const response = await axios.delete(`/api/${activeTab === "salesStatuses" ? "sales-status" : "candidate_signup_for"}?id=${id}`);
        if (response.status === 200) {
          toast.success(`${activeTab === "salesStatuses" ? 'Sales Status' : 'Candidate Sign Up For'} deleted successfully!`);
          fetchData(`/api/${activeTab === "salesStatuses" ? "sales-status" : "candidate_signup_for"}`, activeTab === "salesStatuses" ? setSalesStatuses : setCandidateSignUpFors);
        }
      } catch (error) {
        toast.error(`Failed to delete the ${activeTab === "salesStatuses" ? 'sales status' : 'candidate sign up for'}. Please try again.`);
        console.error(`Error deleting ${activeTab === "salesStatuses" ? 'sales status' : 'candidate sign up for'}:`, error);
      }
    }
  };

  useEffect(() => {
    fetchData("/api/sales-status", setSalesStatuses);
    fetchData("/api/candidate_signup_for", setCandidateSignUpFors);
  }, []);

  return (
    <AdminLayout>
      <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k)} className="mb-3">
        <Tab eventKey="salesStatuses" title="Sales Statuses">
          <Card>
            <Card.Header>Sales Statuses</Card.Header>
            <Card.Body>
              <Button variant="success" onClick={() => { setShowModal(true); setIsEdit(false); setCurrentItem({ id: null, status: "", order: null }); }}>
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
                    <tr key={status._id}>
                      <td>{index + 1}</td>
                      <td>{status.status}</td>
                      <td>
                        <Button variant="primary" onClick={() => { setShowModal(true); setIsEdit(true); setCurrentItem(status); }}>
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
        </Tab>
        <Tab eventKey="candidateSignUpFors" title="Candidate Sign Up Fors">
          <Card>
            <Card.Header>Candidate Sign Up Fors</Card.Header>
            <Card.Body>
              <Button variant="success" onClick={() => { setShowModal(true); setIsEdit(false); setCurrentItem({ id: null, status: "", order: null }); }}>
                Add Candidate Sign Up For
              </Button>

              <Table striped bordered hover className="mt-3">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Order</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {candidateSignUpFors.map((item, index) => (
                    <tr key={item._id}>
                      <td>{index + 1}</td>
                      <td>{item.order}</td>
                      <td>{item.status}</td>
                      <td>
                        <Button variant="primary" onClick={() => { setShowModal(true); setIsEdit(true); setCurrentItem(item); }}>
                          Edit
                        </Button>
                        <Button variant="danger" onClick={() => handleDelete(item._id)} className="ms-2">
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Tab>
      </Tabs>

      <ToastContainer position="top-right" autoClose={3000} />

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{isEdit ? 'Edit' : 'Add'} {activeTab === "salesStatuses" ? "Sales Status" : "Candidate Sign Up For"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {activeTab === "candidateSignUpFors" && (
              <Form.Group className="mb-3">
                <Form.Label>Order</Form.Label>
                <Form.Control
                  type="number"
                  value={currentItem.order || ''}
                  onChange={(e) => setCurrentItem({ ...currentItem, order: e.target.value })}
                />
              </Form.Group>
            )}
            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Control
                type="text"
                value={currentItem.status}
                onChange={(e) => setCurrentItem({ ...currentItem, status: e.target.value })}
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

export default AdminManagement;
