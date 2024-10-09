import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Container, Row, Col, Card, Button, Form, Table } from 'react-bootstrap';
import { TextField, CircularProgress } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material'; // Import icons
import Cookies from 'js-cookie'; // Make sure to import Cookies if you're using it

import { useRouter } from "next/router";

const SetPassword = () => {
    const [token, setToken] = useState('');

    const router = useRouter();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [userData, setUserData] = useState(null);
    const [employeeData, setEmployeeData] = useState(null);
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [showPassword, setShowPassword] = useState(false);
    const [criteriaMet, setCriteriaMet] = useState({
        length: false,
        lowercase: false,
        uppercase: false,
        number: false,
        specialChar: false,
    });

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const tokenFromUrl = urlParams.get('token');
        setToken(tokenFromUrl);

        const fetchUserData = async () => {
            try {
                const response = await axios.get(`/api/user/set-password?token=${tokenFromUrl}`);
                setUserData(response.data);
                setEmployeeData(response.data.employee);
            } catch (error) {
                toast.error("Failed to fetch user data. Please try again later.", {
                    position: "top-right",
                    autoClose: 3000,
                });
            }
        };

        if (tokenFromUrl) {
            fetchUserData();
        }
    }, []);

    const checkPasswordStrength = (password) => {
        let strength = 0;
        const criteria = {
            length: password.length >= 8,
            lowercase: /[a-z]/.test(password),
            uppercase: /[A-Z]/.test(password),
            number: /[0-9]/.test(password),
            specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
        };

        setCriteriaMet(criteria);
        strength = Object.values(criteria).filter(Boolean).length;
        setPasswordStrength(strength);
    };

    const generateStrongPassword = () => {
        const length = 12;
        const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
        const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const numberChars = '0123456789';
        const specialChars = '!@#$%^&*(),.?":{}|<>';

        const allChars = lowercaseChars + uppercaseChars + numberChars + specialChars;
        let password = '';

        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * allChars.length);
            password += allChars[randomIndex];
        }

        password = ensurePasswordComplexity(password);

        setPassword(password);
        checkPasswordStrength(password);
        setPasswordStrength(4);
    };

    const ensurePasswordComplexity = (password) => {
        const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
        const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const numberChars = '0123456789';
        const specialChars = '!@#$%^&*(),.?":{}|<>';

        let randomIndex = Math.floor(Math.random() * lowercaseChars.length);
        password += lowercaseChars[randomIndex];
        randomIndex = Math.floor(Math.random() * uppercaseChars.length);
        password += uppercaseChars[randomIndex];
        randomIndex = Math.floor(Math.random() * numberChars.length);
        password += numberChars[randomIndex];
        randomIndex = Math.floor(Math.random() * specialChars.length);
        password += specialChars[randomIndex];

        return password.split('').sort(() => Math.random() - 0.5).join('');
    };

    const handleSubmit = async () => {
        setLoading(true);
        if (password !== confirmPassword) {
            toast.error("Passwords do not match.", {
                position: "top-right",
                autoClose: 3000,
            });
            setLoading(false);
            return;
        }
        try {
            const response = await axios.post(`/api/user/set-password`, { token, password });
            if (response.status === 200) {

                toast.success("Password set successfully!", {
                    position: "top-right",
                    autoClose: 3000,
                });
                await login(userData?.username, password)
            }

        } catch (error) {
            toast.error("Failed to set password. Please check the link or try again.", {
                position: "top-right",
                autoClose: 3000,
            });
        } finally {
            setLoading(false);
        }
    };
    const login = async (username, password) => {
        const res = await axios.post("/api/user/login", {
            username: username.trim(),
            password: password.trim(),
        });

        console.log("Response from API:", res); // Log the entire response

        if (res.status === 200) {
            // Check if the token exists in the response
            if (res.data.token) {
                // Save token in cookies
                Cookies.set("client_token", res.data.token, { expires: 1 });
                console.log("Token saved in cookies:", res.data.token); // Log for debugging

                // Navigate to the previous page
                router.push('/'); // Or specify the target route
                toast.success("Login successful!", { position: "top-right" });
            } else {
                console.error("Token not found in response data.");
                toast.error("Authentication error. Please check your username and password.", {
                    position: "top-right",
                });
            }
        } else {
            console.error("Unexpected response status:", res.status);
            toast.error("Authentication error. Please check your username and password.", {
                position: "top-right",
            });
        }
    };


    return (
        <Container className="mt-5 set-password-container">
            <Row className="justify-content-center">
                {/* Employee Data Card */}
                <Col md={6}>
                    <Card className="shadow-lg border-0 mb-4">
                        <Card.Body>
                            <h4 className="text-center">Employee Data</h4>
                            {employeeData ? (
                                <Table striped bordered hover>
                                    <tbody>
                                        <tr>
                                            <td>ID</td>
                                            <td>{employeeData._id}</td>
                                        </tr>
                                        <tr>
                                            <td>Name</td>
                                            <td>{employeeData.name}</td>
                                        </tr>
                                        <tr>
                                            <td>Email</td>
                                            <td>{employeeData.email}</td>
                                        </tr>
                                        <tr>
                                            <td>Phone Number</td>
                                            <td>{employeeData.phoneNumber}</td>
                                        </tr>
                                        <tr>
                                            <td>Position</td>
                                            <td>{employeeData.position.name}</td>
                                        </tr>
                                        <tr>
                                            <td>Department</td>
                                            <td>{employeeData.department.name}</td>
                                        </tr>
                                        <tr>
                                            <td>Date of Birth</td>
                                            <td>{new Date(employeeData.dateOfBirth).toLocaleDateString()}</td>
                                        </tr>
                                        <tr>
                                            <td>Start Date</td>
                                            <td>{new Date(employeeData.startDate).toLocaleDateString()}</td>
                                        </tr>
                                    </tbody>
                                </Table>
                            ) : (
                                <p className="text-center">No employee data available.</p>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={6}>
                    <Card className="shadow-lg border-0 mb-4">
                        <Card.Body>
                            {userData ? (
                                <>
                                    <h2 className="text-center">Hi, {userData.username}!</h2>
                                    <h6 className="text-center mt-3">Set Your Password</h6>
                                    <Form className='mt-5'>
                                        <Form.Group className="mb-3" controlId="formPassword">
                                            <TextField
                                                fullWidth
                                                label="New Password"
                                                type={showPassword ? 'text' : 'password'}
                                                variant="outlined"
                                                value={password}
                                                onChange={(e) => {
                                                    setPassword(e.target.value);
                                                    checkPasswordStrength(e.target.value);
                                                }}
                                                required
                                                InputProps={{
                                                    endAdornment: (
                                                        <span
                                                            onClick={() => setShowPassword(!showPassword)}
                                                            style={{ cursor: 'pointer' }}
                                                        >
                                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                                        </span>
                                                    ),
                                                }}
                                            />
                                        </Form.Group>
                                        <Form.Group className="mb-3" controlId="formConfirmPassword">
                                            <TextField
                                                fullWidth
                                                label="Confirm Password"
                                                type={showPassword ? 'text' : 'password'}
                                                variant="outlined"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                required
                                                InputProps={{
                                                    endAdornment: (
                                                        <span
                                                            onClick={() => setShowPassword(!showPassword)}
                                                            style={{ cursor: 'pointer' }}
                                                        >
                                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                                        </span>
                                                    ),
                                                }}
                                            />
                                        </Form.Group>

                                        <Button variant="secondary" onClick={generateStrongPassword} className="mt-2">
                                            Suggest Strong Password
                                        </Button>

                                        <div className="password-strength-indicator">
                                            <div className="password-strength-rules">
                                                <p>Password must contain:</p>
                                                <ul>
                                                    <li style={{ color: criteriaMet.length ? 'green' : 'red' }}>
                                                        At least 8 characters
                                                    </li>
                                                    <li style={{ color: criteriaMet.lowercase ? 'green' : 'red' }}>
                                                        At least 1 lowercase letter
                                                    </li>
                                                    <li style={{ color: criteriaMet.uppercase ? 'green' : 'red' }}>
                                                        At least 1 uppercase letter
                                                    </li>
                                                    <li style={{ color: criteriaMet.number ? 'green' : 'red' }}>
                                                        At least 1 number
                                                    </li>
                                                    <li style={{ color: criteriaMet.specialChar ? 'green' : 'red' }}>
                                                        At least 1 special character
                                                    </li>
                                                </ul>
                                            </div>
                                            <div className="strength-bar">
                                                <div className={`strength-level level-${passwordStrength}`}></div>
                                            </div>
                                        </div>

                                        <Button
                                            variant="primary"
                                            onClick={handleSubmit}
                                            disabled={loading}
                                            className="w-100 mt-3"
                                        >
                                            {loading ? (
                                                <>
                                                    <CircularProgress size={24} /> Setting...
                                                </>
                                            ) : (
                                                "Set Password"
                                            )}
                                        </Button>
                                    </Form>
                                </>
                            ) : (
                                <>
                                    <h2 className="text-center">Invalid Link</h2>
                                    <h6 className="text-center mt-3">Please contact the Accepted Egypt administrator for assistance.</h6>
                                </>
                            )}
                        </Card.Body>
                    </Card>
                </Col>


            </Row>
            <ToastContainer />
        </Container>
    );
};

export default SetPassword;
