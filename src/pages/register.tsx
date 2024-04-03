import { NextPage } from 'next';
import { faUser } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock } from '@fortawesome/free-solid-svg-icons';
import {
  Button, Card, Col, Container, Form, InputGroup, Row,
} from 'react-bootstrap';
import { useRouter } from 'next/router';
import { SyntheticEvent, useState } from 'react';
import axios from 'axios';
import Link from 'next/link'; // Import Link from Next.js

const Register: NextPage = () => {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    password_repeat: '',
    dateOfJoin: new Date().toISOString(), // Set the default dateOfJoin here
  });

  const [passwordError, setPasswordError] = useState('');
  const [registrationError, setRegistrationError] = useState('');

  const handleChange = (e: SyntheticEvent) => {
    const target = e.target as HTMLInputElement;
    setFormData({
      ...formData,
      [target.name]: target.value,
    });

    // Reset error messages when the user makes changes to the form
    setPasswordError('');
    setRegistrationError('');
  };

  const register = async (e: SyntheticEvent) => {
    e.preventDefault();

    if (submitting) {
      return;
    }

    // Check if passwords match before submitting
    if (formData.password !== formData.password_repeat) {
      setPasswordError("Passwords don't match");
      return;
    }

    setSubmitting(true);

    try {
      const res = await axios.post('/api/user', formData);

      if (res.status === 201) {
        router.push('/login');
      } else {
        // Handle registration error received from the server
        setRegistrationError(res.data.error || 'Registration failed');
      }
    } catch (error) {
      // Handle other errors, e.g., network error
      setRegistrationError('An error occurred while registering');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="registration-page min-vh-100 d-flex flex-row align-items-center dark-bg-transparent">
      <Container>
        <Row className="justify-content-center">
          <Col md={6}>
            <Card className="mb-4 rounded-0">
              <Card.Body className="p-4">
                <h1>Register</h1>
                <p className="text-black-50">Create your account</p>

                <form onSubmit={register}>
                  <InputGroup className="mb-3">
                    <InputGroup.Text><FontAwesomeIcon icon={faUser} fixedWidth /></InputGroup.Text>
                    <Form.Control
                      name="username"
                      required
                      value={formData.username}
                      onChange={handleChange}
                      disabled={submitting}
                      placeholder="Username"
                      aria-label="Username"
                    />
                  </InputGroup>

                  <InputGroup className="mb-3">
                    <InputGroup.Text><FontAwesomeIcon icon={faLock} fixedWidth /></InputGroup.Text>
                    <Form.Control
                      type="password"
                      name="password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      disabled={submitting}
                      placeholder="Password"
                      aria-label="Password"
                    />
                  </InputGroup>

                  <InputGroup className="mb-3">
                    <InputGroup.Text><FontAwesomeIcon icon={faLock} fixedWidth /></InputGroup.Text>
                    <Form.Control
                      type="password"
                      name="password_repeat"
                      required
                      value={formData.password_repeat}
                      onChange={handleChange}
                      disabled={submitting}
                      placeholder="Repeat password"
                      aria-label="Repeat password"
                    />
                  </InputGroup>

                  {passwordError && (
                    <div className="text-danger mb-3">{passwordError}</div>
                  )}

                  {registrationError && (
                    <div className="text-danger mb-3">{registrationError}</div>
                  )}

                  <Button type="submit" className="d-block w-100" disabled={submitting} variant="success">
                    Create Account
                  </Button>
                </form>
                
                <p className="mt-3 text-center">
                  Already have an account?{' '}
                  <Link href="/login">
                    <span style={{ cursor: 'pointer', color: 'blue', textDecoration: 'none', fontWeight: "bold" }}>Login</span>
                  </Link>
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Register;
