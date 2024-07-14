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
  const [paymentMethods, setPaymentMethods] = useState([]);
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
  const fetchMarketingData = async () => {
    try {
      const response = await axios.get("/api/marketing");
      if (response.status === 200) {
        const data = response.data;
        setMarketingData(data.marketingData.filter(item => item.paymentMethod));
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
  const fetchPaymentMethods = async () => {
    try {
      const response = await axios.get("/api/payment-method");
      if (response.status === 200) {
        const data = response.data;
        setPaymentMethods(data);
        console.log(data)
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
    fetchPaymentMethods()
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
  const handleUpdateMarketingData = async (id, updatedData) => {
    try {
      await axios.put(`/api/marketing?id=${id}`, updatedData);
      fetchMarketingData(); // Assuming fetchMarketingData is a function to refetch the updated data
      toast.success("Marketing data updated successfully!");
    } catch (error) {
      console.error("Error updating marketing data:", error.message);
      setError("Failed to update marketing data. Please try again.");
      toast.error(error.message);
    }
  };

  const [rangeStart, setRangeStart] = useState("");
  const [rangeEnd, setRangeEnd] = useState("");
  const [selectedSalesMember, setSelectedSalesMember] = useState("");
  console.log(paymentMethods.filter(method => method.type === "Vodafone Cash").configuration)
  return (
    <AdminLayout>
      <ToastContainer />
      {/* <Row>
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
      </Row> */}
      <Card>
        <Card.Header className="d-flex align-items-center">
          <div className="w-50">Pending Students</div>
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
              {/* <Col xs={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Filter by Language Issues</Form.Label>
                  <Form.Control
                    type="text"
                    value={languageIssues}
                    onChange={(e) => setLanguageIssues(e.target.value)}
                  />
                </Form.Group>
              </Col> */}
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
                  <th>Payment Method</th>
                  <th>
                    Reciever
                  </th>
                  <th>
                    Reference Number
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item, index) => (
                  <tr key={index}>
                    <td className={(index + 1 >= rangeStart && index + 1 <= rangeEnd) && "bg-success text-light"}>{index + 1}</td>
                    <td>{item.name}</td>
                    <td>{item.phoneNo1}</td>
                    <td>{item.phoneNo2}</td>
                    <td>{item.paymentMethod}</td>
                    <td>
                      {(
                        <Form.Control
                          as="select"
                          name="recieverNumber"
                          value={item.recieverNumber}
                          onChange={(e) => {
                            handleUpdateMarketingData(item._id, {
                              recieverNumber: e.target.value,
                            })
                          }}
                        >
                          <option value="">Select {item.paymentMethod} number</option>
                          {["Vodafone Cash", "Orange Money", "Etisalat Cash"].includes(item.paymentMethod) &&
                            paymentMethods.filter(method => method.type === item.paymentMethod)[0]?.configuration?.walletNumber.map((number) => (
                              <option key={number} value={number}>
                                {number}
                              </option>
                            ))}
                          {["Bank Transfer"].includes(item.paymentMethod) &&
                            paymentMethods.filter(method => method.type === item.paymentMethod)[0]?.configuration?.bankAccountNumber.map((number) => (
                              <option key={number} value={number}>
                                {number}
                              </option>
                            ))}
                        </Form.Control>
                      )}
                    </td>
                    <td>
                      {(
                        <Form.Control
                          name="referenceNumber"
                          value={item.referenceNumber}
                          disabled={!item.recieverNumber ? true : false}
                          onBlur={(e) => {
                            handleUpdateMarketingData(item._id, {
                              referenceNumber: e.target.value,
                            });
                          }}
                        />

                      )}
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
