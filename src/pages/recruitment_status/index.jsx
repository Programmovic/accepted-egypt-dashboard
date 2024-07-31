import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Card, Form, Modal, Table, Tabs, Tab } from "react-bootstrap";
import { AdminLayout } from "@layout";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminManagement = () => {
  const [candidateStatusesForRecruiter, setCandidateStatusesForRecruiter] = useState([]);
  const [phoneInterviewStatuses, setPhoneInterviewStatuses] = useState([]);
  const [faceToFaceStatuses, setFaceToFaceStatuses] = useState([]);
  const [feedbackSessionStatuses, setFeedbackSessionStatuses] = useState([]);
  const [recruitmentTestResultStatuses, setRecruitmentTestResultStatuses] = useState([]);
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
        toast.success(`${getActiveTabName(activeTab)} ${isEdit ? 'updated' : 'added'} successfully!`);
        reloadActiveTabData(activeTab);
        setShowModal(false);
        setCurrentItem({ id: null, status: "", description: "" });
      }
    } catch (error) {
      toast.error(`Failed to ${isEdit ? 'update' : 'add'} the ${getActiveTabName(activeTab)}. Please try again.`);
      console.error(`Error saving ${activeTab}:`, error);
    }
  };

  const handleDelete = async (id) => {
    const userConfirmed = window.confirm(`Are you sure you want to delete this ${getActiveTabName(activeTab)}?`);

    if (userConfirmed) {
      try {
        const response = await axios.delete(`/api/${activeTab}?id=${id}`);
        if (response.status === 200) {
          toast.success(`${getActiveTabName(activeTab)} deleted successfully!`);
          reloadActiveTabData(activeTab);
        }
      } catch (error) {
        toast.error(`Failed to delete the ${getActiveTabName(activeTab)}. Please try again.`);
        console.error(`Error deleting ${activeTab}:`, error);
      }
    }
  };

  const getActiveTabName = (tab) => {
    switch (tab) {
      case "candidateStatusesForRecruiter":
        return "Candidate Status For Recruiter";
      case "phoneInterviewStatuses":
        return "Phone Interview Status";
      case "faceToFaceStatuses":
        return "Face To Face Status";
      case "feedbackSessionStatuses":
        return "Feedback Session Status";
      case "recruitmentTestResultStatuses":
        return "Recruitment Test Result Status";
      default:
        return "";
    }
  };

  const reloadActiveTabData = (tab) => {
    switch (tab) {
      case "candidateStatusesForRecruiter":
        fetchData("/api/candidate-status-for-recruiter", setCandidateStatusesForRecruiter);
        break;
      case "phoneInterviewStatuses":
        fetchData("/api/phone-interview-status", setPhoneInterviewStatuses);
        break;
      case "faceToFaceStatuses":
        fetchData("/api/face-to-face-status", setFaceToFaceStatuses);
        break;
      case "feedbackSessionStatuses":
        fetchData("/api/feedback-session-status", setFeedbackSessionStatuses);
        break;
      case "recruitmentTestResultStatuses":
        fetchData("/api/recruitment-test-result-status", setRecruitmentTestResultStatuses);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    fetchData("/api/candidate-status-for-recruiter", setCandidateStatusesForRecruiter);
    fetchData("/api/phone-interview-status", setPhoneInterviewStatuses);
    fetchData("/api/face-to-face-status", setFaceToFaceStatuses);
    fetchData("/api/feedback-session-status", setFeedbackSessionStatuses);
    fetchData("/api/recruitment-test-result-status", setRecruitmentTestResultStatuses);
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
                    <tr key={status._id}>
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
        <Tab eventKey="phoneInterviewStatuses" title="Phone Interview Status">
          <Card>
            <Card.Header>Phone Interview Statuses</Card.Header>
            <Card.Body>
              <Button variant="success" onClick={() => { setShowModal(true); setIsEdit(false); }}>
                Add Phone Interview Status
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
                  {phoneInterviewStatuses.map((status, index) => (
                    <tr key={status._id}>
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
        <Tab eventKey="faceToFaceStatuses" title="Face To Face Status">
          <Card>
            <Card.Header>Face To Face Statuses</Card.Header>
            <Card.Body>
              <Button variant="success" onClick={() => { setShowModal(true); setIsEdit(false); }}>
                Add Face To Face Status
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
                  {faceToFaceStatuses.map((status, index) => (
                    <tr key={status._id}>
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
        <Tab eventKey="feedbackSessionStatuses" title="Feedback Session Status">
          <Card>
            <Card.Header>Feedback Session Statuses</Card.Header>
            <Card.Body>
              <Button variant="success" onClick={() => { setShowModal(true); setIsEdit(false); }}>
                Add Feedback Session Status
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
                  {feedbackSessionStatuses.map((status, index) => (
                    <tr key={status._id}>
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
        <Tab eventKey="recruitmentTestResultStatuses" title="Recruitment Test Result Status">
          <Card>
            <Card.Header>Recruitment Test Result Statuses</Card.Header>
            <Card.Body>
              <Button variant="success" onClick={() => { setShowModal(true); setIsEdit(false); }}>
                Add Recruitment Test Result Status
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
                  {recruitmentTestResultStatuses.map((status, index) => (
                    <tr key={status._id}>
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

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{isEdit ? "Edit" : "Add"} {getActiveTabName(activeTab)}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formStatus">
              <Form.Label>Status</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter status"
                value={currentItem.status}
                onChange={(e) => setCurrentItem({ ...currentItem, status: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter description"
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
          <Button variant="primary" onClick={handleSave}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      <ToastContainer />
    </AdminLayout>
  );
};

export default AdminManagement;
