'use Client'
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
import { useRouter } from "next/router";

const AdminManagement = () => {
  const router = useRouter();
  const [salesStatuses, setSalesStatuses] = useState([]);
  const [candidateSignUpFors, setCandidateSignUpFors] = useState([]);
  const [candidateStatusesForSalesPerson, setCandidateStatusesForSalesPerson] = useState([]);
  const [paymentScreenshotStatuses, setPaymentScreenshotStatuses] = useState([]);
  const [salesRejectionReasons, setSalesRejectionReasons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentItem, setCurrentItem] = useState({ id: null, status: "", order: null, description: "" });

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
      ? `api/${activeTab}?id=${currentItem._id}`
      : `api/${activeTab}`;

    const data = { status: currentItem.status, description: currentItem.description, reason: currentItem.reason };

    if (activeTab === "candidate_signup_for") {
      data.order = currentItem.order;
    }

    try {
      const response = await axios[method](url, data);
      if (response.status === 201 || response.status === 200) {
        toast.success(`${activeTab === "sales-status" ? 'Sales Status' : activeTab === "candidate_signup_for" ? 'Candidate Sign Up For' : activeTab === "candidate-status-for-sales-person" ? 'Candidate Status For Sales Person' : activeTab === "payment-screenshot-status" ? 'Payment Screenshot Status' : 'Sales Rejection Reason'} ${isEdit ? 'updated' : 'added'} successfully!`);
        fetchData(`/api/${activeTab}`, activeTab === "sales-status" ? setSalesStatuses : activeTab === "candidate_signup_for" ? setCandidateSignUpFors : activeTab === "candidate-status-for-sales-person" ? setCandidateStatusesForSalesPerson : activeTab === "payment-screenshot-status" ? setPaymentScreenshotStatuses : setSalesRejectionReasons);
        setShowModal(false);
        setCurrentItem({ id: null, status: "", order: null, description: "" });
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
          fetchData(`/api/${activeTab}`, activeTab === "sales-status" ? setSalesStatuses : activeTab === "candidate_signup_for" ? setCandidateSignUpFors : activeTab === "candidate-status-for-sales-person" ? setCandidateStatusesForSalesPerson : activeTab === "payment-screenshot-status" ? setPaymentScreenshotStatuses : setSalesRejectionReasons);
        }
      } catch (error) {
        toast.error(`Failed to delete the ${activeTab}. Please try again.`);
        console.error(`Error deleting ${activeTab}:`, error);
      }
    }
  };
  useEffect(() => {
    const { selected } = router.query;
    if (selected) {
      setActiveTab(selected);
    }
  }, [router.query]);
  useEffect(() => {
    fetchData("/api/sales-status", setSalesStatuses);
    fetchData("/api/candidate_signup_for", setCandidateSignUpFors);
    fetchData("/api/candidate-status-for-sales-person", setCandidateStatusesForSalesPerson);
    fetchData("/api/payment-screenshot-status", setPaymentScreenshotStatuses);
    fetchData("/api/sales-rejection-reason", setSalesRejectionReasons);
  }, []);

  return (
    <AdminLayout>
      <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k)} className="mb-3">
        <Tab eventKey="sales-status" title="Sales Status">
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
        <Tab eventKey="candidate_signup_for" title="Candidate Sign Up For">
          <Card>
            <Card.Header>Candidate Sign Up For</Card.Header>
            <Card.Body>
              <Button variant="success" onClick={() => { setShowModal(true); setIsEdit(false); }}>
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
                  {candidateSignUpFors.map((signUp, index) => (
                    <tr key={signUp.id}>
                      <td>{index + 1}</td>
                      <td>{signUp.order}</td>
                      <td>{signUp.status}</td>
                      <td>
                        <Button variant="primary" onClick={() => { setShowModal(true); setIsEdit(true); setCurrentItem(signUp); }}>
                          Edit
                        </Button>
                        <Button variant="danger" onClick={() => handleDelete(signUp._id)} className="ms-2">
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
        <Tab eventKey="candidate-status-for-sales-person" title="Candidate Status For Sales Person">
          <Card>
            <Card.Header>Candidate Statuses For Sales Person</Card.Header>
            <Card.Body>
              <Button variant="success" onClick={() => { setShowModal(true); setIsEdit(false); }}>
                Add Candidate Status For Sales Person
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
                  {candidateStatusesForSalesPerson.map((status, index) => (
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
        <Tab eventKey="payment-screenshot-status" title="Payment Screenshot Status">
          <Card>
            <Card.Header>Payment Screenshot Statuses</Card.Header>
            <Card.Body>
              <Button variant="success" onClick={() => { setShowModal(true); setIsEdit(false); }}>
                Add Payment Screenshot Status
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
                  {paymentScreenshotStatuses.map((status, index) => (
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
        <Tab eventKey="sales-rejection-reason" title="Sales Rejection Reason">
          <Card>
            <Card.Header>Sales Rejection Reasons</Card.Header>
            <Card.Body>
              <Button variant="success" onClick={() => { setShowModal(true); setIsEdit(false); }}>
                Add Sales Rejection Reason
              </Button>

              <Table striped bordered hover className="mt-3">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Reason</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {salesRejectionReasons.map((reason, index) => (
                    <tr key={reason.id}>
                      <td>{index + 1}</td>
                      <td>{reason.reason}</td>
                      <td>
                        <Button variant="primary" onClick={() => { setShowModal(true); setIsEdit(true); setCurrentItem(reason); }}>
                          Edit
                        </Button>
                        <Button variant="danger" onClick={() => handleDelete(reason._id)} className="ms-2">
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
            {activeTab === "candidate_signup_for" && (
              <Form.Group className="mb-3">
                <Form.Label>Order</Form.Label>
                <Form.Control
                  type="number"
                  value={currentItem.order}
                  onChange={(e) => setCurrentItem({ ...currentItem, order: e.target.value })}
                />
              </Form.Group>
            )}
            {(activeTab === "sales-status" || activeTab === "candidate_signup_for" || activeTab === "candidate-status-for-sales-person" || activeTab === "payment-screenshot-status") ? (
              <Form.Group className="mb-3">
                <Form.Label>Status</Form.Label>
                <Form.Control
                  type="text"
                  value={currentItem.status}
                  onChange={(e) => setCurrentItem({ ...currentItem, status: e.target.value })}
                />
              </Form.Group>
            ) : (
              <Form.Group className="mb-3">
                <Form.Label>Reason</Form.Label>
                <Form.Control
                  type="text"
                  value={currentItem.reason}
                  onChange={(e) => setCurrentItem({ ...currentItem, reason: e.target.value })}
                />
              </Form.Group>
            )}
            {(activeTab === "candidateStatusesForSalesPerson" || activeTab === "paymentScreenshotStatuses") && (
              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  type="text"
                  value={currentItem.description}
                  onChange={(e) => setCurrentItem({ ...currentItem, description: e.target.value })}
                />
              </Form.Group>
            )}
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
