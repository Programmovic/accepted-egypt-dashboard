import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Button, Card, Col, Form, Modal, Row, Table } from "react-bootstrap";
import { AdminLayout } from "@layout";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ClassCard } from "@components/Classes";
import Select from "react-select";
import TransactionsSummary from "../../components/FinanceSummary";

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
  const [filterStudent, setFilterStudent] = useState("");
  const [filterBatch, setFilterBatch] = useState("");

  // State for new transaction creation
  const [newTransactionSelectedStudent, setNewTransactionSelectedStudent] =
    useState("");
  const [newTransactionStudent, setNewTransactionStudent] = useState("");
  const [newTransactionBatch, setNewTransactionBatch] = useState("");
  const [newTransactionType, setNewTransactionType] = useState("");
  const [newTransactionAmount, setNewTransactionAmount] = useState(0);
  const [newTransactionDescription, setNewTransactionDescription] =
    useState("");
  const [newTransactionExpenseType, setNewTransactionExpenseType] =
    useState("");
  const [students, setStudents] = useState([]);
  const [batches, setBatches] = useState([]);

  // State for statistics
  const [statistics, setStatistics] = useState({
    totalTransactions: 0,
    totalTransactionAmount: 0,
    averageTransactionAmount: 0,
    receivedAmount: 0,
    expensesAmount: 0,
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
  useEffect(() => {
    // Fetch the list of students when the component mounts
    axios.get("/api/batch").then((response) => {
      if (response.status === 200) {
        console.log(response);
        setBatches(response.data);
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
console.log(newTransactionDescription)
const handleAddTransaction = async () => {
  try {
    // Validate input fields
    const newTransactionData = {
      student: newTransactionStudent || null,
      batch: newTransactionBatch?._id || null,
      type: newTransactionType,
      expense_type: newTransactionExpenseType,
      amount: newTransactionAmount,
      description: newTransactionDescription,
    };

    console.log("newTransactionData", newTransactionData);
    if (!newTransactionType) {
      // Display an error message for missing type
      toast.error("Please provide a transaction type.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    if (newTransactionType === "Expense" && !newTransactionExpenseType) {
      // Display an error message for missing expense type
      toast.error("Please provide an expense type.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    if (!newTransactionAmount) {
      // Display an error message for missing amount
      toast.error("Please provide an amount.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    const response = await axios.post("/api/transaction", newTransactionData);
    if (response.status === 201) {
      // Data added successfully
      fetchTransactionData();
      toast.success("Transaction added successfully!", {
        position: "top-right",
        autoClose: 3000,
      });
      setShowModal(false);
      // Clear the form fields
      resetNewTransactionForm();
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
    if (filterStudent) {
      filtered = filtered.filter((transaction) => {
        const studentName = students.find(
          (student) => student._id === transaction.student
        )?.name;
        return studentName?.toLowerCase() === filterStudent.toLowerCase();
      });
    }
    if (filterBatch) {
      filtered = filtered.filter(
        (transaction) => transaction.batch === filterBatch
      );
    }
    saveFiltersToLocalStorage();
    setFilteredTransactions(filtered);
  };

  useEffect(() => {
    // Automatically apply filters when filter inputs change
    handleFilter();
  }, [filterType, fromDate, toDate, filterDescription, filterStudent, filterBatch]);

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
    const expensesAmount = filteredTransactions.reduce((total, transaction) => {
      if (transaction.type === "Expense") {
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
      expensesAmount,
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
  const batch =
    batches.find(
      (batch) =>
        batch._id ===
        students.find(
          (student) => student._id === newTransactionSelectedStudent?.value
        )?.batch
    ) || "";

  useEffect(() => {
    // Automatically apply filters when filter inputs change
    setNewTransactionBatch(batch);
  }, [batch, newTransactionStudent]);

  console.log("newTransactionBatch", newTransactionBatch);
  const resetNewTransactionForm = () => {
    setNewTransactionSelectedStudent("");
    setNewTransactionStudent("");
    setNewTransactionBatch("");
    setNewTransactionType("");
    setNewTransactionAmount(0);
    setNewTransactionDescription("");
  };
  const initialLevelIncomes = {};

  // ...

  // Calculate incomes for each level
  const calculateLevelIncomes = () => {
    // Initialize the level incomes with zeros
    const levelIncomes = { ...initialLevelIncomes };

    filteredTransactions.forEach((transaction) => {
      // Find the associated batch based on the student ID
      const batch = batches.find(
        (b) => transaction.batch && b._id === transaction.batch
      );

      if (batch) {
        const levelName = batch.levelName;

        // Calculate income only for "Income" type transactions
        if (transaction.type === "Income") {
          // Initialize the level's income if it's not in the levelIncomes object
          if (!levelIncomes[levelName]) {
            levelIncomes[levelName] = 0;
          }

          // Accumulate the income for the level
          levelIncomes[levelName] += transaction.amount;
        }
      }
    });

    return levelIncomes;
  };
  const levelIncomes = calculateLevelIncomes();
  const expenseOptions = [
    "Extras",
    "Maintenance",
    "Tools for the office",
    "Water",
    "Electricity",
    "Cleaning",
    "Stationery",
    "Salary",
  ];
  const handleDeleteTransaction = async (transactionId) => {
    // Show confirmation dialog
    const confirmed = window.confirm(
      `Are you sure you want to delete this transaction?`
    );

    if (confirmed) {
      try {
        const response = await axios.delete(
          `/api/transaction?id=${transactionId}`
        );
        if (response.status === 200) {
          // Data deleted successfully
          fetchTransactionData();
          toast.success("Transaction deleted successfully!", {
            position: "top-right",
            autoClose: 3000,
          });
        } else {
          console.error("Unexpected status code:", response.status);
        }
      } catch (error) {
        console.error("Error deleting transaction:", error);
        setError("Failed to delete the transaction. Please try again.");
        toast.error("Failed to delete the transaction. Please try again.", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    }
  };
  const [currentPage, setCurrentPage] = useState(1); // Current page number
  const transactionsPerPage = 10; // Number of transactions to display per page

  // Calculate the indexes for transactions to display on the current page
  const indexOfLastTransaction = currentPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentTransactions = filteredTransactions.slice(
    indexOfFirstTransaction,
    indexOfLastTransaction
  );

  // Function to change the current page
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updatingTransaction, setUpdatingTransaction] = useState(null);
  const handleUpdateTransaction = (transaction) => {
    // Set the transaction to update

    // Show the modal for updating the transaction
    setShowUpdateModal(true);
  };
  const LOCAL_STORAGE_KEYS = {
    FILTER_TYPE: "filterType",
    FROM_DATE: "fromDate",
    TO_DATE: "toDate",
    FILTER_DESCRIPTION: "filterDescription",
    FILTER_STUDENT: "filterStudent",
  };
  const saveFiltersToLocalStorage = () => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.FILTER_TYPE, filterType);
    localStorage.setItem(LOCAL_STORAGE_KEYS.FROM_DATE, fromDate);
    localStorage.setItem(LOCAL_STORAGE_KEYS.TO_DATE, toDate);
    localStorage.setItem(
      LOCAL_STORAGE_KEYS.FILTER_DESCRIPTION,
      filterDescription
    );
    localStorage.setItem(LOCAL_STORAGE_KEYS.FILTER_STUDENT, filterStudent);
  };
  const tableRef = useRef(null);

  // ... (existing code)

  const scrollToTable = () => {
    // Use the scrollIntoView method to scroll to the table
    tableRef.current.scrollIntoView({ behavior: "smooth" });
  };
  return (
    <AdminLayout>
      <p className="bg-warning text-center p-3 rounded-3">
        <b>Note: </b>Deleting transaction may cause some errors due to
        uncompleted configurations in paid and due amounts.
      </p>
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
                  <Form.Label>Filter by Student</Form.Label>
                  <Select
                    value={filterStudent.label}
                    options={students.map((student) => ({
                      value: student.name,
                      label: student.name,
                    }))}
                    isClearable={true}
                    isSearchable={true}
                    onChange={(selectedOption) =>
                      setFilterStudent(selectedOption?.value || "")
                    }
                  />
                </Form.Group>
              </Col>
              <Col xs={6}>
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
                      label="Expense"
                      id="type3"
                      checked={filterType === "Expense"}
                      onChange={() =>
                        setFilterType(filterType === "Expense" ? "" : "Expense")
                      }
                    />
                    <Form.Check
                      type="checkbox"
                      label="Refund"
                      id="type4"
                      checked={filterType === "Refund"}
                      onChange={() =>
                        setFilterType(filterType === "Refund" ? "" : "Refund")
                      }
                    />
                  </div>
                </Form.Group>
              </Col>
              <Col xs={6}>
  <Form.Group className="mb-3">
    <Form.Label>Filter by Batch</Form.Label>
    <Select
      value={filterBatch.label}
      options={batches.map((batch) => ({
        value: batch._id,
        label: batch.name,
      }))}
      isClearable={true}
      isSearchable={true}
      onChange={(selectedOption) =>
        setFilterBatch(selectedOption?.value || "")
      }
    />
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
            <div className="d-flex justify-content-between">
              <Button variant="secondary" onClick={clearFilters}>
                Clear Filters
              </Button>
              <Button variant="success" onClick={() => setShowModal(true)}>
                Add Transaction
              </Button>
              <Button variant="primary" onClick={scrollToTable}>
                Scroll to Transactions
              </Button>
            </div>
          </Form>

          <TransactionsSummary
            transactions={transactions}
            statistics={statistics}
            batches={batches}
            levelIncomes={levelIncomes}
            expenseOptions={expenseOptions}
          />
          <span>* Click on any column to sort by it</span>
          <Table striped bordered hover ref={tableRef}>
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
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentTransactions.map((transaction, index) => (
                <tr key={transaction._id}>
                  <td>{index + 1}</td>
                  <td>
                    {
                      students.find(
                        (student) => student._id === transaction.student
                      )?.name
                    }
                  </td>
                  <td>
                    {transaction.batch
                      ? batches.find((batch) => batch._id === transaction.batch)
                          ?.name
                      : "No Batch"}
                  </td>
                  <td>{transaction.type}</td>
                  <td>{transaction.amount} EGP</td>
                  <td>{transaction.description}</td>
                  <td>
                    {new Date(transaction.createdAt).toLocaleDateString()}
                  </td>
                  <td className="text-center">
                    <Button
                      variant="danger"
                      onClick={() => handleDeleteTransaction(transaction._id)}
                    >
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
      <Modal
        show={showModal}
        onHide={() => {
          setShowModal(false);
          resetNewTransactionForm();
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Create New Transaction</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            
            <Form.Group className="mb-3">
              <Form.Label>Type</Form.Label>
              <div className="radio-group">
                <Form.Check
                  type="radio"
                  name="transactionType"
                  id="incomeRadio"
                  label="Receivable (income)"
                  value="Income"
                  checked={newTransactionType === "Income"}
                  onChange={handleTypeChange}
                  required
                />
                <Form.Check
                  type="radio"
                  name="transactionType"
                  id="expenseRadio"
                  label="Payable (Expense)"
                  value="Expense"
                  checked={newTransactionType === "Expense"}
                  onChange={handleTypeChange}
                  required
                />
                <Form.Check
                  type="radio"
                  name="transactionType"
                  id="dueRadio"
                  label="Due"
                  value="Due"
                  checked={newTransactionType === "Due"}
                  onChange={handleTypeChange}
                  required
                />
                <Form.Check
                  type="radio"
                  name="transactionType"
                  id="refundRadio"
                  label="Refund"
                  value="Refund"
                  checked={newTransactionType === "Refund"}
                  onChange={handleTypeChange}
                  required
                />
              </div>
            </Form.Group>
            {newTransactionType === "Expense" && (
              <Form.Group className="mb-3">
                <Form.Label>Expense Type</Form.Label>
                <Form.Control
                  as="select"
                  value={newTransactionExpenseType}
                  onChange={(e) => setNewTransactionExpenseType(e.target.value)}
                  required
                >
                  <option value="" hidden>Select an Expense Type</option>
                  {expenseOptions.map((expenseType) => (
                    <option key={expenseType} value={expenseType}>
                      {expenseType}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
            )}
            {
              newTransactionType !== "Expense" && newTransactionType && 
              <>
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
                  setNewTransactionStudent(e?.value);
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
                value={newTransactionBatch && newTransactionBatch?.name}
                disabled
              />
            </Form.Group></>
            }
            <Form.Group className="mb-3">
              <Form.Label>Amount</Form.Label>
              <Form.Control
                type="number"
                value={newTransactionAmount}
                onChange={(e) => setNewTransactionAmount(e.target.value)}
                required
              />
            </Form.Group>
            {newTransactionSelectedStudent && (
              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="select"
                  value={newTransactionDescription}
                  onChange={(e) => setNewTransactionDescription(e.target.value)}
                  required
                >
                  <option value="" hidden>Select The Transaction Description</option>
                  <option value="Course Fee">Course Fee</option>
                  <option value="Material">Material</option>
                </Form.Control>
              </Form.Group>
            )}
            {/* Render the description as a text input if no student is selected */}
            {!newTransactionSelectedStudent && (
              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  type="text"
                  value={newTransactionDescription}
                  onChange={(e) => setNewTransactionDescription(e.target.value)}
                  required
                />
              </Form.Group>
            )}
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
      <Modal
        show={showUpdateModal}
        onHide={() => {
          setShowUpdateModal(false);
          setUpdatingTransaction(null); // Reset the transaction to update
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Update Transaction</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {updatingTransaction && (
            <Form>
              {/* Similar form fields as in the "Add Transaction" modal */}
              {/* Populate the form fields with updatingTransaction data */}
              <Form.Group className="mb-3">
                <Form.Label>Amount</Form.Label>
                <Form.Control
                  type="number"
                  value={updatingTransaction.amount}
                  onChange={(e) =>
                    setUpdatingTransaction({
                      ...updatingTransaction,
                      amount: e.target.value,
                    })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  type="text"
                  value={updatingTransaction.description}
                  onChange={(e) =>
                    setUpdatingTransaction({
                      ...updatingTransaction,
                      description: e.target.value,
                    })
                  }
                />
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowUpdateModal(false)}>
            Close
          </Button>
          <Button variant="success" onClick={handleUpdateTransaction}>
            Update Transaction
          </Button>
        </Modal.Footer>
      </Modal>
      <div className="pagination py-5 flex justify-content-between">
        <Button
          variant="secondary"
          disabled={currentPage === 1}
          onClick={() => paginate(currentPage - 1)}
        >
          Previous
        </Button>
        <Button
          variant="secondary"
          disabled={
            currentPage ===
            Math.ceil(filteredTransactions.length / transactionsPerPage)
          }
          onClick={() => paginate(currentPage + 1)}
        >
          Next
        </Button>
      </div>
    </AdminLayout>
  );
};

export default Transactions;
