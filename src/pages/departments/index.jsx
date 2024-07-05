import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Table, Form, Button, Modal } from 'react-bootstrap';
import { AdminLayout } from '@layout';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentDepartment, setCurrentDepartment] = useState({ id: null, name: '' });

  const fetchDepartments = async () => {
    try {
      const response = await axios.get('/api/department');
      if (response.status === 200) {
        setDepartments(response.data);
      }
    } catch (error) {
      console.error('Error fetching departments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    const method = isEdit ? 'put' : 'post';
    const url = isEdit ? `/api/department?id=${currentDepartment._id}` : '/api/department';
    
    try {
      const response = await axios[method](url, { name: currentDepartment.name });
      if (response.status === 201 || response.status === 200) {
        toast.success(`Department ${isEdit ? 'updated' : 'added'} successfully!`);
        fetchDepartments();
        setShowModal(false);
        setCurrentDepartment({ id: null, name: '' });
      }
    } catch (error) {
      toast.error(`Failed to ${isEdit ? 'update' : 'add'} the department. Please try again.`);
      console.error('Error saving department:', error);
    }
  };

  const handleDelete = async (id) => {
    const userConfirmed = window.confirm('Are you sure you want to delete this department?');
    
    if (userConfirmed) {
      try {
        const response = await axios.delete(`/api/department?id=${id}`);
        if (response.status === 200) {
          toast.success('Department deleted successfully!');
          fetchDepartments();
        }
      } catch (error) {
        toast.error('Failed to delete the department. Please try again.');
        console.error('Error deleting department:', error);
      }
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  return (
    <AdminLayout>
      <Card>
        <Card.Header>Departments</Card.Header>
        <Card.Body>
          <Button variant="success" onClick={() => { setShowModal(true); setIsEdit(false); }}>
            Add Department
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
              {departments.map((department, index) => (
                <tr key={department._id}>
                  <td>{index + 1}</td>
                  <td>{department.name}</td>
                  <td>
                    <Button variant="primary" onClick={() => { setShowModal(true); setIsEdit(true); setCurrentDepartment(department); }}>
                      Edit
                    </Button>
                    <Button variant="danger" onClick={() => handleDelete(department._id)} className="ms-2">
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
          <Modal.Title>{isEdit ? 'Edit' : 'Add'} Department</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={currentDepartment.name}
                onChange={(e) => setCurrentDepartment({ ...currentDepartment, name: e.target.value })}
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

export default Departments;
