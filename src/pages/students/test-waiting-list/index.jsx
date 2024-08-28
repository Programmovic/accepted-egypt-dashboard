import { Card, Form, Button, Row, Col, Table } from "react-bootstrap";
import { useEffect, useState } from "react";
import { AdminLayout } from "@layout";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MarketingData = () => {
  const [marketingData, setMarketingData] = useState([]);
  const [placementTests, setPlacementTests] = useState([]);
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
  const [selectedTest, setSelectedTest] = useState({});

  const fetchMarketingData = async () => {
    try {
      const response = await axios.get("/api/marketing?test_waiting_list=true");
      if (response.status === 200) {
        const data = response.data;
        setMarketingData(data.marketingData);
        setFilteredData(data.marketingData);
      }
    } catch (error) {
      console.error("Error fetching marketing data:", error);
      setError("Failed to fetch marketing data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const fetchPlacementTests = async () => {
    try {
      const response = await axios.get("/api/placement_test_settings/for_placer");
      if (response.status === 200) {
        const data = response.data;
        setPlacementTests(data);
      }
    } catch (error) {
      console.error("Error fetching placement tests:", error);
      setError("Failed to fetch placement tests. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMarketingData();
    fetchPlacementTests();
  }, []);

  useEffect(() => {
    handleFilter();
  }, [filterName, filterDate, assignedTo, source, languageIssues, assignedToModeration, assignationDate, assignedToSales, marketingData]);

  const handleFilter = () => {
    let filteredMarketingData = [...marketingData];

    if (filterName) {
      filteredMarketingData = filteredMarketingData.filter((item) =>
        item.name.toLowerCase().includes(filterName.toLowerCase())
      );
    }

    if (filterDate) {
      filteredMarketingData = filteredMarketingData.filter((item) =>
        item.createdAt.includes(filterDate)
      );
    }

    if (assignedTo) {
      filteredMarketingData = filteredMarketingData.filter((item) =>
        item.assignTo.toLowerCase().includes(assignedTo.toLowerCase())
      );
    }

    if (source) {
      filteredMarketingData = filteredMarketingData.filter((item) =>
        item.Source.toLowerCase().includes(source.toLowerCase())
      );
    }

    if (languageIssues) {
      filteredMarketingData = filteredMarketingData.filter((item) =>
        item.languageIssues.toLowerCase().includes(languageIssues.toLowerCase())
      );
    }

    if (assignedToModeration) {
      filteredMarketingData = filteredMarketingData.filter((item) =>
        item?.assignedToModeration?.toLowerCase().includes(assignedToModeration.toLowerCase())
      );
    }

    if (assignationDate) {
      filteredMarketingData = filteredMarketingData.filter((item) =>
        item?.assignationDate?.includes(assignationDate)
      );
    }

    if (assignedToSales) {
      filteredMarketingData = filteredMarketingData.filter((item) =>
        item?.assignedToSales?.toLowerCase().includes(assignedToSales.toLowerCase())
      );
    }

    setFilteredData(filteredMarketingData);
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
    setFilteredData(marketingData);
  };

  const handleUpdateTestSelection = (id, test) => {
    setSelectedTest(prevState => ({
      ...prevState,
      [id]: test
    }));
  };

  return (
    <AdminLayout>
      <ToastContainer />
      <Card>
        <Card.Header className="d-flex align-items-center">
          <div className="w-50">Placement Test Waiting List</div>
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
            <p>Loading marketing data...</p>
          ) : error ? (
            <p>{error}</p>
          ) : (
            <Table striped bordered hover style={{ overflowX: "auto" }}>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Phone no1</th>
                  <th>Phone no2</th>
                  <th>Sales Member</th>
                  <th>Select Test</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{item.name}</td>
                    <td>{item.phoneNo1}</td>
                    <td>{item.phoneNo2}</td>
                    <td>{item.assignedToSales}</td>
                    <td>
                      <Form.Control
                        as="select"
                        value={selectedTest[item._id] || ""}
                        onChange={(e) => handleUpdateTestSelection(item._id, e.target.value)}
                      >
                        <option value="">Select a test</option>
                        {placementTests.map((test) => (
                          <option key={test._id} value={test._id}>
                            {test.cost} - {new Date(test.date).toLocaleString()}
                          </option>
                        ))}
                      </Form.Control>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>
    </AdminLayout>
  );
};

export default MarketingData;
