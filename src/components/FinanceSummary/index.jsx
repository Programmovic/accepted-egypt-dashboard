import React, { useState, useRef } from "react";
import { Table, Card, Form } from "react-bootstrap";
import { DownloadTableExcel } from "react-export-table-to-excel";
import { Button } from "react-bootstrap";
import { faFile } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const TransactionsSummary = ({
  transactions,
  batches,
  levelIncomes,
  statistics,
  expenseOptions,
}) => {
  const totalReceivedAmount = statistics.receivedAmount;
  const totalExpensedAmount = statistics.expensesAmount;
  const receivedAmountSummary = useRef(null);
  const levelIncomeSummary = useRef(null);
  const expenseSummary = useRef(null);
  const financeSummary = useRef(null);
  const revenueSummary = useRef(null);

  const [targetValues, setTargetValues] = useState({});
  const [expenseTargetValues, setExpenseTargetValues] = useState({});

  const handleTargetChange = (levelName, value) => {
    setTargetValues({
      ...targetValues,
      [levelName]: value,
    });
  };

  const handleExpenseTargetChange = (expenseType, value) => {
    setExpenseTargetValues({
      ...expenseTargetValues,
      [expenseType]: value,
    });
  };

  return (
    <Card className="mb-4">
      <Card.Header className="d-flex justify-content-between align-items-center">
        <p className="mb-0">
        Received Amount Summary
        </p>
        <DownloadTableExcel
          filename="Received Amount Summary"
          sheet="ReceivedAmountSummary"
          currentTableRef={receivedAmountSummary.current}
        >
          <Button variant="outline-light" className="fw-bold">
            <FontAwesomeIcon icon={faFile} className="me-1" />
            Export
          </Button>
        </DownloadTableExcel>
      </Card.Header>
      <Card.Body>
        <Table striped bordered hover ref={receivedAmountSummary}>
          <thead>
            <tr>
              <th>Total Amount Received (EGP)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "EGP",
                }).format(totalReceivedAmount)}
              </td>
            </tr>
          </tbody>
        </Table>
      </Card.Body>

      <Card.Header>Level Income Summary</Card.Header>
      <Card.Body>
        <DownloadTableExcel
          filename="Level Income Summary"
          sheet="LevelIncomeSummary"
          currentTableRef={levelIncomeSummary.current}
        >
          <Button variant="outline-primary" className="mb-3">
            <FontAwesomeIcon icon={faFile} className="me-1" />
            Export
          </Button>
        </DownloadTableExcel>

        <Table striped bordered hover ref={levelIncomeSummary}>
          <thead>
            <tr>
              <th>Level</th>
              <th>Target</th>
              <th>Income Achieved</th>
              <th>Percentage (%)</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(levelIncomes).map((levelName) => (
              <tr key={levelName}>
                <td>{levelName}</td>
                <td>
                  <Form.Control
                    type="number"
                    value={targetValues[levelName] || 0}
                    onChange={(e) =>
                      handleTargetChange(levelName, parseFloat(e.target.value))
                    }
                  />
                </td>
                <td>
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "EGP",
                  }).format(levelIncomes[levelName])}
                </td>
                <td>
                  {targetValues[levelName] > 0
                    ? (
                        (levelIncomes[levelName] / targetValues[levelName]) *
                        100
                      ).toFixed(2) + "%"
                    : "N/A"}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card.Body>

      <Card.Header>Expensed Amount Summary</Card.Header>
      <Card.Body>
        <DownloadTableExcel
          filename="Expensed Amount Summary"
          sheet="ExpensedAmountSummary"
          currentTableRef={expenseSummary.current}
        >
          <Button variant="outline-primary" className="mb-3">
            <FontAwesomeIcon icon={faFile} className="me-1" />
            Export
          </Button>
        </DownloadTableExcel>

        <Table striped bordered hover ref={expenseSummary}>
          <thead>
            <tr>
              <th>Expense Type</th>
              <th>Target</th>
              <th>Expensed</th>
              <th>Percentage (%)</th>
            </tr>
          </thead>
          <tbody>
            {expenseOptions.map((expenseType) => (
              <tr key={expenseType}>
                <td>{expenseType}</td>
                <td>
                  <Form.Control
                    type="number"
                    value={expenseTargetValues[expenseType] || 0}
                    onChange={(e) =>
                      handleExpenseTargetChange(
                        expenseType,
                        parseFloat(e.target.value)
                      )
                    }
                  />
                </td>
                <td>
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "EGP",
                  }).format(
                    transactions
                      .filter(
                        (transaction) =>
                          transaction.type === "Expense" &&
                          transaction.expense_type === expenseType
                      )
                      .reduce(
                        (total, transaction) => total + transaction.amount,
                        0
                      )
                  )}
                </td>
                <td>
                  {expenseTargetValues[expenseType] > 0
                    ? (
                        (transactions
                          .filter(
                            (transaction) =>
                              transaction.type === "Expense" &&
                              transaction.expense_type === expenseType
                          )
                          .reduce(
                            (total, transaction) => total + transaction.amount,
                            0
                          ) /
                          expenseTargetValues[expenseType]) *
                        100
                      ).toFixed(2) + "%"
                    : "N/A"}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card.Body>

      <Card.Header>Finance Summary</Card.Header>
      <Card.Body>
        <DownloadTableExcel
          filename="Finance Summary"
          sheet="FinanceSummary"
          currentTableRef={financeSummary.current}
        >
          <Button variant="outline-primary" className="mb-3">
            <FontAwesomeIcon icon={faFile} className="me-1" />
            Export
          </Button>
        </DownloadTableExcel>

        <Table striped bordered hover ref={financeSummary}>
          <thead>
            <tr>
              <th>Income Target</th>
              <th>Income Achieved</th>
              <th>%</th>
              <th>Expenses Target</th>
              <th>Expenses Achieved</th>
              <th>%</th>
              <th>Refund Target</th>
              <th>Refund Achieved</th>
              <th>%</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <Form.Control
                  type="number"
                  value={targetValues["income"] || 0}
                  onChange={(e) =>
                    handleTargetChange("income", parseFloat(e.target.value))
                  }
                />
              </td>
              <td>
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "EGP",
                }).format(totalReceivedAmount)}
              </td>
              <td>
                {targetValues["income"] > 0
                  ? (
                      (totalReceivedAmount / targetValues["income"]) *
                      100
                    ).toFixed(2) + "%"
                  : "N/A"}
              </td>
              <td>
                <Form.Control
                  type="number"
                  value={targetValues["expenses"] || 0}
                  onChange={(e) =>
                    handleTargetChange("expenses", parseFloat(e.target.value))
                  }
                />
              </td>
              <td>
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "EGP",
                }).format(totalExpensedAmount)}
              </td>

              <td>
                {targetValues["expenses"] > 0
                  ? (
                      (totalExpensedAmount / targetValues["expenses"]) *
                      100
                    ).toFixed(2) + "%"
                  : "N/A"}
              </td>

              <td>
                <Form.Control
                  type="number"
                  value={targetValues["refund"] || 0}
                  onChange={(e) =>
                    handleTargetChange("refund", parseFloat(e.target.value))
                  }
                />
              </td>
              <td>
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "EGP",
                }).format(totalExpensedAmount)}
              </td>
              <td>
                {targetValues["expenses"] > 0
                  ? (
                      (totalExpensedAmount / targetValues["expenses"]) *
                      100
                    ).toFixed(2) + "%"
                  : "N/A"}
              </td>
            </tr>
          </tbody>
        </Table>
      </Card.Body>

      <Card.Header>Revenue Summary</Card.Header>
      <Card.Body>
        <DownloadTableExcel
          filename="Revenue Summary"
          sheet="RevenueSummary"
          currentTableRef={revenueSummary.current}
        >
          <Button variant="outline-primary" className="mb-3">
            <FontAwesomeIcon icon={faFile} className="me-1" />
            Export
          </Button>
        </DownloadTableExcel>

        <Table striped bordered hover ref={revenueSummary}>
          <thead>
            <tr>
              <th>Total Revenue (EGP)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "EGP",
                }).format(totalReceivedAmount - totalExpensedAmount)}
              </td>
            </tr>
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
};

export default TransactionsSummary;
