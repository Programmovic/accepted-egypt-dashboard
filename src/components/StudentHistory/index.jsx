
import React, { useState, useEffect } from 'react';
import { Table, Alert, Card } from 'react-bootstrap';
import axios from 'axios';


const StudentHistoryDisplay = ({ id }) => {
  const [studentHistory, setStudentHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch student history from the server
    const fetchStudentHistory = async () => {
      try {
        const response = await axios.get(`/api/student/${id}/history`);
        console.log("adam", response);
        setStudentHistory(response.data);
      } catch (err) {
        console.error('Error fetching student history:', err);
        setError('Failed to load student history. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    id && fetchStudentHistory();
  }, [id]);



  return (
    <Card className="my-3 px-4 pt-3 pb-1" style={{ backgroundColor: 'rgb(245, 245, 245)', borderRadius: '3px' }}>
      <Card.Body>
        <Card.Title>Student History</Card.Title>
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Date</th>
              <th>Action</th>
              <th>Changed By</th>
              <th>Changes</th>
            </tr>
          </thead>
          <tbody>
            {studentHistory?.history?.map((history, index) => (
              <tr key={index}>
                <td>{new Date(history.changeDate).toLocaleDateString()}</td>
                <td>{history.action}</td>
                <td>{history.changedBy ? history.changedBy.name : 'Unknown'}</td>
                <td>
                  {Object.entries(history.changes).map(([key, change], changeIndex) => (
                    <div key={changeIndex}>
                      <strong>{key}:</strong> {change.oldValue} &rarr; {change.newValue}
                    </div>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
};

export default StudentHistoryDisplay;
