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
import { useRouter } from "next/router"; // Import useRouter from next/router

const EmployeeProfile = () => {
  const router = useRouter(); // Initialize useRouter
  const { id } = router.query; 
  const [employeeData, setEmployeeData] = useState({});
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [position, setPosition] = useState("");
  const [salary, setSalary] = useState("");

  const handleSave = async () => {
    try {
      const newEmployeeData = {
        name: name,
        email: email,
        phoneNumber: phoneNumber,
        position: position,
        salary: salary,
      };
      const response = await axios.put(
        `/api/employee/${id}`, // Use the extracted id from the router
        newEmployeeData
      );
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

  const fetchEmployeeData = async () => {
    try {
      const response = await axios.get(`/api/employee/${id}`); // Use the extracted id from the router

      if (response.status === 200) {
        setEmployeeData(response.data);
        setName(response.data.name); // Set default values for inputs
        setEmail(response.data.email);
        setPhoneNumber(response.data.phoneNumber);
        setPosition(response.data.position);
        setSalary(response.data.salary);
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

  useEffect(() => {
    if (id) {
      fetchEmployeeData();
    }
  }, [id]);

  // Render the form only when employeeData is available and id is present in the query
  return (
    <AdminLayout>
      <Container className="mt-5">
        <Row>
          <Col>
            {id && Object.keys(employeeData).length > 0 && ( // Check if id and employeeData are available
              <>
                <h4 className="text-right">{employeeData.name}</h4>
                <Form>
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
                  <Form.Group className="my-3" controlId="position">
                    <Form.Label>Position</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter position"
                      value={position}
                      onChange={(e) => setPosition(e.target.value)}
                    />
                  </Form.Group>
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
                    <Button
                      variant="primary"
                      type="button"
                      onClick={handleSave}
                    >
                      Update
                    </Button>
                  </div>
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
