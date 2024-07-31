import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Card, Form, Modal, Table, Tabs, Tab } from "react-bootstrap";
import { AdminLayout } from "@layout";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminManagement = () => {
  const [candidateStatusesForRecruiter, setCandidateStatusesForRecruiter] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentItem, setCurrentItem] = useState({ id: null, status: "", description: "" });
  const [activeTab, setActiveTab] = useState("candidateStatusesForRecruiter");

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
      ? `api/${activeTab}?id=${currentItem._id}`
      : `api/${activeTab}`;

    const data = { status: currentItem.status, description: currentItem.description };

    try {
      const response = await axios[method](url, data);
      if (response.status === 201 || response.status === 200) {
        toast.success(`${activeTab === "candidateStatusesForRecruiter" ? 'Candidate Status For Recruiter' : ''} ${isEdit ? 'updated' : 'added'} successfully!`);
        fetchData(`/api/${activeTab}`, setCandidateStatusesForRecruiter);
        setShowModal(false);
        setCurrentItem({ id: null, status: "", description: "" });
      }
    } catch (error) {
      toast.error(`Failed to ${isEdit ? 'update' : 'add'} the ${activeTab}. Please try again.`);
      console.error(`Error saving ${activeTab}:`, error);
    }
  };

  const handleDelete = async (id) => {
    const userConfirmed = window.confirm(`Are you sure you want to delete this ${activeTab}?`);

    if (userConfirmed) {
      try {
        const response = await axios.delete(`/api/${activeTab}?id=${id}`);
        if (response.status === 200) {
          toast.success(`${activeTab} deleted successfully!`);
          fetchData(`/api/${activeTab}`, setCandidateStatusesForRecruiter);
        }
      } catch (error) {
        toast.error(`Failed to delete the ${activeTab}. Please try again.`);
        console.error(`Error deleting ${activeTab}:`, error);
      }
    }
  };

  useEffect(() => {
    fetchData("/api/candidate-status-for-recruiter", setCandidateStatusesForRecruiter);
  }, []);

  return (
    <AdminLayout>
      <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k)} className="mb-3">
        <Tab eventKey="candidateStatusesForRecruiter" title="Candidate Status For Recruiter">
          <Card>
            <Card.Header>Candidate Statuses For Recruiter</Card.Header>
            <Card.Body>
              <Button variant="success" onClick={() => { setShowModal(true); setIsEdit(false); }}>
                Add Candidate Status For Recruiter
              </Button>
              <Table striped bordered hover className="mt-3">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Status</th>
                    <th>Description</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {candidateStatusesForRecruiter.map((status, index) => (
                    <tr key={status.id}>
                      <td>{index + 1}</td>
                      <td>{status.status}</td>
                      <td>{status.description}</td>
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
      </Tabs>
      <ToastContainer position="top-right" autoClose={3000} />

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{isEdit ? 'Edit' : 'Add'} {activeTab}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Control
                type="text"
                value={currentItem.status}
                onChange={(e) => setCurrentItem({ ...currentItem, status: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                value={currentItem.description}
                onChange={(e) => setCurrentItem({ ...currentItem, description: e.target.value })}
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
