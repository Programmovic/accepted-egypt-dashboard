import React, { useState } from "react";
import { Table, Card, Form } from "react-bootstrap";

const TransactionsSummary = ({
  transactions,
  batches,
  levelIncomes,
  statistics,
}) => {
  // Calculate the total amount received from all transactions
  const totalReceivedAmount = transactions.reduce((total, transaction) => {
    if (transaction.type === "Income") {
      return total + transaction.amount;
    }
    return total;
  }, 0);

  const [target, setTarget] = useState(0); // State for the "Target" input

  // Function to update the target and calculate the percentage
  const handleTargetChange = (e) => {
    const newTarget = parseFloat(e.target.value);
    setTarget(newTarget);
  };

  // Calculate the percentage based on the "Target" and "Achieved" amounts
  const percentage = ((statistics.placementTestAmount / target) * 100).toFixed(
    2
  );

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
              <td>{totalReceivedAmount.toFixed(2)} EGP</td>
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
                  value={target}
                  onChange={handleTargetChange}
                />
              </td>
              <td>{statistics.placementTestAmount}</td>
              <td>
                {!isNaN(target) && target > 0
                  ? ((statistics.placementTestAmount / target) * 100).toFixed(
                      2
                    ) + "%"
                  : "N/A"}
              </td>
            </tr>
            {Object.keys(levelIncomes).map((levelName) => (
              <tr key={levelName}>
                <td>{levelName}</td>
                <td>
                  <Form.Control
                    type="number"
                    value={0} // You should replace 0 with the appropriate value for the target
                    onChange={() => {
                      // Handle target input change for each level if needed
                    }}
                  />
                </td>
                <td>{levelIncomes[levelName]}</td>
                <td>
                  {(
                    (+levelIncomes[levelName] / totalReceivedAmount) *
                    100
                  ).toFixed(2)}
                  %
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        
      </Card.Body>
      <Card.Header>Transactions Summary</Card.Header>
      <Card.Body>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Total Amount Expensed (EGP)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{totalReceivedAmount.toFixed(2)} EGP</td>
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
                  value={target}
                  onChange={handleTargetChange}
                />
              </td>
              <td>{statistics.placementTestAmount}</td>
              <td>
                {!isNaN(target) && target > 0
                  ? ((statistics.placementTestAmount / target) * 100).toFixed(
                      2
                    ) + "%"
                  : "N/A"}
              </td>
            </tr>
            {Object.keys(levelIncomes).map((levelName) => (
              <tr key={levelName}>
                <td>{levelName}</td>
                <td>
                  <Form.Control
                    type="number"
                    value={0} // You should replace 0 with the appropriate value for the target
                    onChange={() => {
                      // Handle target input change for each level if needed
                    }}
                  />
                </td>
                <td>{levelIncomes[levelName]}</td>
                <td>
                  {(
                    (+levelIncomes[levelName] / totalReceivedAmount) *
                    100
                  ).toFixed(2)}
                  %
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        
      </Card.Body>
    </Card>
  );
};

export default TransactionsSummary;
