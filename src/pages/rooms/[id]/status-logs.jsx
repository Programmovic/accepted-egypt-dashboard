import React, { useEffect, useState } from 'react';
import { AdminLayout } from '@layout';
import axios from 'axios';
import { Table, Card } from 'react-bootstrap';
import { useRouter } from 'next/router';

const RoomStatusLogs = () => {
  const router = useRouter();
  const { id } = router.query;
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, [id]);

  const fetchLogs = async () => {
    try {
      const response = await axios.get(`/api/room/${id}/status-logs`);
      console.log(response);
      setLogs(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching status logs:', error);
      setLoading(false);
    }
  };


  return (
    <AdminLayout>
      <Card>
        <Card.Header as="h5">Room Status Change Logs</Card.Header>
        <Card.Body>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Date</th>
                <th>Status Changed To</th>
                <th>Changed By</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log, index) => (
                <tr key={index}>
                  <td>{new Date(log.changedAt).toLocaleString()}</td>
                  <td className='text-capitalize'>{log.status}</td>
                  <td>{log?.changedByAdmin?.username}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </AdminLayout>
  );
};

export default RoomStatusLogs;
