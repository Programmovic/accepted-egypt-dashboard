import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Card } from "react-bootstrap";

const PlacementTestsSummary = ({ filterdPlacementTests, levels }) => {
  const totalStudentsCount = filterdPlacementTests.length;

  // Calculate the total payment
  const totalPayment = filterdPlacementTests.reduce((total, test) => {
    // Ensure that the "cost" property is a number
    const cost = isNaN(parseFloat(test.cost)) ? 0 : parseFloat(test.cost);
    return total + cost;
  }, 0);

  // Calculate the number of students in each level
  const levelCounts = filterdPlacementTests.reduce((levelCounts, test) => {
    const assignedLevel = test.assignedLevel;
    if (assignedLevel in levelCounts) {
      levelCounts[assignedLevel]++;
    } else {
      levelCounts[assignedLevel] = 1;
    }
    return levelCounts;
  }, {});

  // Calculate the amount received for each level
  const amountReceivedByLevel = {};
  for (const level in levelCounts) {
    const studentsInLevel = levelCounts[level];
    // Calculate the amount received for this level
    const levelAmount = filterdPlacementTests.reduce((total, test) => {
      if (test.assignedLevel === level) {
        const cost = isNaN(parseFloat(test.cost)) ? 0 : parseFloat(test.cost);
        return total + cost;
      }
      return total;
    }, 0);
    amountReceivedByLevel[level] = levelAmount.toFixed(2);
  }

  // Calculate the percentage of each level's amount
  const levelPercentages = {};
  for (const level in amountReceivedByLevel) {
    const levelAmount = parseFloat(amountReceivedByLevel[level]);
    levelPercentages[level] = ((levelAmount / totalPayment) * 100).toFixed(2);
  }

  return (
    <Card className="mb-4">
      <Card.Header>Placement Tests Summary</Card.Header>
      <Card.Body>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Total Students</th>
              <th>Total Payment</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{totalStudentsCount}</td>
              <td>{totalPayment.toFixed(2)} EGP</td>
            </tr>
          </tbody>
        </Table>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Level</th>
              <th>Number of Students</th>
              <th>Total Payment (EGP)</th>
              <th>Percentage (%)</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(levelCounts).map((level) => (
              <tr key={level}>
                <td>{level}</td>
                <td>{levelCounts[level]}</td>
                <td>{amountReceivedByLevel[level]} EGP</td>
                <td>{levelPercentages[level]}%</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
};

export default PlacementTestsSummary;
