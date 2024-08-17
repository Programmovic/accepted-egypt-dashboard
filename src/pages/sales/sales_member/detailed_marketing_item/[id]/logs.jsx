import React, { useEffect, useState } from 'react';
import { AdminLayout } from '@layout';
import axios from 'axios';
import { Table, Card, Spinner, Badge } from 'react-bootstrap';
import { useRouter } from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-regular-svg-icons';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'; // Arrow icon

// Helper function to convert camel case to regular words
const camelCaseToWords = (str) => {
  return str
    .replace(/([a-z])([A-Z])/g, '$1 $2')  // Insert space between camel case words
    .replace(/^./, (match) => match.toUpperCase());  // Capitalize the first letter
};

const MarketingDataLogs = () => {
  const router = useRouter();
  const { id } = router.query;
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchLogs();
    }
  }, [id]);

  const fetchLogs = async () => {
    try {
      const response = await axios.get(`/api/marketing/history?marketingDataId=${id}`);
      console.log(response.data)
      setLogs(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching marketing data logs:', error);
      setLoading(false);
    }
  };

  const getDifferences = (oldData, newData) => {
    const differences = [];
    const allKeys = new Set([...Object.keys(oldData), ...Object.keys(newData)]);

    // Filter out timestamps or any unwanted fields
    const excludedFields = ['timestamp', 'createdAt', 'updatedAt']; // Add more fields as needed

    allKeys.forEach((key) => {
      if (!excludedFields.includes(key) && oldData[key] !== newData[key]) {
        differences.push({
          key: camelCaseToWords(key), // Convert key to regular words
          oldValue: oldData[key],
          newValue: newData[key],
        });
      }
    });

    return differences;
  };

  return (
    <AdminLayout>
      <Card>
        <Card.Header as="h5">Marketing Data Change Logs</Card.Header>
        <Card.Body>
          {loading ? (
            <div className="text-center">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
              <p>Loading...</p>
            </div>
          ) : logs.length === 0 ? (
            <p>No logs available.</p>
          ) : (
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Field</th>
                  <th>Differences</th>
                  <th>Edited By</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log, index) => {
                  const differences = getDifferences(log.oldData, log.newData);

                  return (
                    <tr key={index}>
                      <td>{new Date(log.editedAt).toLocaleString()}</td>
                      <td>{log.field || 'N/A'}</td>
                      <td>
                        {differences.length > 0 ? (
                          <ul className="list-unstyled">
                            {differences.map(({ key, oldValue, newValue }) => (
                              <li key={key} className="mb-2">
                                <div className="d-flex align-items-center">
                                  <FontAwesomeIcon icon={faEdit} className="me-2" color="blue" />
                                  <strong>{key}:</strong>
                                </div>
                                <div className="bg-light p-2 py-4 rounded border d-flex align-items-center justify-content-around">
                            <div>
                              <Badge bg="danger">Old Value</Badge>
                              <p className="mb-0 text-danger">{JSON.stringify(differences[0].oldValue)}</p>
                            </div>
                            <FontAwesomeIcon icon={faArrowRight} className="mx-3" color="gray" />
                            <div>
                              <Badge bg="success">New Value</Badge>
                              <p className="mb-0 text-success">{JSON.stringify(differences[0].newValue)}</p>
                            </div>
                          </div>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p>No differences found</p>
                        )}
                      </td>
                      <td>{log.editedBy?.username || 'N/A'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>
    </AdminLayout>
  );
};

export default MarketingDataLogs;
