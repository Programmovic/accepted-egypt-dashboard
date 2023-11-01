import React, { useState } from "react";
import { Table, Card } from "react-bootstrap";

const WaitingListSummary = ({ filterdWaitingList, levels, students }) => {
  const totalStudentsCount = filterdWaitingList.length;
  
  // Calculate the number of students with source "EWFS"
  const ewfsStudentsCount = filterdWaitingList.filter(item => item.source === "EWFS").length;

  // Calculate the total students count including students with source "EWFS"
  const totalStudentsIncludingEWFS = totalStudentsCount + ewfsStudentsCount;

  // Calculate the number of students in each level
  const levelCounts = filterdWaitingList.reduce((levelCounts, waitingListItem) => {
    const assignedLevel = waitingListItem.assignedLevel;
    if (assignedLevel in levelCounts) {
      levelCounts[assignedLevel]++;
    } else {
      levelCounts[assignedLevel] = 1;
    }
    return levelCounts;
  }, {});

  // Calculate the percentage of each level
  const levelPercentages = {};
  for (const level in levelCounts) {
    const percentage = ((levelCounts[level] / totalStudentsCount) * 100).toFixed(2);
    levelPercentages[level] = percentage;
  }
  // Calculate the number of students who have converted from EWFS to classes
  const studentsConvertedFromEWFS = students.filter(student => student.batch && student.batch !== "").length;

  // Calculate the number of students still on the waiting list
  const studentsStillOnWaitingList = filterdWaitingList.length;

  // Extract the level names from the objects if necessary
  const levelNames = levels?.map((level) => (typeof level === "object" ? level.name : level));

  return (
    <Card className="mb-4">
      <Card.Header>Waiting List Summary</Card.Header>
      <Card.Body>
      <Table striped bordered hover>
          <thead>
            <tr>
              <th>Total Number of students for EWFS</th>
              <th>Students Converted from EWFS to Classes</th>
              <th>Students still on waiting list</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{ewfsStudentsCount}</td>
              <td>{studentsConvertedFromEWFS}</td>
              <td>{studentsStillOnWaitingList}</td>
            </tr>
          </tbody>
        </Table>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Level</th>
              <th>Number of Students</th>
              <th>Percentage (%)</th>
            </tr>
          </thead>
          <tbody>
            {levelNames.map((level) => (
              <tr key={level}>
                <td>{level}</td>
                <td>{levelCounts[level] || 0}</td>
                <td>{levelPercentages[level] || 0}%</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
};

export default WaitingListSummary;
