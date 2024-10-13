import { Card, Form, Button, Row, Col, Table, Pagination, Overlay, Popover } from "react-bootstrap";
import { useEffect, useState, useRef } from "react";
import { AdminLayout } from "@layout";
import axios from "axios";
import Select from "react-select";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import TextField from "@mui/material/TextField";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import RangeAssignment from "../../../components/RangeAssignment";
import useAuth from "../../../hooks/useAuth";

import DataTable from "../../../components/SalesDataTable";

const SalesModeratorData = () => {
  const [marketingData, setMarketingData] = useState([]);
  const [salesModerators, setSalesModerators] = useState([]);
  const [salesMembers, setSalesMembers] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterName, setFilterName] = useState("");
  const token = useAuth();
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
  const [searchTerm, setSearchTerm] = useState(""); // Added state for search term
  const [filterApplied, setFilterApplied] = useState(false); // Added state for filter applied
  const [showFilter, setShowFilter] = useState(false); // Added state for showing filter
  const filterRef = useRef(null); // Added ref for filter button

  const fetchMarketingData = async () => {
    // Show loading toast
    const toastId = toast.loading("Fetching marketing data...");

    try {
      const response = await axios.get("/api/marketing?assignedToModerator=true", {
        headers: {
          Authorization: `Bearer ${token}`, // Adjust according to your API's authentication scheme
        },
      });

      if (response.status === 200) {
        const data = response.data;
        setMarketingData(data.marketingData);
        setSalesModerators(data.salesModerators);
        setSalesMembers(data.salesMembers);
        setFilteredData(data.marketingData);

        // Update toast with success message
        toast.update(toastId, {
          render: "Marketing data fetched successfully!",
          type: "success",
          isLoading: false,
          autoClose: 3000,
        });
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching marketing data:", error.message);
      setError("Failed to fetch marketing data. Please try again later.");

      // Update toast with error message
      toast.update(toastId, {
        render: "Error fetching marketing data.",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  };


  useEffect(() => {
    fetchMarketingData();
  }, []);

  useEffect(() => {
    handleFilter();
  }, [searchTerm, filterName, filterPhone, filterDate, assignedTo, Source, languageIssues, assignedToModeration, assignationDate, assignedToSales, marketingData]);

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
    setCurrentPage(1)
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleUpdateMarketingData = async (id, updatedData) => {
    // Show loading toast
    const toastId = toast.loading("Updating marketing data...");

    try {
      await axios.put(`/api/marketing?id=${id}`, updatedData);

      // Fetch the latest marketing data after update
      try {
        await fetchMarketingData();
        toast.update(toastId, {
          render: "Marketing data updated successfully!",
          type: "success",
          isLoading: false,
          autoClose: 3000,
        });
      } catch (fetchError) {
        console.error("Error fetching updated marketing data:", fetchError.message);
        toast.update(toastId, {
          render: "Failed to fetch updated marketing data.",
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error("Error updating marketing data:", error.message);
      setError("Failed to update marketing data. Please try again.");
      toast.update(toastId, {
        render: `Error: ${error.message}`,
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  };


  const handleRangeAssign = async (rangeStart, rangeEnd, selectedSalesMember) => {
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
      <RangeAssignment salesMembers={salesMembers} handleRangeAssign={handleRangeAssign} />

      <Card>
        <Card.Header>Sales Data for Sales Supervisor</Card.Header>
        <Card.Body>

          {loading ? (
            <p>Loading marketing data...</p>
          ) : error ? (
            <p>{error}</p>
          ) : (
            <>
              <DataTable
                currentItems={currentItems}
                filteredData={filteredData}
                salesMembers={salesMembers}
                handleUpdateMarketingData={handleUpdateMarketingData}
                paginationEnabled={paginationEnabled}
              />
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
