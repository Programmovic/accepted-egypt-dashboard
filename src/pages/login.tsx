import { NextPage } from 'next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-regular-svg-icons';
import { faLock } from '@fortawesome/free-solid-svg-icons';
import {
  Button, Col, Container, Form, InputGroup, Row,
} from 'react-bootstrap';
import { SyntheticEvent, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Cookies from 'js-cookie'; // Import the js-cookie library
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login: NextPage = () => {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const getRedirect = () => {
    return '/';
  };

  const login = async (e: SyntheticEvent) => {
    e.preventDefault();

    if (submitting) {
      return;
    }

    setSubmitting(true);

    try {
      // Send a POST request to the login API with username and password
      const res = await axios.post('api/user/login', { username, password });

      if (res.status === 200) {
        // Successfully logged in, set the token as a cookie
        Cookies.set('client_token', res.data.token, { expires: 1 }); // Set the token as a cookie that expires in 1 day

        // Redirect to the homepage
        router.push(getRedirect());

        // Show a success message using react-toastify
        toast.success('Login successful!', {
          position: 'top-right',
        });
      } else {
        // Handle authentication error, e.g., show a message to the user
        toast.error('Authentication error. Please check your username and password.', {
          position: 'top-right',
        });
      }
    } catch (error) {
      // Handle other errors, e.g., network error
      toast.error('An error occurred. Please try again later.', {
        position: 'top-right',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center dark-bg-transparent">
      <ToastContainer position="top-right" autoClose={3000} />
      <Container>
        <Row className="justify-content-center align-items-center px-3">
          <Col lg={5}>
            <Row>
              <Col md={12} className="bg-white border p-5">
                <div className="text-center">
                  <h1>Login</h1>
                  <p className="text-black-50">Sign In to your account</p>

                  <form onSubmit={login}>
                    <InputGroup className="mb-3">
                      <InputGroup.Text>
                        <FontAwesomeIcon icon={faUser} fixedWidth />
                      </InputGroup.Text>
                      <Form.Control
                        name="username"
                        required
                        disabled={submitting}
                        placeholder="Username"
                        aria-label="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                      />
                    </InputGroup>

                    <InputGroup className="mb-3">
                      <InputGroup.Text>
                        <FontAwesomeIcon icon={faLock} fixedWidth />
                      </InputGroup.Text>
                      <Form.Control
                        type="password"
                        name="password"
                        required
                        disabled={submitting}
                        placeholder="Password"
                        aria-label="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </InputGroup>

                    <Row>
                      <Col xs={12}>
                        <Button className="px-4" variant="primary" type="submit" disabled={submitting}>
                          Login
                        </Button>
                      </Col>
                      <Col xs={12} className="text-center">
                        <Button className="px-0" variant="link" type="submit">
                          Forgot password?
                        </Button>
                      </Col>
                    </Row>
                  </form>
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Login;
