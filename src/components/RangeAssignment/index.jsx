import React, { useState } from 'react';
import { Form, Button, Alert, Row, Col } from 'react-bootstrap';

const RangeAssignment = ({ handleRangeAssign, salesMembers }) => {
  const [rangeStart, setRangeStart] = useState('');
  const [rangeEnd, setRangeEnd] = useState('');
  const [selectedSalesMember, setSelectedSalesMember] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();

    // Reset error
    setError('');

    // Validate range
    if (parseFloat(rangeStart) >= parseFloat(rangeEnd)) {
      setError('Range start must be less than range end.');
      return;
    }

    if (selectedSalesMember) {
      handleRangeAssign(rangeStart, rangeEnd, selectedSalesMember);
    } else {
      setError('Please select a sales member');
    }
  };

  return (
    <>
      <Form onSubmit={handleSubmit} className="my-3 px-4 pt-3 pb-1" style={{ backgroundColor: "rgb(245, 245, 245)", borderRadius: "8px" }}>
        <Row className="mb-3">
          <Col>
            <Form.Group controlId="rangeStart">
              <Form.Label>Range Start</Form.Label>
              <Form.Control
                type="number"
                value={rangeStart}
                onChange={(e) => setRangeStart(e.target.value)}
                isInvalid={!!error && !rangeStart}
              />
              <Form.Control.Feedback type="invalid">
                {error && !rangeStart ? error : ''}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="rangeEnd">
              <Form.Label>Range End</Form.Label>
              <Form.Control
                type="number"
                value={rangeEnd}
                onChange={(e) => setRangeEnd(e.target.value)}
                isInvalid={!!error && !rangeEnd}
              />
              <Form.Control.Feedback type="invalid">
                {error && !rangeEnd ? error : ''}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="selectSalesMember">
              <Form.Label>Select Sales Member</Form.Label>
              <Form.Control
                as="select"
                value={selectedSalesMember}
                onChange={(e) => setSelectedSalesMember(e.target.value)}
                isInvalid={!!error && !selectedSalesMember}
              >
                <option value="">Select</option>
                {salesMembers.map((member) => (
                  <option key={member._id} value={member.name}>
                    {member.name}
                  </option>
                ))}
              </Form.Control>
              <Form.Control.Feedback type="invalid">
                {error && !selectedSalesMember ? error : ''}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col className="d-flex align-items-end">
            <Button variant="dark" type="submit" className="w-100">
              Assign Leads
            </Button>
          </Col>
        </Row>
      </Form>
      {error && <Alert variant="danger">{error}</Alert>}
    </>
  );
};

export default RangeAssignment;
