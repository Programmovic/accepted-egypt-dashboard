import { Card, Form, Button, Row, Col, Table, Badge } from "react-bootstrap";
import { useEffect, useState } from "react";
import { AdminLayout } from "@layout";
import axios from "axios";
import { Modal } from "react-bootstrap";
import Select from "react-select";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MarketingData = () => {
  const [marketingData, setMarketingData] = useState([]);
  const [salesModerators, setSalesModerators] = useState([]);
  const [salesMembers, setSalesMembers] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterName, setFilterName] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [chatSummary, setChatSummary] = useState("");
  const [Source, setSource] = useState("");
  const [languageIssues, setLanguageIssues] = useState("");
  const [assignedToModeration, setAssignedToModeration] = useState("");
  const [assignationDate, setAssignationDate] = useState("");
  const [assignedToSales, setAssignedToSales] = useState("");

  // State for the modal form
  const [showModal, setShowModal] = useState(false);
  const [newName, setNewName] = useState("");
  const [newPhoneNo1, setNewPhoneNo1] = useState("");
  const [newPhoneNo2, setNewPhoneNo2] = useState("");
  const [newAssignTo, setNewAssignTo] = useState("");
  const [newChatSummary, setNewChatSummary] = useState("");
  const [newSource, setNewSource] = useState("");
  const [newLanguageIssues, setNewLanguageIssues] = useState("");
  const [newAssignedToModeration, setNewAssignedToModeration] = useState("");
  const [newAssignationDate, setNewAssignationDate] = useState("");
  const [newAssignedToSales, setNewAssignedToSales] = useState("");
  const fetchMarketingData = async () => {
    try {
      const response = await axios.get("/api/marketing");
      if (response.status === 200) {
        const data = response.data;
        setMarketingData(data.marketingData);
        setSalesModerators(data.salesModerators);
        setSalesMembers(data.salesMembers);
        setFilteredData(data.marketingData);
      }
    } catch (error) {
      console.error("Error fetching marketing data:", error);
      setError("Failed to fetch marketing data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMarketingData();
  }, []);

  useEffect(() => {
    // Apply filters when filter inputs change
    handleFilter();
  }, [filterName, filterDate, assignedTo, Source, languageIssues, assignedToModeration, assignationDate, assignedToSales, marketingData]);

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

    if (Source) {
      filteredMarketingData = filteredMarketingData.filter((item) =>
        item.Source.toLowerCase().includes(Source.toLowerCase())
      );
    }

    if (languageIssues) {
      filteredMarketingData = filteredMarketingData.filter((item) =>
        item.languageIssues.toLowerCase().includes(languageIssues.toLowerCase())
      );
    }

    if (assignedToModeration) {
      filteredMarketingData = filteredMarketingData.filter((item) =>
        item.assignedToModeration.toLowerCase().includes(assignedToModeration.toLowerCase())
      );
    }

    if (assignationDate) {
      filteredMarketingData = filteredMarketingData.filter((item) =>
        item.assignationDate.includes(assignationDate)
      );
    }

    if (assignedToSales) {
      filteredMarketingData = filteredMarketingData.filter((item) =>
        item.assignedToSales.toLowerCase().includes(assignedToSales.toLowerCase())
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
  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  const handleAddMarketingData = async () => {
    try {
      await axios.post("/api/marketing", {
        name: newName,
        phoneNo1: newPhoneNo1,
        phoneNo2: newPhoneNo2,
        assignTo: newAssignTo,
        chatSummary: newChatSummary,
        source: newSource,
        languageIssues: newLanguageIssues,
        assignedToModeration: newAssignedToModeration,
        assignationDate: newAssignationDate,
        assignedToSales: newAssignedToSales,
      });
      closeModal();
      fetchMarketingData();
      toast.success("Marketing data added successfully!");
    } catch (error) {
      console.error("Error adding marketing data:", error.message);
      setError("Failed to add marketing data. Please try again.");
      toast.error(error.message);
    }
  };
  const handleUpdateMarketingData = async (id, updatedData) => {
    try {
      await axios.put(`/api/marketing?id=${id}`, updatedData); // Assuming you pass the ID in the URL params
      closeModal();
      fetchMarketingData(); // Assuming fetchMarketingData is a function to refetch the updated data
      toast.success("Marketing data updated successfully!");
    } catch (error) {
      console.error("Error updating marketing data:", error.message);
      setError("Failed to update marketing data. Please try again.");
      toast.error(error.message);
    }
  };
  return (
    <AdminLayout>
      <ToastContainer />
      <Modal show={showModal} onHide={closeModal} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>Add New Marketing Data</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form style={{ maxHeight: "500px", overflowY: 'auto', padding: "5px 5px" }}>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Phone no1</Form.Label>
              <Form.Control
                type="text"
                value={newPhoneNo1}
                onChange={(e) => setNewPhoneNo1(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Phone no2</Form.Label>
              <Form.Control
                type="text"
                value={newPhoneNo2}
                onChange={(e) => setNewPhoneNo2(e.target.value)}
              />
            </Form.Group>
            {/* <Form.Group className="mb-3">
              <Form.Label>Assign to</Form.Label>
              <Form.Control
                type="text"
                value={newAssignTo}
                onChange={(e) => setNewAssignTo(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Chat Summary</Form.Label>
              <Form.Control
                as="textarea"
                value={newChatSummary}
                onChange={(e) => setNewChatSummary(e.target.value)}
              />
            </Form.Group> */}
            <Form.Group className="mb-3">
              <Form.Label>Source</Form.Label>
              <Form.Control
                type="text"
                value={newSource}
                onChange={(e) => setNewSource(e.target.value)}
              />
            </Form.Group>
            {/* <Form.Group className="mb-3">
              <Form.Label>Language Issues</Form.Label>
              <Form.Control
                type="text"
                value={newLanguageIssues}
                onChange={(e) => setNewLanguageIssues(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Assigned to Moderation</Form.Label>
              <Form.Control
                type="text"
                value={newAssignedToModeration}
                onChange={(e) => setNewAssignedToModeration(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Assignation Date</Form.Label>
              <Form.Control
                type="date"
                value={newAssignationDate}
                onChange={(e) => setNewAssignationDate(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Assigned to Sales</Form.Label>
              <Form.Control
                type="text"
                value={newAssignedToSales}
                onChange={(e) => setNewAssignedToSales(e.target.value)}
              />
            </Form.Group> */}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Close
          </Button>
          <Button variant="success" onClick={handleAddMarketingData}>
            Add Marketing Data
          </Button>
        </Modal.Footer>
      </Modal>
      <Card>
        <Card.Header>Marketing Data</Card.Header>
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
                    value={Source}
                    onChange={(e) => setSource(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col xs={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Filter by Language Issues</Form.Label>
                  <Form.Control
                    type="text"
                    value={languageIssues}
                    onChange={(e) => setLanguageIssues(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col xs={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Filter by Assigned to Moderation</Form.Label>
                  <Form.Control
                    type="text"
                    value={assignedToModeration}
                    onChange={(e) => setAssignedToModeration(e.target.value)}
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
              <Col xs={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Filter by Assigned to Sales</Form.Label>
                  <Form.Control
                    type="text"
                    value={assignedToSales}
                    onChange={(e) => setAssignedToSales(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col xs={6}>
                <Button variant="secondary" onClick={clearFilters}>
                  Clear Filters
                </Button>
              </Col>
              <Col xs={6} className="text-end">
                <Button variant="primary" onClick={openModal}>
                  Add New Data
                </Button>
              </Col>
            </Row>
          </Form>

          {loading ? (
            <p>Loading marketing data...</p>
          ) : error ? (
            <p>{error}</p>
          ) : (
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Phone no1</th>
                  <th>Phone no2</th>
                  <th>Assign to</th>
                  <th>Chat Summary</th>
                  <th>Source</th>
                  <th>Language Issues</th>
                  <th>Assigned to Moderation</th>
                  <th>Assignation Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{item.name}</td>
                    <td>{item.phoneNo1}</td>
                    <td>{item.phoneNo2}</td>
                    <td>{item.assignTo}</td>
                    <td>{item.chatSummary}</td>
                    <td>{item.Source}</td>
                    <td>{item.languageIssues}</td>
                    <td>
                      <Form.Control
                        as="select"
                        value={item.assignedToModeration}
                        onChange={(e) => {
                          setNewAssignedToModeration(e.target.value)
                          handleUpdateMarketingData(item._id, {
                            assignedToModeration: e.target.value,
                            assignationDate: new Date(),
                          })
                        }

                        }
                      >
                        <option value="" hidden>Select a sales moderator</option>
                        {salesModerators.map((moderator) => (
                          <option key={moderator._id} value={moderator.name}>
                            {moderator.name}
                          </option>
                        ))}
                      </Form.Control>
                    </td>
                    <td>{item.assignationDate && new Date(item.assignationDate).toLocaleDateString()}</td>
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
