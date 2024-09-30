import { Card, Form, Button, Row, Col, Table, Badge, Modal } from "react-bootstrap";
import { useEffect, useState } from "react";
import { AdminLayout } from "@layout";
import axios from "axios";
import Select from "react-select";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/router";
const ElsaAccounts = () => {
  const router = useRouter();
  const [elsaAccounts, setElsaAccounts] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter states
  const [filterName, setFilterName] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [assignedTo, setAssignedTo] = useState(null);
  const [subscriptionStatus, setSubscriptionStatus] = useState("");

  // Create and Edit states
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentAccount, setCurrentAccount] = useState(null);

  // Form states
  const [student, setStudent] = useState(null);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("inactive");
  const [monthlyCost, setMonthlyCost] = useState("");
  const [comment, setComment] = useState("");

  const fetchElsaAccounts = async () => {
    try {
      const response = await axios.get("/api/elsa-accounts");
      if (response.status === 200) {
        const data = response.data;
        setElsaAccounts(data);
        setFilteredData(data);
        setStudents(data.students);
      }
    } catch (error) {
      console.error("Error fetching Elsa accounts:", error);
      setError("Failed to fetch Elsa accounts. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await axios.get("/api/student");
      console.log(response);
      if (response.status === 200) {
        setStudents(response.data.students);
      }
    } catch (error) {
      console.error("Error fetching students:", error.message);
      setError("Failed to fetch students. Please try again later.");
    }
  };

  useEffect(() => {
    fetchElsaAccounts();
    fetchStudents(); // Fetch students for the select dropdown
  }, []);
  useEffect(() => {
    fetchStudents(); // Fetch students for the select dropdown
  }, [currentAccount]);
  useEffect(() => {
    handleFilter();
  }, [filterName, filterDate, assignedTo, subscriptionStatus, elsaAccounts]);

  const handleFilter = () => {
    let filteredElsaAccounts = [...elsaAccounts];

    if (filterName) {
      filteredElsaAccounts = filteredElsaAccounts.filter((item) =>
        item.studentName.toLowerCase().includes(filterName.toLowerCase())
      );
    }

    if (filterDate) {
      filteredElsaAccounts = filteredElsaAccounts.filter((item) =>
        item.createdAt.includes(filterDate)
      );
    }

    if (assignedTo) {
      filteredElsaAccounts = filteredElsaAccounts.filter((item) =>
        item?.student.toLowerCase().includes(assignedTo.toLowerCase())
      );
    }

    if (subscriptionStatus) {
      filteredElsaAccounts = filteredElsaAccounts.filter((item) =>
        item.subscriptionStatus.toLowerCase().includes(subscriptionStatus.toLowerCase())
      );
    }

    setFilteredData(filteredElsaAccounts);
  };

  const clearFilters = () => {
    setFilterName("");
    setFilterDate("");
    setAssignedTo("");
    setSubscriptionStatus("");
    setFilteredData(elsaAccounts);
  };

  const handleCreateOrEdit = async () => {
    try {
      const accountData = {
        email,
        student: assignedTo || student,
        subscriptionStatus: status,
        monthlyCost,
        comment,
      };
      console.log(accountData);
      if (isEdit) {
        await axios.put(`/api/elsa-accounts?id=${currentAccount._id}`, accountData);
        toast.success("Elsa account updated successfully!");
      } else {
        await axios.post(`/api/elsa-accounts`, accountData);
        toast.success("Elsa account created successfully!");
      }

      fetchElsaAccounts();
      setShowModal(false);
    } catch (error) {
      console.error("Error creating or updating Elsa account:", error.message);
      setError("Failed to create or update Elsa account. Please try again.");
      toast.error(error.message);
    }
  };

  const handleDeleteElsaAccount = async (id) => {
    try {
      await axios.delete(`/api/elsa-accounts?id=${id}`);
      fetchElsaAccounts();
      toast.success("Elsa account deleted successfully!");
    } catch (error) {
      console.error("Error deleting Elsa account:", error.message);
      setError("Failed to delete Elsa account. Please try again.");
      toast.error(error.message);
    }
  };

  const openModal = (account = null) => {
    setCurrentAccount(account);
    console.log("here", account)
    if (account) {
      setEmail(account.email);
      setStudent(account.student);
      setStatus(account.subscriptionStatus);
      setMonthlyCost(account.monthlyCost);
      setComment(account.comment || "");
      setIsEdit(true);
    } else {
      setEmail("");
      setStudent("");
      setStatus("active");
      setMonthlyCost("");
      setComment("");
      setIsEdit(false);
    }
    setShowModal(true);
  };

  return (
    <AdminLayout>
      <ToastContainer />
      <Card>
        <Card.Header className="d-flex align-items-center">
          <div className="w-50">Manage Elsa Accounts</div>
          <Button onClick={() => openModal()} variant="success" className="ms-auto">
            Create New Account
          </Button>
        </Card.Header>
        <Card.Body>
          <Form className="mb-3">
            <Row>
              <Col xs={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Filter by Student Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={filterName}
                    onChange={(e) => setFilterName(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col xs={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Filter by Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={filterDate}
                    onChange={(e) => setFilterDate(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col xs={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Filter by Assigned To</Form.Label>
                  <Form.Control
                    type="text"
                    value={assignedTo}
                    onChange={(e) => setAssignedTo(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col xs={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Filter by Subscription Status</Form.Label>
                  <Form.Control
                    as="select"
                    value={subscriptionStatus}
                    onChange={(e) => setSubscriptionStatus(e.target.value)}
                  >
                    <option value="">Select Status</option>
                    <option value="active">Active</option>
                    <option value="expired">Expired</option>
                    <option value="pending">Pending</option>
                  </Form.Control>
                </Form.Group>
              </Col>
            </Row>
            <Button variant="secondary" onClick={clearFilters}>
              Clear Filters
            </Button>
          </Form>

          {/* Table to display Elsa accounts */}
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Email</th>
                <th>Student Name</th>
                <th>Subscription Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredData?.map((account) => (
                <tr key={account._id}>
                  <td>{account.email}</td>
                  <td>{account?.student?.name}</td>
                  <td>
                    <Badge bg={account.subscriptionStatus === "active" ? "success" : account.subscriptionStatus === "expired" ? "danger" : "warning"}>
                      {account.subscriptionStatus}
                    </Badge>
                    <br />
                    {(account.subscriptionStartDate && account.subscriptionEndDate) && (<>
                      From {new Date(account.subscriptionStartDate).toLocaleDateString()} to {new Date(account.subscriptionEndDate).toLocaleDateString()}
                    </>)}
                  </td>
                  <td className="d-flex justify-content-between">
                    <Button variant="primary" onClick={() => openModal(account)}>
                      Edit
                    </Button>{" "}
                    <Button variant="danger" onClick={() => handleDeleteElsaAccount(account._id)}>
                      Delete
                    </Button>
                    <Button variant="success" onClick={() => router.push(`/students/elsa_accounts/${account._id}`)}>
                      History
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Create/Edit Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{isEdit ? "Edit Elsa Account" : "Create Elsa Account"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Student</Form.Label>
              <Select
                options={students?.map((student) => ({
                  label: student.name,
                  value: student._id,
                }))}
                value={students?.find((s) => s.value === student)} // Correctly set the selected value
                onChange={(selected) => setStudent(selected?.value)} // Set the selected value correctly
                isSearchable
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Control
                as="select"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="canceled">Canceled</option>
              </Form.Control>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Monthly Cost</Form.Label>
              <Form.Control
                type="number"
                value={monthlyCost}
                onChange={(e) => setMonthlyCost(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Comment</Form.Label>
              <Form.Control
                as="textarea"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleCreateOrEdit}>
            {isEdit ? "Update" : "Create"}
          </Button>
        </Modal.Footer>
      </Modal>
    </AdminLayout>
  );
};

export default ElsaAccounts;