import { useState, useEffect, useRef } from "react";
import { Card, Form, Button, Row, Col, Overlay, Popover } from "react-bootstrap";
import axios from "axios";
import { AdminLayout } from "@layout";
import { UserList } from "@components/Users";
import { ClassCard } from "@components/Classes";
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import TextField from '@mui/material/TextField';

const Users = () => {
  const [userResource, setUserResource] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterApplied, setFilterApplied] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const filterRef = useRef(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get("/api/user");
        if (response.status === 200) {
          setUserResource(response.data);
          setFilteredData(response.data);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError("Failed to fetch user data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleFilter = () => {
    if (searchTerm) {
      const filteredUsers = userResource.filter((item) =>
        item.username.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredData(filteredUsers);
    }
    if (startDate && endDate) {
      const filteredUsers = userResource.filter((user) => {
        const userDate = new Date(user.dateOfJoin);
        return userDate >= new Date(startDate) && userDate <= new Date(endDate);
      });
      setFilteredData(filteredUsers);
    } else if (startDate) {
      const filteredUsers = userResource.filter((user) => {
        const userDate = new Date(user.dateOfJoin);
        return userDate >= new Date(startDate);
      });
      setFilteredData(filteredUsers);
    } else {
      setFilteredData(userResource);
    }
    setFilteredData(filteredUsers);
    setFilterApplied(true);
  };

  const handleDelete = async (id) => {
    // Ask for confirmation before deleting
    const confirmDelete = window.confirm("Are you sure you want to delete this user?");

    if (confirmDelete) {
      try {
        await axios.delete(`/api/user/specific_user/${id}`);
        const updatedUsers = userResource.filter((user) => user._id !== id);
        setUserResource(updatedUsers);
        setFilteredData(updatedUsers);
      } catch (error) {
        console.error("Error deleting user:", error);
        setError("Failed to delete user. Please try again later.");
      }
    }
  };

  const handleUpdate = async (id, newData) => {
    try {
      await axios.put(`/api/user?id=${id}`, newData);
      const updatedUsers = userResource.map((user) => {
        if (user._id === id) {
          return { ...user, ...newData };
        }
        return user;
      });
      setUserResource(updatedUsers);
      setFilteredData(updatedUsers);
    } catch (error) {
      console.error("Error updating user:", error);
      setError("Failed to update user. Please try again later.");
    }
  };
  const clearFilters = () => {
    setStartDate("")
    setEndDate("")
    setFilteredData(userResource);
    setFilterApplied(false);
  };
  return (
    <AdminLayout>
      <div className="row">
        <ClassCard data={filteredData.length} title={"Admins"} enableOptions={false} />
      </div>
      <div className="d-flex justify-content-between mb-3" style={{ backgroundColor: '#f5f5f5', padding: '10px', borderRadius: '8px' }}>

        <TextField
          id="outlined-basic"
          label="Search"
          variant="outlined"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          fullWidth // Adjust based on your layout needs

        />
        <Button
          variant={filterApplied ? "warning" : "primary"}
          onClick={() => setShowFilter(!showFilter)}
          ref={filterRef}
          className="ms-2 "
        >
          <FilterAltIcon style={{ color: filterApplied ? 'yellow' : 'white' }} />
        </Button>

        <Overlay
          show={showFilter}
          target={filterRef.current}
          placement="bottom"
          className="popover-arrow"
        >
          <Popover id="popover-contained" style={{ maxHeight: '400px', overflowY: "auto", minWidth: '800px' }}>
            <Popover.Header as="h3">Customize Filters</Popover.Header>
            <Popover.Body>
              <Form>
                <Row>
                  <Col xs={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Start Date</Form.Label>
                      <Form.Control
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                  <Col xs={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>End Date</Form.Label>
                      <Form.Control
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col xs={12} className="d-flex justify-content-between">
                    <Button variant="secondary" onClick={clearFilters}>
                      Clear Filters
                    </Button>
                    <Button
                      variant="primary"
                      onClick={() => {
                        handleFilter();
                        setShowFilter(false);
                      }}
                    >
                      Apply Filters
                    </Button>
                  </Col>
                </Row>
              </Form>
            </Popover.Body>
          </Popover>
        </Overlay>

      </div>
      <Card>
        <Card.Header>Users</Card.Header>
        <Card.Body>
          <Form className="mb-3">
            <Row>
              <Col xs={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Start Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col xs={6}>
                <Form.Group className="mb-3">
                  <Form.Label>End Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Button variant="primary" onClick={handleFilter}>
              Filter
            </Button>
          </Form>
          {loading ? (
            <p>Loading users data...</p>
          ) : error ? (
            <p>{error}</p>
          ) : (
            <UserList
              users={filteredData}
              onDelete={handleDelete}
              onUpdate={handleUpdate}
            />
          )}
        </Card.Body>
      </Card>
    </AdminLayout>
  );
};

export default Users;
