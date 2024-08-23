import { Card, Form, Button, Row, Col, Table, Badge, Pagination } from "react-bootstrap";
import { useEffect, useState } from "react";
import { AdminLayout } from "@layout";
import axios from "axios";
import Select from "react-select";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const SalesModeratorData = () => {
  const [marketingData, setMarketingData] = useState([]);
  const [salesModerators, setSalesModerators] = useState([]);
  const [salesMembers, setSalesMembers] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterName, setFilterName] = useState("");
  
  const [filterPhone, setFilterPhone] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [Source, setSource] = useState("");
  const [languageIssues, setLanguageIssues] = useState("");
  const [assignedToModeration, setAssignedToModeration] = useState("");
  const [assignationDate, setAssignationDate] = useState("");
  const [assignedToSales, setAssignedToSales] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [paginationEnabled, setPaginationEnabled] = useState(true);
  const [rangeStart, setRangeStart] = useState("");
  const [rangeEnd, setRangeEnd] = useState("");
  const [selectedSalesMember, setSelectedSalesMember] = useState("");

  const fetchMarketingData = async () => {
    try {
      const response = await axios.get("/api/marketing?assignedToModerator=true");
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
    handleFilter();
  }, [filterName, filterPhone, filterDate, assignedTo, Source, languageIssues, assignedToModeration, assignationDate, assignedToSales, marketingData]);

  const handleFilter = () => {
    let filteredMarketingData = [...marketingData];

    if (filterName) {
      filteredMarketingData = filteredMarketingData.filter((item) =>
        item.name.toLowerCase().includes(filterName.toLowerCase())
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
        item?.salesMemberAssignationDate?.includes(assignationDate)
      );
    }

    if (assignedToSales) {
      filteredMarketingData = filteredMarketingData.filter((item) =>
        item?.assignedToSales?.toLowerCase().includes(assignedToSales.toLowerCase())
      );
    }

    setFilteredData(filteredMarketingData);
    setCurrentPage(1); // Reset to the first page when filters change
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
    setCurrentPage(1); // Reset to the first page when filters are cleared
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleUpdateMarketingData = async (id, updatedData) => {
    try {
      await axios.put(`/api/marketing?id=${id}`, updatedData);
      fetchMarketingData();
      toast.success("Marketing data updated successfully!");
    } catch (error) {
      console.error("Error updating marketing data:", error.message);
      setError("Failed to update marketing data. Please try again.");
      toast.error(error.message);
    }
  };

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
          assignedToSales: selectedSalesMember,
          salesMemberAssignationDate: new Date(),
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
      <Card>
        <Card.Header>Sales Data for Sales Supervisor</Card.Header>
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
                  <Form.Label>Filter by Phone</Form.Label>
                  <Form.Control
                    type="text"
                    value={filterPhone}
                    onChange={(e) => setFilterPhone(e.target.value)}
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
            </Row>
            <Row>
              <Col xs={4}>
                <Button variant="secondary" onClick={clearFilters}>
                  Clear Filters
                </Button>
              </Col>
              {paginationEnabled && (
                <Col xs={4}>
                  <Button variant="secondary" onClick={() => setPaginationEnabled(!paginationEnabled)}>
                    Assign In Range
                  </Button>
                </Col>
              )}
              <Col xs={4}>
                <Button onClick={exportToExcel} variant="primary" className="ms-2">
                  Export to Excel
                </Button>
              </Col>
            </Row>
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
                        {salesMembers.map((member) => (
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
            <>
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
                    <th>Assigned to Member</th>
                    <th>Assignation Date</th>
                  </tr>
                </thead>
                <tbody>
                  {(paginationEnabled ? currentItems : filteredData).map((item, index) => (
                    <tr key={index}>
                      <td className={(index + 1 >= rangeStart && index + 1 <= rangeEnd) && "bg-success text-light"}>{index + 1}</td>
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
                          value={item.assignedToSales}
                          onChange={(e) => {
                            const threeDaysInMillis = 3 * 24 * 60 * 60 * 1000; // 3 days in milliseconds
                            const timeSinceLastAssignation = new Date() - new Date(item.salesMemberAssignationDate);

                            if (item.assignedToSales && timeSinceLastAssignation < threeDaysInMillis) {
                              toast.error("You cannot reassign within 3 days of the last assignation.");
                            } else {
                              handleUpdateMarketingData(item._id, {
                                assignedToSales: e.target.value,
                                salesMemberAssignationDate: new Date(),
                              });
                            }
                          }}
                        >
                          <option value="" hidden>Select a sales member</option>
                          {salesMembers.map((moderator) => (
                            <option key={moderator._id} value={moderator.name}>
                              {moderator.name}
                            </option>
                          ))}
                        </Form.Control>

                      </td>

                      <td>{item.salesMemberAssignationDate && new Date(item.salesMemberAssignationDate).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              {paginationEnabled && (
                <Pagination className="d-flex justify-content-center">
                  <Pagination.Prev
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                  />
                  {Array.from({ length: Math.ceil(filteredData.length / itemsPerPage) }, (_, index) => {
                    const page = index + 1;
                    if (page === currentPage ||                       // Show current page
                      page === 1 ||                               // Show first page
                      page === Math.ceil(filteredData.length / itemsPerPage) ||  // Show last page
                      Math.abs(page - currentPage) <= 1 ||        // Show neighboring pages
                      (currentPage < 4 && page < 5) ||            // Show early pages
                      (Math.ceil(filteredData.length / itemsPerPage) - currentPage < 3 && Math.ceil(filteredData.length / itemsPerPage) - page < 3) // Show final pages
                    ) {
                      return (
                        <Pagination.Item
                          key={index}
                          active={page === currentPage}
                          onClick={() => paginate(page)}
                        >
                          {page}
                        </Pagination.Item>
                      );
                    } else if (page === 2 || page === Math.ceil(filteredData.length / itemsPerPage) - 1) { // Show secondary pages
                      return <Pagination.Ellipsis key={index} />;
                    }
                    return null;
                  })}
                  <Pagination.Next
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === Math.ceil(filteredData.length / itemsPerPage)}
                  />
                </Pagination>
              )}
            </>
          )}
        </Card.Body>
      </Card>
    </AdminLayout>
  );
};

export default SalesModeratorData;
