import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Table, Form, Button } from "react-bootstrap";
import { AdminLayout } from "@layout";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MarketingDataDetail = () => {
  const [marketingData, setMarketingData] = useState(null);
  const [salesStatuses, setSalesStatuses] = useState([]);
  const [paymentScreenshotStatus, setPaymentScreenshotStatus] = useState([]);
  const [candidateSignUpFor, setCandidateSignUpFor] = useState([]);
  const [candidateStatusForSalesPerson, setCandidateStatusForSalesPerson] = useState([]);
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const router = useRouter();
  const { id } = router.query;
  const apiUrl = `/api/marketing?id=${id}`; // Define the API route to fetch marketing data by ID
  const salesStatusApiUrl = `/api/sales-status`; // Define the API route to fetch sales statuses
  const editing = true;

  useEffect(() => {
    const fetchMarketingData = async () => {
      try {
        const response = await axios.get(apiUrl);
        if (response.status === 200) {
          setMarketingData(response.data);
          console.log(response.data)
        }
      } catch (error) {
        console.error("Error fetching marketing data:", error);
      }
    };

    const fetchSalesStatuses = async () => {
      try {
        const response = await axios.get(salesStatusApiUrl);
        if (response.status === 200) {
          setSalesStatuses(response.data);
        }
      } catch (error) {
        console.error("Error fetching sales statuses:", error);
      }
    };
    const fetchPaymentScreenshotStatus = async () => {
      try {
        const response = await axios.get('/api/payment-screenshot-status');
        if (response.status === 200) {
          setPaymentScreenshotStatus(response.data);
        }
      } catch (error) {
        console.error("Error fetching sales statuses:", error);
      }
    };
    const fetchCandidateSignUpForStatus = async () => {
      try {
        const response = await axios.get('/api/candidate_signup_for');
        if (response.status === 200) {
          setCandidateSignUpFor(response.data);
        }
      } catch (error) {
        console.error("Error fetching sales statuses:", error);
      }
    };
    const fetchCandidateStatusForSalesPersonStatus = async () => {
      try {
        const response = await axios.get('/api/candidate-status-for-sales-person');
        if (response.status === 200) {
          setCandidateStatusForSalesPerson(response.data);
        }
      } catch (error) {
        console.error("Error fetching sales statuses:", error);
      }
    };
    if (id) {
      fetchMarketingData();
      fetchSalesStatuses();
      fetchPaymentScreenshotStatus()
      fetchCandidateSignUpForStatus()
      fetchCandidateStatusForSalesPersonStatus()
    }
  }, [id, apiUrl, salesStatusApiUrl, unsavedChanges]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMarketingData({ ...marketingData, [name]: value });
    setUnsavedChanges(true);
  };

  const handleSave = async () => {
    try {
      await axios.put(`/api/marketing?id=${id}`, marketingData);
      setUnsavedChanges(false);
      toast.success("Marketing data saved successfully!");
    } catch (error) {
      console.error("Error saving marketing data:", error.message);
      toast.error(error.message);
    }
  };

  return (
    <AdminLayout>
      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <span>Marketing Data Details</span>{" "}
          <span>
            Last Updated: {new Date(marketingData?.updatedAt).toLocaleString()}
          </span>
          <Button variant="primary" onClick={handleSave} disabled={!unsavedChanges}>
            Save
          </Button>
        </Card.Header>
        <Card.Body>
          {marketingData ? (
            <Table striped bordered hover>
              <tbody>
                <tr>
                  <td>Name</td>
                  <td>
                    {editing ? (
                      <Form.Control
                        type="text"
                        name="name"
                        value={marketingData.name}
                        onChange={handleChange}
                      />
                    ) : (
                      marketingData.name
                    )}
                  </td>
                </tr>
                <tr>
                  <td>Phone no1</td>
                  <td>
                    {editing ? (
                      <Form.Control
                        type="text"
                        name="phoneNo1"
                        value={marketingData.phoneNo1}
                        onChange={handleChange}
                      />
                    ) : (
                      marketingData.phoneNo1
                    )}
                  </td>
                </tr>
                <tr>
                  <td>Phone no2</td>
                  <td>
                    {editing ? (
                      <Form.Control
                        type="text"
                        name="phoneNo2"
                        value={marketingData.phoneNo2}
                        onChange={handleChange}
                      />
                    ) : (
                      marketingData.phoneNo2
                    )}
                  </td>
                </tr>
                <tr>
                  <td>Status</td>
                  <td>
                    {editing ? (
                      <Form.Control
                        as="select"
                        name="salesStatus"
                        value={marketingData.salesStatus}
                        onChange={handleChange}
                      >
                        <option value="">Select Sales Status</option>
                        {salesStatuses.map((status) => (
                          <option key={status._id} value={status.status}>
                            {status.status}
                          </option>
                        ))}
                      </Form.Control>
                    ) : (
                      marketingData.salesStatus
                    )}
                  </td>
                </tr>
                <tr>
                  <td>Candidate Sign Up For</td>
                  <td>
                    {editing ? (
                      <Form.Control
                        as="select"
                        name="candidateSignUpFor"
                        value={marketingData.candidateSignUpFor}
                        onChange={handleChange}
                      >
                        <option value="">Select Candidate Sign Up For</option>
                        {candidateSignUpFor.map((status) => (
                          <option key={status._id} value={status.status}>
                            {status.status}
                          </option>
                        ))}
                      </Form.Control>
                    ) : (
                      marketingData.candidateSignUpFor
                    )}
                  </td>
                </tr>
                <tr>
                  <td>Candidate Status For Sales Person</td>
                  <td>
                    {editing ? (
                      <Form.Control
                        as="select"
                        name="candidateStatusForSalesPerson"
                        value={marketingData.candidateStatusForSalesPerson}
                        onChange={handleChange}
                      >
                        <option value="">Select Candidate Status For Sales Person</option>
                        {candidateStatusForSalesPerson.map((status) => (
                          <option key={status._id} value={status.status}>
                            {status.status}
                          </option>
                        ))}
                      </Form.Control>
                    ) : (
                      marketingData.candidateStatusForSalesPerson
                    )}
                  </td>
                </tr>
                <tr>
                  <td>Payment Screenshot Status</td>
                  <td>
                    {editing ? (
                      <Form.Control
                        as="select"
                        name="paymentScreenshotStatus"
                        value={marketingData.paymentScreenshotStatus}
                        onChange={handleChange}
                      >
                        <option value="">Select Payment Screenshot Status</option>
                        {paymentScreenshotStatus.map((status) => (
                          <option key={status._id} value={status.status}>
                            {status.status}
                          </option>
                        ))}
                      </Form.Control>
                    ) : (
                      marketingData.paymentScreenshotStatus
                    )}
                  </td>
                </tr>
                <tr>
                  <td>Chat Summary</td>
                  <td>
                    {editing ? (
                      <Form.Control
                        as="textarea"
                        name="chatSummary"
                        value={marketingData.chatSummary}
                        onChange={handleChange}
                      />
                    ) : (
                      marketingData.chatSummary
                    )}
                  </td>
                </tr>
                <tr>
                  <td>Language Issues</td>
                  <td>
                    {editing ? (
                      <Form.Control
                        as="textarea"
                        name="languageIssues"
                        value={marketingData.languageIssues}
                        onChange={handleChange}
                      />
                    ) : (
                      marketingData.languageIssues
                    )}
                  </td>
                </tr>
                <tr>
                  <td>Assigned to Sales Moderator</td>
                  <td>
                    {marketingData.assignedToModeration} at{" "}
                    {new Date(marketingData.assignationDate).toLocaleString()}
                  </td>
                </tr>
                <tr>
                  <td>Assigned to Sales Member</td>
                  <td>
                    {marketingData.assignedToSales} at{" "}
                    {new Date(
                      marketingData.salesMemberAssignationDate
                    ).toLocaleString()}
                  </td>
                </tr>
              </tbody>
            </Table>
          ) : (
            <p>Loading...</p>
          )}
        </Card.Body>
      </Card>
    </AdminLayout>
  );
};

export default MarketingDataDetail;
