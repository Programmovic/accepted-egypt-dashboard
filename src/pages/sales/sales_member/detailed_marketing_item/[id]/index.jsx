import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Table, Form, Button } from "react-bootstrap";
import { AdminLayout } from "@layout";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MarketingDataDetail = () => {
  const [marketingData, setMarketingData] = useState({
    name: "",
    phoneNo1: "",
    phoneNo2: "",
    assignTo: "",
    chatSummary: "",
    source: "",
    languageIssues: "",
    assignedToModeration: "",
    assignationDate: null,
    assignedToSales: "",
    salesStatus: "",
    candidateSignUpFor: "",
    candidateStatusForSalesPerson: "",
    paymentMethod: "",
    paymentScreenshotStatus: "",
    salesRejectionReason: "",
    salesMemberAssignationDate: null,
  });

  const [salesStatuses, setSalesStatuses] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [candidateSignUpFor, setCandidateSignUpFor] = useState([]);
  const [candidateStatusForSalesPerson, setCandidateStatusForSalesPerson] = useState([]);
  const [salesRejectionReason, setSalesRejectionReason] = useState([]);
  const [trainingLocations, setTrainingLocations] = useState([]);
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
          setMarketingData((prevData) => ({
            ...prevData,
            ...response.data,
          }));
          
        }
      } catch (error) {
        console.error("Error fetching marketing data:", error);
      }
    };
    console.log(marketingData);
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
    const fetchPaymentMethods = async () => {
      try {
        const response = await axios.get('/api/payment-method');
        if (response.status === 200) {
          setPaymentMethods(response.data);
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
    const fetchSalesRejectionReason = async () => {
      try {
        const response = await axios.get('/api/sales-rejection-reason');
        if (response.status === 200) {
          setSalesRejectionReason(response.data);
        }
      } catch (error) {
        console.error("Error fetching sales statuses:", error);
      }
    };
    const fetchTrainingLocation = async () => {
      try {
        const response = await axios.get('/api/trainingLocation');
        if (response.status === 200) {
          setTrainingLocations(response.data);
        }
      } catch (error) {
        console.error("Error fetching sales statuses:", error);
      }
    };

    if (id) {
      fetchMarketingData();
      fetchSalesStatuses();
      fetchPaymentMethods()
      fetchCandidateSignUpForStatus()
      fetchTrainingLocation()
      fetchCandidateStatusForSalesPersonStatus()
      fetchSalesRejectionReason()
    }
  }, [id, apiUrl, salesStatusApiUrl, unsavedChanges]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMarketingData({ ...marketingData, [name]: value });
    console.log(marketingData)
    setUnsavedChanges(true);
  };

  const handleSave = async () => {

    try {
      await axios.put(`/api/marketing?id=${id}`, marketingData);
      setUnsavedChanges(false);
      toast.success("Marketing data saved successfully!");
      console.log(marketingData)
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
                  <td>Training Location</td>
                  <td>
                    {editing ? (
                      <Form.Control
                        as="select"
                        name="trainingLocation"
                        value={marketingData.trainingLocation}
                        onChange={handleChange}
                      >
                        <option value="">Select Training Location</option>
                        {trainingLocations.map((status) => (
                          <option key={status._id} value={status.name}>
                            {status.name}
                          </option>
                        ))}
                      </Form.Control>
                    ) : (
                      marketingData.trainingLocation
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
                  <td>Sales Rejection Reason</td>
                  <td>
                    {editing ? (
                      <Form.Control
                        as="select"
                        name="salesRejectionReason"
                        value={marketingData.salesRejectionReason}
                        onChange={handleChange}
                      >
                        <option value="">Select Sales Rejection Reason</option>
                        {salesRejectionReason.map((status) => (
                          <option key={status._id} value={status.reason}>
                            {status.reason}
                          </option>
                        ))}
                      </Form.Control>
                    ) : (
                      marketingData.salesRejectionReason
                    )}
                  </td>
                </tr>
                <tr>
                  <td>Payment Method</td>
                  <td>
                    {editing ? (
                      <Form.Control
                        as="select"
                        name="paymentMethod"
                        value={marketingData.paymentMethod}
                        onChange={handleChange}
                      >
                        <option value="">Select Payment Method</option>
                        {paymentMethods.map((status) => (
                          <option key={status._id} value={status.type}>
                            {status.type}
                          </option>
                        ))}
                      </Form.Control>
                    ) : (
                      marketingData.paymentMethod
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
