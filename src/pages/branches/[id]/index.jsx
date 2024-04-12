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

const BranchProfile = () => {
  const router = useRouter();
  const { id } = router.query;
  const [branchData, setBranchData] = useState({});
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [manager, setManager] = useState("");
  const [managers, setManagers] = useState([]);

  const fetchManagers = async () => {
    try {
      const response = await axios.get("/api/employee");
      if (response.status === 200) {
        setManagers(response.data);
      }
    } catch (error) {
      console.error("Error fetching managers:", error);
      toast.error("Failed to fetch managers. Please try again later.", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const handleSave = async () => {
    try {
      const newBranchData = {
        name: name,
        location: location,
        address: address,
        phoneNumber: phoneNumber,
        email: email,
        manager: manager,
      };
      const response = await axios.put(`/api/branch/${id}`, newBranchData);
      if (response.status === 200) {
        toast.success("Branch information updated successfully.", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error("Error updating branch data:", error);
      toast.error(
        "Failed to update branch information. Please try again later.",
        {
          position: "top-right",
          autoClose: 3000,
        }
      );
    }
  };

  const handleDelete = async () => {
    try {
      const response = await axios.delete(`/api/branch/${id}`);
      if (response.status === 204) {
        toast.success("Branch deleted successfully.", {
          position: "top-right",
          autoClose: 3000,
        });
        // Redirect to the branches list page after deletion
        router.push("/branches");
      }
    } catch (error) {
      console.error("Error deleting branch:", error);
      toast.error("Failed to delete branch. Please try again later.", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const fetchBranchData = async () => {
    try {
      const response = await axios.get(`/api/branch/${id}`);

      if (response.status === 200) {
        setBranchData(response.data);
        setName(response.data.name);
        setLocation(response.data.location);
        setAddress(response.data.address);
        setPhoneNumber(response.data.phoneNumber);
        setEmail(response.data.email);
        setManager(response.data.manager?._id);
      }
    } catch (error) {
      console.error("Error fetching branch data:", error);
      toast.error("Failed to fetch branch data. Please try again later.", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchBranchData();
      fetchManagers();
    }
  }, [id]);

  return (
    <AdminLayout>
      <Container className="mt-5">
        <Row>
          <Col>
            {id && Object.keys(branchData).length > 0 && (
              <>
                <h4 className="text-right">{branchData.name}</h4>
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
                  <Form.Group className="my-3" controlId="location">
                    <Form.Label>Location</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter location"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                    />
                  </Form.Group>
                  <Form.Group className="my-3" controlId="address">
                    <Form.Label>Address</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
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
                  <Form.Group className="my-3" controlId="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Enter email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </Form.Group>
                  <Form.Group className="my-3" controlId="manager">
                    <Form.Label>Manager</Form.Label>
                    <Form.Control
                      as="select"
                      value={manager}
                      onChange={(e) => setManager(e.target.value)}
                    >
                      <option value="">Select Manager</option>
                      {managers.map((manager) => (
                        <option key={manager._id} value={manager._id}>
                          {manager.name}
                        </option>
                      ))}
                    </Form.Control>
                  </Form.Group>
                  <div className="mt-3 justify-content-between d-flex">
                    <Button
                      variant="danger"
                      type="button"
                      onClick={handleDelete}
                    >
                      Delete
                    </Button>
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

export default BranchProfile;
