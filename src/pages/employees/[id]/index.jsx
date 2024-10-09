import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  Table,
  Form,
  Modal,
  Button,
  Container,
  Col,
  Row,
} from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AdminLayout } from "@layout";
import { useRouter } from "next/router";
import { generateToken } from "../../../lib/generateToken"
import useAuth from "../../../hooks/useAuth";
import Cookies from 'js-cookie'; // Make sure to import Cookies if you're using it

const EmployeeProfile = () => {
  const router = useRouter();
  const token = useAuth();
  const { id } = router.query;
  const [employeeData, setEmployeeData] = useState({});
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [department, setDepartment] = useState("");
  const [position, setPosition] = useState("");
  const [salary, setSalary] = useState("");
  const [departments, setDepartments] = useState([]);
  const [positions, setPositions] = useState([]);

  // For admin account
  const [adminExists, setAdminExists] = useState({});
  const [adminUsername, setAdminUsername] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [adminId, setAdminId] = useState("");
  const [usernameSuggestions, setUsernameSuggestions] = useState([]);

  // Fetch departments
  const fetchDepartments = async () => {
    try {
      const response = await axios.get("/api/department");
      if (response.status === 200) {
        setDepartments(response.data);
      }
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  // Fetch positions
  const fetchPositions = async () => {
    try {
      const response = await axios.get("/api/position");
      if (response.status === 200) {
        setPositions(response.data);
      }
    } catch (error) {
      console.error("Error fetching positions:", error);
    }
  };

  // Save employee details
  const handleSave = async () => {
    try {
      const newEmployeeData = {
        name,
        email,
        phoneNumber,
        department,
        position,
        salary,
      };
      const response = await axios.put(`/api/employee/${id}`, newEmployeeData);
      if (response.status === 200) {
        toast.success("Employee information updated successfully.", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error("Error updating employee data:", error);
      toast.error(
        "Failed to update employee information. Please try again later.",
        {
          position: "top-right",
          autoClose: 3000,
        }
      );
    }
  };

  // Fetch employee data
  const fetchEmployeeData = async () => {
    try {
      const response = await axios.get(`/api/employee/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Adjust according to your API's authentication scheme
        },
      });
      if (response.status === 200) {
        setEmployeeData(response.data);
        setName(response.data.name);
        setEmail(response.data.email);
        setPhoneNumber(response.data.phoneNumber);
        setDepartment(response.data.department);
        setPosition(response.data.position);
        setSalary(response.data.salary);

        // Check if admin exists
        if (response.data.admin) {
          setAdminExists(response.data.admin);
          setAdminUsername(response.data.admin.username); // Assuming admin data includes username
          setAdminId(response.data.admin._id); // Assuming the admin has an ID
        } else {
          generateAdminUsernames(response.data.name, response.data.email);
        }
      }
    } catch (error) {
      console.error("Error fetching employee data:", error);
      toast.error("Failed to fetch employee data. Please try again later.", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const createAdmin = async () => {
    console.log('Creating')
    try {
      // Generate a unique token for password setup
      const token = generateToken(); // You can use a function to generate a unique token
      console.log(token);
      const expirationTime = new Date(Date.now() + 3600000); // Token expires in 1 hour

      const newAdminData = {
        username: adminUsername,
        password: null,
        employee: id, // Associate with the employee
        token, // Save the token
        tokenExpiration: expirationTime, // Save the expiration time
      };

      const response = await axios.post(`/api/user`, newAdminData);
      console.log(response)
      if (response.status === 201) {
        // Create the password setup link
        const setupLink = `${window.location.origin}/set-password?token=${token}`;

        // Send the link to the employee (manual process)
        console.log(`Send this link to the employee: ${setupLink}`);

        // setAdminExists(true);
        // setAdminId(response.data.admin._id); // Update with newly created admin ID
        toast.success("Admin account created successfully. Share the link for password setup.", {
          position: "top-right",
          autoClose: 3000,
        });
        fetchEmployeeData()
      }
    } catch (error) {
      console.error("Error creating admin:", error);
      toast.error("Failed to create admin account. Please try again later.", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };
  // Generate new token
  const regenerateToken = async () => {
    console.log('Regenerating token');
    try {
      const token = generateToken();
      const expirationTime = new Date(Date.now() + 3600000); // Token expires in 1 hour

      const response = await axios.put(`/api/user?id=${adminId}`, {
        token,
        tokenExpiration: expirationTime,
      });

      if (response.status === 200) {
        const setupLink = `${window.location.origin}/set-password?token=${token}`;
        console.log(`Send this link to the employee: ${setupLink}`);
        toast.success("New token generated successfully. Share the link for password setup.", {
          position: "top-right",
          autoClose: 3000,
        });
        setAdminExists(response.data);
      }
    } catch (error) {
      console.error("Error regenerating token:", error);
      toast.error("Failed to regenerate token. Please try again later.", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  useEffect(() => {
    if (id) {
      fetchEmployeeData();
      fetchDepartments();
      fetchPositions();
    }
  }, [id]);

  // Navigate to the admin page
  const handleGoToAdminPage = () => {
    router.push(`/admin/${adminId}`);
  };

  // Generate multiple admin usernames
  const generateAdminUsernames = (employeeName, employeeEmail) => {
    const nameParts = employeeName ? employeeName.split(" ") : ["user"];
    const emailPrefix = employeeEmail ? employeeEmail.split("@")[0] : "user";

    const suggestions = [
      `${nameParts[0].toLowerCase()}_${emailPrefix}`,
      `${nameParts[0].toLowerCase()}${emailPrefix}`,
      `${emailPrefix}.${nameParts[0].toLowerCase()}`,
      `${nameParts[0].toLowerCase()}_${nameParts[1]?.toLowerCase() || "user"}`,
      `${nameParts[0].toLowerCase()}_${nameParts[0].length}${emailPrefix}`,
    ];

    setUsernameSuggestions(suggestions);
    setAdminUsername(suggestions[0]); // Set the first suggestion as default
  };
  // Function to log in directly as the admin
  const handleLoginAsAdmin = async () => {
    console.log(token)
    try {
      const response = await axios.post("/api/user/login/super_admin", 
        {
          username: adminUsername.trim(), // Data to be sent in the request body
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Place headers in the second argument
          },
        }
      );
      

      if (response.status === 200) {
        // Store token and redirect to the admin dashboard
        const { token } = response.data;

        Cookies.set("client_token", token, { expires: 1 });
        toast.success(`Logged in as ${adminUsername} successfully.`, {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error("Error logging in as admin:", error);
      toast.error("Failed to log in as admin. Please try again later.", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };
  return (
    <AdminLayout>
      <Container className="mt-5">
        <Row>
          <Col>
            {id && Object.keys(employeeData).length > 0 && (
              <>
                <h4 className="text-right">{employeeData.name}</h4>
                <Form>
                  {/* Employee form fields */}
                  <Form.Group className="my-3" controlId="name">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </Form.Group>
                  <Form.Group className="my-3" controlId="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Enter email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </Form.Group>
                  <Form.Group className="my-3" controlId="phoneNumber">
                    <Form.Label>Phone Number</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter phone number"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                  </Form.Group>

                  {/* Department Select */}
                  <Form.Group className="my-3" controlId="department">
                    <Form.Label>Department</Form.Label>
                    <Form.Control
                      as="select"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                    >
                      <option value="">Select a Department</option>
                      {departments.map((dept) => (
                        <option key={dept.id} value={dept._id}>
                          {dept.name}
                        </option>
                      ))}
                    </Form.Control>
                  </Form.Group>

                  {/* Position Select */}
                  <Form.Group className="my-3" controlId="position">
                    <Form.Label>Position</Form.Label>
                    <Form.Control
                      as="select"
                      value={position}
                      onChange={(e) => setPosition(e.target.value)}
                    >
                      <option value="">Select a Position</option>
                      {positions.map((pos) => (
                        <option key={pos.id} value={pos._id}>
                          {pos.name}
                        </option>
                      ))}
                    </Form.Control>
                  </Form.Group>

                  {/* Salary */}
                  <Form.Group className="my-3" controlId="salary">
                    <Form.Label>Salary</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter salary"
                      value={salary}
                      onChange={(e) => setSalary(e.target.value)}
                    />
                  </Form.Group>

                  <div className="mt-3 justify-content-between d-flex">
                    <Button variant="primary" type="button" onClick={handleSave}>
                      Update
                    </Button>
                  </div>

                  {/* Admin Account Section */}
                  <h5 className="mt-4">Admin Account</h5>
                  {Object.keys(adminExists).length > 0 ? (
                    <div className="mt-4">
                      <Table striped bordered hover>
                        <tbody>
                          <tr>
                            <td>Admin Username</td>
                            <td>{adminUsername}</td>
                          </tr>
                          <tr>
                            <td>Admin Role</td>
                            <td>{adminExists.role}</td>
                          </tr>
                          <tr>
                            <td>Admin ID</td>
                            <td>{adminId}</td>
                          </tr>
                          <tr>
                            <td className="d-flex align-items-center h-full">Set Password Link</td>
                            <td>
                              <div className="d-flex align-items-center">
                                <a
                                  href={`${window.location.origin}/set-password?token=${adminExists.token}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="btn btn-link text-primary text-decoration-underline"
                                >
                                  Set Password
                                </a>
                                {new Date() > new Date(adminExists.tokenExpiration) && (
                                  <Button
                                    variant="warning"
                                    onClick={regenerateToken}
                                    className="me-2"
                                  >
                                    Generate New Token
                                  </Button>
                                )}
                                <Button
                                  variant="primary"
                                  type="button"
                                  onClick={() => {
                                    navigator.clipboard.writeText(`${window.location.origin}/set-password?token=${adminExists.token}`)
                                      .then(() => {
                                        toast.success("Link copied to clipboard!", {
                                          position: "top-right",
                                          autoClose: 3000,
                                        });
                                      })
                                      .catch((err) => {
                                        console.error("Failed to copy: ", err);
                                        toast.error("Failed to copy link. Please try again.", {
                                          position: "top-right",
                                          autoClose: 3000,
                                        });
                                      });
                                  }}
                                  className="me-2"
                                >
                                  Copy Link
                                </Button>
                                <Button
                          variant="warning"
                          className="me-2"
                          onClick={handleLoginAsAdmin}
                        >
                          Login as Admin
                        </Button>
                                {new Date() > new Date(adminExists.tokenExpiration) ? (
                                  <span className="text-danger ms-2 fw-bold">The link has expired.</span>
                                ) : (
                                  <span className="me-2 text-muted">
                                    This link will expire on {new Date(adminExists.tokenExpiration).toLocaleString()}.
                                  </span>
                                )}
                              </div>
                            </td>

                          </tr>
                        </tbody>
                      </Table>
                    </div>
                  ) : (
                    <>
                      <Form.Group className="my-3" controlId="adminUsername">
                        <Form.Label>Admin Username</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter admin username"
                          value={adminUsername}
                          onChange={(e) => setAdminUsername(e.target.value)}
                        />
                      </Form.Group>
                      <Form.Label>Suggested Usernames</Form.Label>
                      <ul>
                        {usernameSuggestions.map((username, index) => (
                          <li key={index} onClick={() => setAdminUsername(username)} style={{ cursor: 'pointer' }}>
                            {username}
                          </li>
                        ))}
                      </ul>
                      {/* <Form.Group className="my-3" controlId="adminPassword">
                        <Form.Label>Admin Password</Form.Label>
                        <Form.Control
                          type="password"
                          placeholder="Enter admin password"
                          value={adminPassword}
                          onChange={(e) => setAdminPassword(e.target.value)}
                        />
                      </Form.Group> */}
                      <Button variant="primary" type="button" onClick={createAdmin}>
                        Create Admin Account
                      </Button>
                    </>
                  )}
                </Form>
              </>
            )}
          </Col>
        </Row>
      </Container>
      <ToastContainer />
    </AdminLayout>
  );
};

export default EmployeeProfile;
