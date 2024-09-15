import React, { useState, useEffect } from "react";
import { Button, Modal, Form, Table } from "react-bootstrap";
import axios from "axios";

const EditEventModal = ({ show, onHide, event, onUpdate }) => {
  const [editedEvent, setEditedEvent] = useState(event);
  const [conflictReservations, setConflictReservations] = useState([]);

  useEffect(() => {
    setEditedEvent(event);
  }, [event]);

  useEffect(() => {
    if (show && editedEvent) {
      fetchConflictReservations();
    }
  }, [show, editedEvent]);

  const fetchConflictReservations = async () => {
    if (!editedEvent) return;
    try {
      const { date, startTime, endTime, room } = editedEvent;
      const response = await axios.get(`/api/reservation/conflict_reservations`, {
        params: { date, startTime, endTime, roomId: room._id }
      });
      if (response.status === 200) {
        setConflictReservations(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch conflict reservations:', error);
      setConflictReservations([]);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedEvent(prev => ({ ...prev, [name]: value }));
  };

  return (
    <Modal show={show} onHide={onHide} size="xl">
      <Modal.Header closeButton>
        <Modal.Title>Edit Event</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {editedEvent && (
          <Form>
            <Form.Group className="mb-3" controlId="formDate">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                name="date"
                value={editedEvent.date.split("T")[0]}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formDate">
              <Form.Label>Instructor</Form.Label>
              <Form.Control
                type="text"
                name="instructor"
                value={editedEvent?.batch?.instructor?.name  || editedEvent?.placementTest?.instructor?.name}
                disabled
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formStartTime">
              <Form.Label>Start Time</Form.Label>
              <Form.Control
                type="time"
                name="startTime"
                value={editedEvent.startTime}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formEndTime">
              <Form.Label>End Time</Form.Label>
              <Form.Control
                type="time"
                name="endTime"
                value={editedEvent.endTime}
                onChange={handleInputChange}
              />
            </Form.Group>
            {conflictReservations.length > 0 && (
              <Table striped bordered hover size="sm">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Location</th>
                  <th>Start Time</th>
                  <th>End Time</th>
                </tr>
              </thead>
              <tbody>
                {conflictReservations.map((res, index) => (
                  <tr key={index}>
                    <td>{res.title}</td>
                    <td>{res.room.name}</td>
                    <td>{res.startTime}</td>
                    <td>{res.endTime}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
            )}
          </Form>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Close</Button>
        <Button variant={conflictReservations.length > 0 ? "danger" : "primary"} onClick={() => onUpdate(editedEvent)} disabled={conflictReservations.length > 0}>{conflictReservations.length > 0 ? "Conflict" : "Save Changes"}</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditEventModal;
