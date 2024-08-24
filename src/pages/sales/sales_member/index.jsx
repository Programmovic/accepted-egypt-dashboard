import { Card, Form, Button, Row, Col, Table, Overlay, Popover } from "react-bootstrap";
import { useEffect, useState, useRef } from "react";
import { AdminLayout } from "@layout";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { TextField } from "@mui/material";
import { faFilter } from "@fortawesome/free-solid-svg-icons";
import FilterAltIcon from '@mui/icons-material/FilterAlt';

const SalesMemberAssignedData = () => {
  const [marketingData, setMarketingData] = useState([]);
  const [salesModerators, setSalesModerators] = useState([]);
  const [salesMembers, setSalesMembers] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [filterName, setFilterName] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [filterPhone, setFilterPhone] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [Source, setSource] = useState("");
  const [languageIssues, setLanguageIssues] = useState("");
  const [assignedToModeration, setAssignedToModeration] = useState("");
  const [assignationDate, setAssignationDate] = useState("");
  const [assignedToSales, setAssignedToSales] = useState("");
  const [filterApplied, setFilterApplied] = useState(false);
  const filterRef = useRef(null);

  const fetchMarketingData = async () => {
    try {
      const response = await axios.get("/api/marketing?assignedToMember=true");
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
  }, [searchTerm, filterName, filterDate, filterPhone, assignedTo, Source, languageIssues, assignedToModeration, assignationDate, assignedToSales, marketingData]);

  const handleFilter = () => {
    let filteredMarketingData = [...marketingData];

    if (searchTerm) {
      filteredMarketingData = filteredMarketingData.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.phoneNo1.includes(searchTerm) ||
        item.phoneNo2.includes(searchTerm)
      );
    }

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

    if (filterPhone) {
      filteredMarketingData = filteredMarketingData.filter(
        (item) =>
          item.phoneNo1.includes(filterPhone) || item.phoneNo2.includes(filterPhone)
      );
    }

    if (assignedTo) {
      filteredMarketingData = filteredMarketingData.filter((item) =>
        item.assignTo.toLowerCase().includes(assignedTo.toLowerCase())
      );
    }

    if (Source) {
      filteredMarketingData = filteredMarketingData.filter((item) =>
        item.source.toLowerCase().includes(Source.toLowerCase())
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
    setFilterApplied(
      searchTerm || filterName || filterDate || filterPhone || assignedTo || Source || languageIssues || assignedToModeration || assignationDate || assignedToSales
    );
  };

  const clearFilters = () => {
    setFilterName("");
    setFilterDate("");
    setFilterPhone("");
    setAssignedTo("");
    setSource("");
    setLanguageIssues("");
    setAssignedToModeration("");
    setAssignationDate("");
    setAssignedToSales("");
    setFilteredData(marketingData);
    setSearchTerm("");
    setFilterApplied(false);
  };

  const exportToExcel = () => {
    const headers = [
      "Name", "Phone No. 1", "Phone No. 2", "Assign To", "Chat Summary", "Source", "Language Issues", "Assigned To Moderation", "Assignation Date", "Assigned To Sales"
    ];
    const data = filteredData.map(item => [
      item.name, item.phoneNo1, item.phoneNo2, item.assignTo, item.chatSummary, item.source, item.languageIssues, item.assignedToModeration, item.assignationDate, item.assignedToSales
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
                      <Form.Label>Filter by Phone Number</Form.Label>
                      <Form.Control
                        type="text"
                        value={filterPhone}
                        onChange={(e) => setFilterPhone(e.target.value)}
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

        <Card.Header>Sales Data for Sales Agent</Card.Header>
        <Card.Body>
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
                  <th>Assignation Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item, index) => (
                  <tr key={index}>
                    <td
                      className={
                        item.verificationStatus === "Rejected"
                          ? "bg-danger text-light"
                          : item.verificationStatus === "Pending"
                            ? "bg-warning text-dark"
                            : item.verificationStatus === "Verified"
                              ? "bg-success text-light"
                              : ""
                      }
                    >
                      {index + 1}
                    </td>
                    <td>
                      <Link legacyBehavior href={`/sales/sales_member/detailed_marketing_item/${item._id}`}>
                        <a>{item.name}</a>
                      </Link>
                    </td>
                    <td>{item.phoneNo1}</td>
                    <td>{item.phoneNo2}</td>
                    <td>{item.assignTo}</td>
                    <td>{item.chatSummary}</td>
                    <td>{item.Source}</td>
                    <td>{item.languageIssues}</td>
                    <td>{item.salesMemberAssignationDate && new Date(item.salesMemberAssignationDate).toLocaleDateString()}</td>
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

export default SalesMemberAssignedData;
