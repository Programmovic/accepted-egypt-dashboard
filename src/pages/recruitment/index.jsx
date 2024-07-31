import { Card, Form, Button, Row, Col, Table, Badge } from "react-bootstrap";
import { useEffect, useState } from "react";
import { AdminLayout } from "@layout";
import axios from "axios";
import { Modal } from "react-bootstrap";
import Select from "react-select";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

import { ClassCard } from "@components/Classes";

const MarketingData = () => {
  const [marketingData, setMarketingData] = useState([]);
  const [candidateSignUpForData, setCandidateSignUpForData] = useState([]);
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
      const response = await axios.get("/api/marketing?recruitment=true");
      if (response.status === 200) {
        const data = response.data;
        setMarketingData(data.marketingData);
        console.log(data.marketingData)
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
  const fetchCandidateSignUpForStatus = async () => {
    try {
      const response = await axios.get('/api/candidate_signup_for');
      if (response.status === 200) {
        setCandidateSignUpForData(response.data);
      }
    } catch (error) {
      console.error("Error fetching sales statuses:", error);
    }
  };

  useEffect(() => {
    fetchMarketingData();
    fetchCandidateSignUpForStatus()
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
  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);
  useEffect(() => {
    const keyPressEvent = (e) => {
      if (e.keyCode === 13 && showModal) {
        handleAddMarketingData()
      }
    };
    document.addEventListener('keydown', keyPressEvent, true);

    return () => {
      document.removeEventListener('keydown', keyPressEvent);
    };

  }, []);
  const handleAddMarketingData = async () => {

    try {
      if (!newName || !newPhoneNo1) {
        toast.error("Please fill all required fields.");
        return;
      }
      if (newPhoneNo1.length > 11 || newPhoneNo1.length < 11) {
        toast.error("Phone must be at least 11 digits.");
        return;
      }
      await axios.post("/api/marketing", {
        name: newName,
        phoneNo1: newPhoneNo1,
        phoneNo2: newPhoneNo2,
        candidateSignUpFor: newAssignTo,
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
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      // Filter out invalid data items
      const validDataItems = jsonData.filter(dataItem => {
        if (!dataItem.name || !dataItem.phoneNo1) {
          toast.error("Please fill all required fields.");
          return false;
        }
        if (dataItem.phoneNo1.length !== 11) {
          toast.error("Phone must be exactly 11 digits.");
          return false;
        }
        return true;
      });

      if (validDataItems.length === 0) {
        toast.error("No valid data to upload.");
        return;
      }

      // Process valid data items
      validDataItems.forEach(async (dataItem) => {
        try {
          await axios.post("/api/marketing", dataItem);
          fetchMarketingData();
          toast.success(`${dataItem.name} has been added successfully!`);
        } catch (error) {
          console.error("Error adding marketing data from file:", error.message);
          toast.error(`Error adding data for ${dataItem.name}`);
        }
      });

      toast.success("Marketing data uploaded successfully!");
    };

    reader.readAsArrayBuffer(file);
  };

  const downloadTemplate = () => {
    const templateData = [
      {
        name: "",
        phoneNo1: "",
        phoneNo2: "",
        assignTo: "",
        source: "",
      },
    ];

    const worksheet = XLSX.utils.json_to_sheet(templateData);
    const workbook = { Sheets: { data: worksheet }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "MarketingDataTemplate.xlsx");
  };
  const [paginationEnabled, setPaginationEnabled] = useState(true);
  const [rangeStart, setRangeStart] = useState("");
  const [rangeEnd, setRangeEnd] = useState("");
  const [selectedSalesMember, setSelectedSalesMember] = useState("");
  const handleRangeAssign = async () => {
    if (!rangeStart || !rangeEnd || !selectedSalesMember) {
      toast.error("Please fill in all range fields and select a sales member.");
      return;
    }

    const start = parseInt(rangeStart) - 1;
    const end = parseInt(rangeEnd);

    if (start >= 0 && end <= filteredData.length && start < end) {
      const updates = filteredData.slice(start, end).map((item) =>
        handleUpdateMarketingData(item._id, {
          assignedToModeration: selectedSalesMember,
          assignationDate: new Date(),
        })
      );
      await Promise.all(updates);
      toast.success("Assigned sales member to specified range successfully!");
      setRangeStart(0)
      setRangeEnd(0)
      setSelectedSalesMember(null)
    } else {
      toast.error("Invalid range.");
    }
  };
  const exportToExcel = () => {
    const headers = [
      "Name", "Phone No. 1", "Phone No. 2", "Assign To", "Source", "Language Issues", "Assigned To Moderation", "Assignation Date", "Assigned To Sales"
    ];
    const data = filteredData.map(item => [
      item.name, item.phoneNo1, item.phoneNo2, item.assignTo, item.source, item.languageIssues, item.assignedToModeration, item.assignationDate, item.assignedToSales
    ]);

    const worksheet = XLSX.utils.aoa_to_sheet([headers, ...data]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Marketing Data");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const dataBlob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(dataBlob, "marketing_data.xlsx");
  };
  return (
    <AdminLayout>
      <ToastContainer />
      <Row>
        <ClassCard
          data={marketingData.length}
          title="Total Leads"
          enableOptions={false}
          isLoading={loading}
        />
        <ClassCard
          data={marketingData.filter(lead => lead.assignedToModeration).length}
          title="Total Assigned Leads"
          enableOptions={false}
          isLoading={loading}
        />
        <ClassCard
          data={marketingData.filter(lead => lead.assignTo === "EWFS").length}
          title="Total Leads For EWFS"
          enableOptions={false}
          isLoading={loading}
        />
        <ClassCard
          data={marketingData.filter(lead => lead.assignTo === "Autobus El Shoughl").length}
          title="Total Leads For Autobus El Shoughl"
          enableOptions={false}
          isLoading={loading}
        />
      </Row>
      <Modal show={showModal} onHide={closeModal} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>Add New Marketing Data</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddMarketingData} style={{ maxHeight: "500px", overflowY: 'auto', padding: "5px 5px" }}>
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
                onChange={(e) => {
                  setNewPhoneNo1(e.target.value)
                }}
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
            <Form.Group className="mb-3">
              <Form.Label>Candidate Signed Up For</Form.Label>
              <Form.Control
                as="select"
                value={newAssignTo}
                onChange={(e) => setNewAssignTo(e.target.value)}
              >
                <option value="" hidden>Select an option</option>
                {candidateSignUpForData.map((status) => (
                  <option key={status._id} value={status.status}>
                    {status.status}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Source</Form.Label>
              <Form.Control
                as="select"
                value={newSource}
                onChange={(e) => setNewSource(e.target.value)}
              >
                <option value="" hidden>Select a source</option>
                <option value="Facebook">Facebook</option>
                <option value="Linkedin">LinkedIn</option>
                <option value="Instagram">Instagram</option>
                <option value="TikTok">TikTok</option>
                <option value="Organic">Organic</option>
                <option value="Other">Other</option>
              </Form.Control>
            </Form.Group>


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
        <Card.Header className="d-flex align-items-center">
          <div className="w-50">Marketing Data</div>
          <div className="w-50 d-flex justify-content-between align-items-center">
            <input type="file" onChange={handleFileUpload} accept=".xlsx, .xls" />
            <Button variant="outline-primary" onClick={downloadTemplate}>
              Download Template
            </Button>
          </div>
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
                    value={Source}
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
            <div className="d-flex justify-content-between">
              <Button variant="secondary" onClick={clearFilters}>
                Clear Filters
              </Button>
              <Button variant="primary" onClick={openModal}>
                Add New Data
              </Button>
              {paginationEnabled && (
                <Button variant="secondary" onClick={() => setPaginationEnabled(!paginationEnabled)}>
                  Assign In Range
                </Button>
              )}
              <Button onClick={exportToExcel} variant="primary" className="ms-2">
                Export to Excel
              </Button>
            </div>
            {paginationEnabled || (
              <>
                <Row className="mt-3">
                  <Col xs={4}>
                    <Form.Group>
                      <Form.Label>Range Start</Form.Label>
                      <Form.Control
                        type="number"
                        value={rangeStart}
                        onChange={(e) => setRangeStart(e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                  <Col xs={4}>
                    <Form.Group>
                      <Form.Label>Range End</Form.Label>
                      <Form.Control
                        type="number"
                        value={rangeEnd}
                        onChange={(e) => setRangeEnd(e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                  <Col xs={4}>
                    <Form.Group>
                      <Form.Label>Select Sales Member</Form.Label>
                      <Form.Control
                        as="select"
                        value={selectedSalesMember}
                        onChange={(e) => setSelectedSalesMember(e.target.value)}
                      >
                        <option value="" hidden>Select a sales member</option>
                        {salesModerators.map((member) => (
                          <option key={member._id} value={member.name}>
                            {member.name}
                          </option>
                        ))}
                      </Form.Control>
                    </Form.Group>
                  </Col>
                </Row>
                <Row className="mt-3">
                  <Col className="d-flex justify-content-between">
                    <Button variant="primary" onClick={handleRangeAssign}>
                      Assign Sales Member to Range
                    </Button>
                    <Button variant="secondary" onClick={() => setPaginationEnabled(!paginationEnabled)}>
                      Close
                    </Button>
                  </Col>
                </Row>
              </>
            )}
          </Form>

          {loading ? (
            <p>Loading marketing data...</p>
          ) : error ? (
            <p>{error}</p>
          ) : (
            <div style={{ maxWidth: "100%", overflowX: "auto" }}>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th style={{ position: "sticky", left: 0, background: "#fff", zIndex: 1 }}>#</th>
                    <th style={{ position: "sticky", left: 0, background: "#fff", zIndex: 1 }}>Name</th>
                    <th style={{ minWidth: "fit-content" }}>Phone no1</th>
                    <th style={{ minWidth: "fit-content" }}>Phone no2</th>
                    <th>Source</th>
                    <th>Phone Interview Status</th>
                    <th>Phone Interview Date</th>
                    <th>Face To Face Status</th>
                    <th>Face To Face Date</th>
                    <th>Feedback Session Status</th>
                    <th>Feedback Session Date</th>
                    <th>Test Result</th>
                    <th>Test Result Date</th>
                    <th>Created At</th>
                    <th>Last Updated</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((item, index) => (
                    <tr key={index}>
                      <td className={(index + 1 >= rangeStart && index + 1 <= rangeEnd) && "bg-success text-light"}>{index + 1}</td>
                      <td style={{ position: "sticky", left: 0, background: "#fff", zIndex: 1 }}>{item.name}</td>
                      <td>{item.phoneNo1}</td>
                      <td>{item.phoneNo2}</td>
                      <td>{item.source}</td>
                      <td>{item.phoneInterviewStatus}</td>
                      <td>{item.phoneInterviewDate}</td>
                      <td>{item.faceToFaceStatus}</td>
                      <td>{item.faceToFaceDate}</td>
                      <td>{item.feedbackSessionStatus}</td>
                      <td>{item.feedbackSessionDate}</td>
                      <td>{item.testResultStatus}</td>
                      <td>{item.testResultDate}</td>
                      <td>{item.createdAt && new Date(item.createdAt).toLocaleString()}</td>
                      <td>{item.updatedAt && new Date(item.updatedAt).toLocaleString()}</td>
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

export default MarketingData;
