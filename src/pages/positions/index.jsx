import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Table, Form, Button, Modal } from 'react-bootstrap';
import { AdminLayout } from '@layout';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Positions = () => {
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentPosition, setCurrentPosition] = useState({ id: null, name: '' });

  const fetchPositions = async () => {
    try {
      const response = await axios.get('/api/position');
      if (response.status === 200) {
        setPositions(response.data);
      }
    } catch (error) {
      console.error('Error fetching positions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    const method = isEdit ? 'put' : 'post';
    const url = isEdit ? `/api/position?id=${currentPosition._id}` : '/api/position';
    
    try {
      const response = await axios[method](url, { name: currentPosition.name });
      if (response.status === 201 || response.status === 200) {
        toast.success(`Position ${isEdit ? 'updated' : 'added'} successfully!`);
        fetchPositions();
        setShowModal(false);
        setCurrentPosition({ id: null, name: '' });
      }
    } catch (error) {
      toast.error(`Failed to ${isEdit ? 'update' : 'add'} the position. Please try again.`);
      console.error('Error saving position:', error);
    }
  };

  const handleDelete = async (id) => {
    const userConfirmed = window.confirm('Are you sure you want to delete this position?');
    
    if (userConfirmed) {
      try {
        const response = await axios.delete(`/api/position?id=${id}`);
        if (response.status === 200) {
          toast.success('Position deleted successfully!');
          fetchPositions();
        }
      } catch (error) {
        toast.error('Failed to delete the position. Please try again.');
        console.error('Error deleting position:', error);
      }
    }
  };

  useEffect(() => {
    fetchPositions();
  }, []);

  return (
    <AdminLayout>
      <Card>
        <Card.Header>Positions</Card.Header>
        <Card.Body>
          <Button variant="success" onClick={() => { setShowModal(true); setIsEdit(false); }}>
            Add Position
          </Button>

          <Table striped bordered hover className="mt-3">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {positions.map((position, index) => (
                <tr key={position._id}>
                  <td>{index + 1}</td>
                  <td>{position.name}</td>
                  <td>
                    <Button variant="primary" onClick={() => { setShowModal(true); setIsEdit(true); setCurrentPosition(position); }}>
                      Edit
                    </Button>
                    <Button variant="danger" onClick={() => handleDelete(position._id)} className="ms-2">
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

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{isEdit ? 'Edit' : 'Add'} Position</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={currentPosition.name}
                onChange={(e) => setCurrentPosition({ ...currentPosition, name: e.target.value })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="success" onClick={handleSave}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </AdminLayout>
  );
};

export default Positions;
