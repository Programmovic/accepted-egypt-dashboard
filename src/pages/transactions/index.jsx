import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Card, Col, Form, Modal, Row, Table } from "react-bootstrap";
import { AdminLayout } from "@layout";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ClassCard } from "@components/Classes";
import Select from "react-select";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterType, setFilterType] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [sortBy, setSortBy] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [filterDescription, setFilterDescription] = useState("");
  // State for new transaction creation
  const [newTransactionSelectedStudent, setNewTransactionSelectedStudent] =
    useState("");
  const [newTransactionStudent, setNewTransactionStudent] = useState("");
  const [newTransactionBatch, setNewTransactionBatch] = useState("");
  const [newTransactionType, setNewTransactionType] = useState("");
  const [newTransactionAmount, setNewTransactionAmount] = useState(0);
  const [newTransactionDescription, setNewTransactionDescription] =
    useState("");
  const [students, setStudents] = useState([]);

  // State for statistics
  const [statistics, setStatistics] = useState({
    totalTransactions: 0,
    totalTransactionAmount: 0,
    averageTransactionAmount: 0,
    receivedAmount: 0,
    dueAmount: 0,
    placementTestAmount: 0,
  });
  useEffect(() => {
    // Fetch the list of students when the component mounts
    axios.get("/api/student").then((response) => {
      if (response.status === 200) {
        console.log(response);
        setStudents(response.data.students);
      } else {
        console.error("Failed to fetch students.");
      }
    });
  }, []);
  const fetchTransactionData = async () => {
    try {
      const response = await axios.get("/api/transaction");
      if (response.status === 200) {
        const transactionData = response.data;
        setTransactions(transactionData);
        setFilteredTransactions(transactionData);
      }
    } catch (error) {
      console.error("Error fetching transaction data:", error);
      setError("Failed to fetch transaction data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactionData();
  }, []);

  const handleAddTransaction = async () => {
    try {
      const response = await axios.post("/api/transaction", {
        student: newTransactionStudent || null,
        batch: newTransactionBatch || null,
        type: newTransactionType,
        amount: newTransactionAmount,
        description: newTransactionDescription,
      });
      if (response.status === 201) {
        // Data added successfully
        fetchTransactionData();
        toast.success("Transaction added successfully!", {
          position: "top-right",
          autoClose: 3000,
        });
        setShowModal(false);
        // Clear the form fields
        setNewTransactionStudent("");
        setNewTransactionBatch("");
        setNewTransactionType("");
        setNewTransactionAmount("");
        setNewTransactionDescription("");
      } else {
        console.error("Unexpected status code:", response.status);
      }
    } catch (error) {
      console.error("Error adding transaction:", error);
      setError("Failed to add the transaction. Please try again.");
      toast.error("Failed to add the transaction. Please try again.", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const handleFilter = () => {
    let filtered = [...transactions];

    if (filterType) {
      filtered = filtered.filter(
        (transaction) =>
          transaction.type.toLowerCase() === filterType.toLowerCase()
      );
    }
    if (fromDate) {
      filtered = filtered.filter(
        (transaction) => new Date(transaction.createdAt) >= new Date(fromDate)
      );
    }

    if (toDate) {
      filtered = filtered.filter(
        (transaction) => new Date(transaction.createdAt) <= new Date(toDate)
      );
    }
    // Add description filter
    if (filterDescription) {
      filtered = filtered.filter((transaction) =>
        transaction.description
          ?.toLowerCase()
          .includes(filterDescription.toLowerCase())
      );
    }
    setFilteredTransactions(filtered);
  };

  useEffect(() => {
    // Automatically apply filters when filter inputs change
    handleFilter();
  }, [filterType, fromDate, toDate, filterDescription]);

  const clearFilters = () => {
    setFilterType("");
    setFilteredTransactions(transactions);
  };

  // Calculate statistics
  useEffect(() => {
    const totalTransactions = filteredTransactions.length;
    const totalTransactionAmount = filteredTransactions.reduce(
      (total, transaction) => total + transaction.amount,
      0
    );
    const averageTransactionAmount =
      totalTransactions > 0 ? totalTransactionAmount / totalTransactions : 0;
    const receivedAmount = filteredTransactions.reduce((total, transaction) => {
      if (transaction.type === "Income") {
        return total + transaction.amount;
      }
      return total;
    }, 0);

    const dueAmount = filteredTransactions.reduce((total, transaction) => {
      if (transaction.type === "Due") {
        return total + transaction.amount;
      }
      return total;
    }, 0);
    const placementTestAmount = filteredTransactions.reduce(
      (total, transaction) => {
        if (transaction.description === "Placement Test") {
          return total + transaction.amount;
        }
        return total;
      },
      0
    );

    setStatistics({
      totalTransactions,
      totalTransactionAmount,
      averageTransactionAmount,
      receivedAmount,
      dueAmount,
      placementTestAmount,
    });
  }, [filteredTransactions]);
  const sortTable = (column) => {
    if (column === sortBy) {
      // If the same column is clicked, toggle the sorting order
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      // If a new column is clicked, set the sorting column and order
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  // Apply sorting to filteredTransactions when sorting state changes
  useEffect(() => {
    if (sortBy) {
      const sortedTransactions = [...filteredTransactions].sort((a, b) => {
        const columnA = a[sortBy];
        const columnB = b[sortBy];

        if (columnA < columnB) {
          return sortOrder === "asc" ? -1 : 1;
        }
        if (columnA > columnB) {
          return sortOrder === "asc" ? 1 : -1;
        }
        return 0;
      });

      setFilteredTransactions(sortedTransactions);
    }
  }, [sortBy, sortOrder, filteredTransactions]);
  const handleTypeChange = (e) => {
    setNewTransactionType(e.target.value);
  };
  console.log(newTransactionStudent.value);
  return (
    <AdminLayout>
      <div className="row">
        <ClassCard
          data={statistics.totalTransactions}
          title="Total Transactions"
          enableOptions={false}
        />
        <ClassCard
          data={`${statistics.totalTransactionAmount} EGP`}
          title="Total Transaction Amount"
          enableOptions={false}
        />
        <ClassCard
          data={`${statistics.averageTransactionAmount.toFixed(2)} EGP`}
          title="Average Transaction Amount"
          enableOptions={false}
        />
        <ClassCard
          data={`${statistics.receivedAmount} EGP`}
          title="Total Received Amount"
          enableOptions={false}
        />
        <ClassCard
          data={`${statistics.dueAmount} EGP`}
          title="Total Due Amount"
          enableOptions={false}
        />
        <ClassCard
          data={`${statistics.placementTestAmount} EGP`}
          title="Total Received From Placement Test"
          enableOptions={false}
        />
      </div>
      <Card>
        <Card.Header>Transactions</Card.Header>
        <Card.Body>
          <Form className="mb-3">
            <Row>
              <Col xs={4}>
                {/* Date filtering inputs */}
                <Form.Group className="mb-3">
                  <Form.Label>From Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col xs={4}>
                <Form.Group className="mb-3">
                  <Form.Label>To Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col xs={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Filter by Type</Form.Label>
                  <div className="d-flex justify-content-between">
                    <Form.Check
                      type="checkbox"
                      label="Received"
                      id="type1"
                      checked={filterType === "Income"}
                      onChange={() =>
                        setFilterType(filterType === "Income" ? "" : "Income")
                      }
                    />
                    <Form.Check
                      type="checkbox"
                      label="Due"
                      id="type2"
                      checked={filterType === "Due"}
                      onChange={() =>
                        setFilterType(filterType === "Due" ? "" : "Due")
                      }
                    />
                    <Form.Check
                      type="checkbox"
                      label="Expense"
                      id="type2"
                      checked={filterType === "Expense"}
                      onChange={() =>
                        setFilterType(filterType === "Expense" ? "" : "Expense")
                      }
                    />
                  </div>
                </Form.Group>
              </Col>
              <Col xs={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    type="text"
                    value={filterDescription}
                    onChange={(e) => setFilterDescription(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Button variant="secondary" onClick={clearFilters}>
              Clear Filters
            </Button>
          </Form>

          <Button
            variant="success"
            onClick={() => setShowModal(true)}
            className="mb-3"
          >
            Add Transaction
          </Button>

          <Table striped bordered hover>
            <thead>
              <tr>
                <th>#</th>
                <th onClick={() => sortTable("student")}>
                  Student {sortBy === "student" && `(${sortOrder})`}
                </th>
                <th onClick={() => sortTable("batch")}>
                  Batch {sortBy === "batch" && `(${sortOrder})`}
                </th>
                <th onClick={() => sortTable("type")}>
                  Type {sortBy === "type" && `(${sortOrder})`}
                </th>
                <th onClick={() => sortTable("amount")}>
                  Amount {sortBy === "amount" && `(${sortOrder})`}
                </th>
                <th onClick={() => sortTable("description")}>
                  Description {sortBy === "description" && `(${sortOrder})`}
                </th>
                <th onClick={() => sortTable("createdAt")}>
                  Created At {sortBy === "createdAt" && `(${sortOrder})`}
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((transaction, index) => (
                <tr key={transaction._id}>
                  <td>{index + 1}</td>
                  <td>{transaction.student || "No Student"}</td>
                  <td>{transaction.batch || "No Batch"}</td>
                  <td>{transaction.type}</td>
                  <td>{transaction.amount} EGP</td>
                  <td>{transaction.description}</td>
                  <td>
                    {new Date(transaction.createdAt).toLocaleDateString()}
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
          <Modal.Title>Create New Transaction</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Student</Form.Label>
              <Select
                value={newTransactionSelectedStudent}
                options={students.map((student) => ({
                  value: student._id,
                  label: student.name,
                }))}
                onChange={(e) => {
                  setNewTransactionSelectedStudent(e);
                  setNewTransactionStudent(e.value);
                }}
                isClearable={true}
                isSearchable={true}
                placeholder="Student"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Batch</Form.Label>
              <Form.Control
                type="text"
                value={newTransactionBatch}
                onChange={(e) => setNewTransactionBatch(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Type</Form.Label>
              <div className="radio-group">
                <Form.Check
                  type="radio"
                  name="transactionType"
                  id="incomeRadio"
                  label="Receivable (income)"
                  value="Received"
                  checked={newTransactionType === "Received"}
                  onChange={handleTypeChange}
                />
                <Form.Check
                  type="radio"
                  name="transactionType"
                  id="expenseRadio"
                  label="Payable (Expense)"
                  value="Paid"
                  checked={newTransactionType === "Paid"}
                  onChange={handleTypeChange}
                />
                <Form.Check
                  type="radio"
                  name="transactionType"
                  id="dueRadio"
                  label="Due"
                  value="Due"
                  checked={newTransactionType === "Due"}
                  onChange={handleTypeChange}
                />
              </div>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Amount</Form.Label>
              <Form.Control
                type="number"
                value={newTransactionAmount}
                onChange={(e) => setNewTransactionAmount(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                value={newTransactionDescription}
                onChange={(e) => setNewTransactionDescription(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="success" onClick={handleAddTransaction}>
            Add Transaction
          </Button>
        </Modal.Footer>
      </Modal>
    </AdminLayout>
  );
};

export default Transactions;
