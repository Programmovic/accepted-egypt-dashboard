import React, { useState } from "react";
import { Table, Card, Form } from "react-bootstrap";

const TransactionsSummary = ({
  transactions,
  batches,
  levelIncomes,
  statistics,
  expenseOptions,
}) => {
  // Calculate the total amount received from all transactions
  const totalReceivedAmount = transactions.reduce((total, transaction) => {
    if (transaction.type === "Income") {
      return total + transaction.amount;
    }
    return total;
  }, 0);
  const totalExpensedAmount = transactions.reduce((total, transaction) => {
    if (transaction.type === "Expense") {
      return total + transaction.amount;
    }
    return total;
  }, 0);

  const [targetValues, setTargetValues] = useState({});

  // Function to update the target for a specific level
  const handleTargetChange = (levelName, value) => {
    setTargetValues({
      ...targetValues,
      [levelName]: value,
    });
  };
  const [expenseTargetValues, setExpenseTargetValues] = useState({});

  // Function to update the target for a specific expense type
  const handleExpenseTargetChange = (expenseType, value) => {
    setExpenseTargetValues({
      ...expenseTargetValues,
      [expenseType]: value,
    });
  };
  return (
    <Card className="mb-4">
      <Card.Header>Received Amount Summary</Card.Header>
      <Card.Body>
        <Table striped bordered hover>
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
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Item</th>
              <th>Target</th>
              <th>Achieved</th>
              <th>Percentage (%)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>EWFS</td>
              <td>
                <Form.Control
                  type="number"
                  value={targetValues["EWFS"] || 0}
                  onChange={(e) =>
                    handleTargetChange("EWFS", parseFloat(e.target.value))
                  }
                />
              </td>
              <td>
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "EGP",
                }).format(statistics.placementTestAmount)}
              </td>
              <td>
                {!isNaN(targetValues["EWFS"]) && targetValues["EWFS"] > 0
                  ? (
                      (statistics.placementTestAmount / targetValues["EWFS"]) *
                      100
                    ).toFixed(2) + "%"
                  : "N/A"}
              </td>
            </tr>
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
                  %
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card.Body>
      <Card.Header>Expensed Amount Summary</Card.Header>
      <Card.Body>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Total Amount Expensed (EGP)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "EGP",
                }).format(totalExpensedAmount)}
              </td>
            </tr>
          </tbody>
        </Table>
        <Table striped bordered hover>
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
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Income Target</th>
              <th>Income achieved</th>
              <th>%</th>
              <th>Expenses Target</th>
              <th>Expenses achieved</th>
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
    </Card>
  );
};

export default TransactionsSummary;
