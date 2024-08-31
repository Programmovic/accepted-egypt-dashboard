import { Card, Form, Button, Row, Col, Table } from "react-bootstrap";
import { useEffect, useState } from "react";
import { AdminLayout } from "@layout";
import axios from "axios";
import { Modal } from "react-bootstrap";
import Select from "react-select";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const ProspectList = () => {
  const [prospects, setProspects] = useState([]);
  const [salesModerators, setSalesModerators] = useState([]);
  const [salesMembers, setSalesMembers] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterName, setFilterName] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [source, setSource] = useState("");
  const [languageIssues, setLanguageIssues] = useState("");
  const [assignedToModeration, setAssignedToModeration] = useState("");
  const [assignationDate, setAssignationDate] = useState("");
  const [assignedToSales, setAssignedToSales] = useState("");

  const fetchProspects = async () => {
    try {
      const response = await axios.get("/api/prospects");
      if (response.status === 200) {
        const data = response.data;
        setProspects(data);
        setFilteredData(data);
      }
    } catch (error) {
      console.error("Error fetching prospects:", error);
      setError("Failed to fetch prospect data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProspects();
  }, []);

  useEffect(() => {
    handleFilter();
  }, [filterName, filterDate, assignedTo, source, languageIssues, assignedToModeration, assignationDate, assignedToSales, prospects]);

  const handleFilter = () => {
    let filteredProspects = [...prospects];

    if (filterName) {
      filteredProspects = filteredProspects.filter((item) =>
        item.name.toLowerCase().includes(filterName.toLowerCase())
      );
    }

    if (filterDate) {
      filteredProspects = filteredProspects.filter((item) =>
        new Date(item.addedDate).toLocaleDateString() === new Date(filterDate).toLocaleDateString()
      );
    }

    if (assignedTo) {
      filteredProspects = filteredProspects.filter((item) =>
        item.assignedTo.toLowerCase().includes(assignedTo.toLowerCase())
      );
    }

    if (source) {
      filteredProspects = filteredProspects.filter((item) =>
        item.source.toLowerCase().includes(source.toLowerCase())
      );
    }

    if (languageIssues) {
      filteredProspects = filteredProspects.filter((item) =>
        item.languageIssues.toLowerCase().includes(languageIssues.toLowerCase())
      );
    }

    if (assignedToModeration) {
      filteredProspects = filteredProspects.filter((item) =>
        item.assignedToModeration?.toLowerCase().includes(assignedToModeration.toLowerCase())
      );
    }

    if (assignationDate) {
      filteredProspects = filteredProspects.filter((item) =>
        new Date(item.assignationDate).toLocaleDateString() === new Date(assignationDate).toLocaleDateString()
      );
    }

    if (assignedToSales) {
      filteredProspects = filteredProspects.filter((item) =>
        item.assignedToSales?.toLowerCase().includes(assignedToSales.toLowerCase())
      );
    }

    setFilteredData(filteredProspects);
  };

  const clearFilters = () => {
    setFilterName("");
    setFilterDate("");
    setAssignedTo("");
    setSource("");
    setLanguageIssues("");
    setAssignedToModeration("");
    setAssignationDate("");
    setAssignedToSales("");
    setFilteredData(prospects);
  };

  const handleUpdateProspect = async (id, updatedData) => {
    try {
      await axios.put(`/api/prospects/${id}`, updatedData);
      fetchProspects();
      toast.success("Prospect updated successfully!");
    } catch (error) {
      console.error("Error updating prospect:", error.message);
      setError("Failed to update prospect. Please try again.");
      toast.error(error.message);
    }
  };

  return (
    <AdminLayout>
      <ToastContainer />
      <Card>
        <Card.Header className="d-flex align-items-center">
          <div className="w-50">Prospect List</div>
        </Card.Header>
        <Card.Body>
          <Form className="mb-3">
            <Row>
              <Col xs={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Filter by Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={filterName}
                    onChange={(e) => setFilterName(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col xs={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Filter by Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={filterDate}
                    onChange={(e) => setFilterDate(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col xs={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Filter by Assigned To</Form.Label>
                  <Form.Control
                    type="text"
                    value={assignedTo}
                    onChange={(e) => setAssignedTo(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col xs={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Filter by Source</Form.Label>
                  <Form.Control
                    type="text"
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col xs={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Filter by Assigned to Sales Supervisor</Form.Label>
                  <Form.Control
                    as="select"
                    value={assignedToModeration}
                    onChange={(e) => setAssignedToModeration(e.target.value)}
                  >
                    <option value="" hidden>Select a sales Supervisor</option>
                    {salesModerators.map((moderator) => (
                      <option key={moderator._id} value={moderator.name}>
                        {moderator.name}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col xs={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Filter by Assignation Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={assignationDate}
                    onChange={(e) => setAssignationDate(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Button variant="secondary" onClick={clearFilters}>
              Clear Filters
            </Button>
          </Form>

          {loading ? (
            <p>Loading prospect data...</p>
          ) : error ? (
            <p>{error}</p>
          ) : (
            <div style={{ overflowX: "auto" }}>
            <Table striped bordered hover style={{ overflowX: "auto", maxWidth: "100px" }}>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Phone Number</th>
                  <th>Email</th>
                  <th>National ID</th>
                  <th>Interested in Course</th>
                  <th>Status</th>
                  <th>Level</th>
                  <th>Source</th>
                  <th>Marketing Data ID</th>
                  <th>Student ID</th>
                  <th>Added Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{item.name}</td>
                    <td>{item.phoneNumber}</td>
                    <td>{item.email}</td>
                    <td>{item.nationalId}</td>
                    <td>{item.interestedInCourse}</td>
                    <td>{item.status}</td>
                    <td>{item.level}</td>
                    <td>{item.source}</td>
                    <td>{item.marketingDataId}</td>
                    <td>{item.studentId}</td>
                    <td>{new Date(item.addedDate).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
            </div>
          )}
        </Card.Body>
      </Card>
    </AdminLayout>
  );
};

export default ProspectList;
