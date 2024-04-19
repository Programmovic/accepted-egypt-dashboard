import React, { useState } from "react";
import { Table, Modal, Button, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";
import { Dropdown } from "react-bootstrap";

export default function UserList(props) {
  const { users, onUpdate, onDelete } = props;
  const [showModal, setShowModal] = useState(false);
  const [userData, setUserData] = useState(null);

  const formatDateTime = (dateTimeString) => {
    const options = { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" };
    return new Date(dateTimeString).toLocaleString(undefined, options);
  };

  const handleEdit = (user) => {
    setUserData(user);
    setShowModal(true);
  };

  const handleDeleteClick = (userId) => {
    onDelete(userId);
  };

  const handleUpdate = () => {
    // Call the onUpdate function passed from the parent component
    onUpdate(userData._id, userData);
    setShowModal(false);
  };

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  return (
    <>
      <Table responsive bordered hover>
        <thead className="bg-light">
          <tr>
            <th>#</th>
            <th>Username</th>
            <th className="text-center">Role</th>
            <th className="text-center">Date of Join</th>
            <th aria-label="Action">Action</th>
          </tr>
        </thead>
        <tbody>
          {users?.map((user, index) => (
            <tr key={user._id}>
              <td>{index + 1}</td>
              <td>{user.username}</td>
              <td className="text-center">{user.role}</td>
              <td className="text-center">{formatDateTime(user.dateOfJoin)}</td>
              <td>
                <Dropdown align="center">
                  <Dropdown.Toggle
                    as="button"
                    bsPrefix="btn"
                    className="btn-link rounded-0 text-black-50 shadow-none p-0"
                    id={`action-${user._id}`}
                  >
                    <FontAwesomeIcon fixedWidth icon={faEllipsisVertical} />
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    <Dropdown.Item onClick={() => handleEdit(user)}>Edit</Dropdown.Item>
                    <Dropdown.Item
                      className="text-danger"
                      onClick={() => handleDeleteClick(user._id)}
                    >
                      Delete
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="formBasicUsername">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                name="username"
                value={userData?.username}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicRole">
              <Form.Label>Role</Form.Label>
              <Form.Control
                type="text"
                name="role"
                value={userData?.role}
                onChange={handleChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleUpdate}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
