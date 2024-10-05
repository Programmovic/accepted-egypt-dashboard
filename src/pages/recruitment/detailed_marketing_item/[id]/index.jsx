import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Table, Form, Button } from "react-bootstrap";
import { AdminLayout } from "@layout";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PendingPaymentsTable from "../../../../components/PendingPayments";

const MarketingDataDetail = () => {
  const [marketingData, setMarketingData] = useState({
    name: "",
    phoneNo1: "",
    phoneNo2: "",
    nationalId: "",
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
    interestedInCourse: "TBD", // Default value
    paymentMethod: "",
    trainingLocation: "",
    recieverNumber: "",
    referenceNumber: "",
    paymentScreenshotStatus: "",
    paymentScreenshotDate: "",
    placementTest: "",
    salesRejectionReason: "",
    salesMemberAssignationDate: null,
    placementTestPaidAmount: 0,
    placementTestDiscount: 0,
    placementTestAmountAfterDiscount: 0,
    assignedLevel: "",
    assignedBatch: "",
    levelPaidAmount: 0,
    levelDiscount: 0, // Added field
    isLevelFullPayment: false,
    levelPaidRemainingAmount: 0,
    verificationStatus: "Pending", // Default value
    candidateStatusForRecruiter: "",
    phoneInterviewStatus: "",
    phoneInterviewDate: "",
    faceToFaceStatus: "",
    faceToFaceDate: "",
    feedbackSessionStatus: "",
    feedbackSessionDate: "",
    testResultStatus: "",
    testResultDate: "",
    onBoardingName: "",
    recruiterName: "",
    placerName: "",
    updatedBy: ""
  });


  const [salesStatuses, setSalesStatuses] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [candidateSignUpFor, setCandidateSignUpFor] = useState([]);
  const [candidateStatusForRecruiter, setCandidateStatusForRecruiter] = useState([]);
  const [phoneInterviewStatus, setPhoneInterviewStatus] = useState([]);
  const [faceToFaceStatus, setFaceToFaceStatus] = useState([]);
  const [feedbackSessionStatus, setFeedbackSessionStatus] = useState([]);
  const [recruitmentTestResultStatus, setRecruitmentTestResultStatus] = useState([]);

  const [trainingLocations, setTrainingLocations] = useState([]);
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const router = useRouter();
  const { id } = router.query;
  const apiUrl = `/api/marketing?id=${id}`; // Define the API route to fetch marketing data by ID
  const salesStatusApiUrl = `/api/sales-status`; // Define the API route to fetch sales statuses
  const editing = true;

  useEffect(() => {
    const toastId = toast.loading("Loading data...");

    const fetchMarketingData = async () => {
      try {
        const response = await axios.get(apiUrl);
        if (response.status === 200) {
          setMarketingData((prevData) => ({
            ...prevData,
            ...response.data,
          }));
          console.log(response.data)
        }
      } catch (error) {
        console.error("Error fetching marketing data:", error);
      }
    };

    const fetchCandidateStatusForRecruiter = async () => {
      try {
        const response = await axios.get('/api/candidate-status-for-recruiter');
        if (response.status === 200) {
          setCandidateStatusForRecruiter(response.data);
        }
      } catch (error) {
        console.error("Error fetching candidate status for recruiter:", error);
      }
    };

    const fetchPhoneInterviewStatus = async () => {
      try {
        const response = await axios.get('/api/phone-interview-status');
        if (response.status === 200) {
          setPhoneInterviewStatus(response.data);
        }
      } catch (error) {
        console.error("Error fetching phone interview status:", error);
      }
    };

    const fetchFaceToFaceStatus = async () => {
      try {
        const response = await axios.get('/api/face-to-face-status');
        if (response.status === 200) {
          setFaceToFaceStatus(response.data);
        }
      } catch (error) {
        console.error("Error fetching face-to-face status:", error);
      }
    };

    const fetchFeedbackSessionStatus = async () => {
      try {
        const response = await axios.get('/api/feedback-session-status');
        if (response.status === 200) {
          setFeedbackSessionStatus(response.data);
        }
      } catch (error) {
        console.error("Error fetching feedback session status:", error);
      }
    };

    const fetchRecruitmentTestResultStatus = async () => {
      try {
        const response = await axios.get('/api/recruitment-test-result-status');
        if (response.status === 200) {
          setRecruitmentTestResultStatus(response.data);
        }
      } catch (error) {
        console.error("Error fetching recruitment test result status:", error);
      }
    };

    const fetchData = async () => {
      try {
        await Promise.all([
          fetchMarketingData(),
          fetchCandidateStatusForRecruiter(),
          fetchPhoneInterviewStatus(),
          fetchFaceToFaceStatus(),
          fetchFeedbackSessionStatus(),
          fetchRecruitmentTestResultStatus(),

        ]);

        // Update toast with success message
        toast.update(toastId, {
          render: "Data loaded successfully!",
          type: "success",
          isLoading: false,
          autoClose: 3000,
        });
      } catch (error) {
        // Update toast with error message
        toast.update(toastId, {
          render: "Error loading data.",
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });
      }
    };

    if (id) {
      fetchData();
    }

    // Clear the toast if the component unmounts
    return () => toast.dismiss(toastId);

  }, [id, apiUrl, salesStatusApiUrl]);
  console.log(paymentMethods)
  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;

    if (type === "checkbox") {
      setMarketingData({
        ...marketingData,
        [name]: checked ? "true" : "false",
      });
    } else if (type === "range") {
      const discountValue = parseFloat(value);
      setMarketingData({
        ...marketingData,
        [name]: discountValue,
        amountAfterDiscount: marketingData.paidAmount * (1 - discountValue / 100),
      });
    } else {
      setMarketingData({
        ...marketingData,
        [name]: value,
      });
    }
    console.log(marketingData);
    setUnsavedChanges(true);
  };


  const handleSave = async () => {
    // Show loading toast
    const toastId = toast.loading("Saving marketing data...");
    console.log(marketingData)
    try {
      await axios.put(`/api/marketing?id=${id}`, marketingData);
      setUnsavedChanges(false);

      // Update toast with success message
      toast.update(toastId, {
        render: "Marketing data saved successfully!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });

      console.log(marketingData);
    } catch (error) {
      console.error("Error saving marketing data:", error.message);

      // Update toast with error message
      toast.update(toastId, {
        render: `Error: ${error.message}`,
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  const [placementTests, setPlacementTests] = useState([]);
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
    }
  };

  useEffect(() => {
    fetchPlacementTests();
  }, []);
  return (
    <AdminLayout>
      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <span>Marketing Data Details</span>{" "}
          <span>
            Last Updated: {new Date(marketingData?.updatedAt).toLocaleString()}
          </span>
          <div>
            <Button variant="outline-primary" onClick={() => router.push(`/sales/sales_member/detailed_marketing_item/${id}/logs`)}>
              Logs
            </Button>
            <Button variant="outline-primary" className="ms-2" onClick={handleSave} disabled={!unsavedChanges}>
              Save
            </Button>

          </div>
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
                  <td>Candidate Status For Recruiter</td>
                  <td>
                    {editing ? (
                      <Form.Control
                        as="select"
                        name="candidateStatusForRecruiter"
                        value={marketingData.candidateStatusForRecruiter}
                        onChange={handleChange}
                      >
                        <option value="">Select Candidate Status For Recruiter</option>
                        {candidateStatusForRecruiter.map((status) => (
                          <option key={status._id} value={status.status}>
                            {status.status}
                          </option>
                        ))}
                      </Form.Control>
                    ) : (
                      marketingData.candidateStatusForRecruiter
                    )}
                  </td>
                </tr>

                <tr>
                  <td>Phone Interview Status</td>
                  <td>
                    {editing ? (
                      <Form.Control
                        as="select"
                        name="phoneInterviewStatus"
                        value={marketingData.phoneInterviewStatus}
                        onChange={handleChange}
                      >
                        <option value="">Select Phone Interview Status</option>
                        {phoneInterviewStatus.map((status) => (
                          <option key={status._id} value={status.status}>
                            {status.status}
                          </option>
                        ))}
                      </Form.Control>
                    ) : (
                      marketingData.phoneInterviewStatus
                    )}
                    <Form.Group className="my-3">
                      <Form.Label>Date:</Form.Label>
                      <Form.Control
                        name="phoneInterviewDate"
                        type="date"
                        value={marketingData.phoneInterviewDate}
                        onChange={handleChange}
                      />
                    </Form.Group>
                    <Form.Group className="my-3">
                      <Form.Label>Note:</Form.Label>
                      <Form.Control
                        name="phoneInterviewComment"
                        as="textarea"
                        value={marketingData.phoneInterviewComment}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </td>
                </tr>

                <tr>
                  <td>Face To Face Status</td>
                  <td>
                    {editing ? (
                      <Form.Control
                        as="select"
                        name="faceToFaceStatus"
                        value={marketingData.faceToFaceStatus}
                        onChange={handleChange}
                      >
                        <option value="">Select Face To Face Status</option>
                        {faceToFaceStatus.map((status) => (
                          <option key={status._id} value={status.status}>
                            {status.status}
                          </option>
                        ))}
                      </Form.Control>
                    ) : (
                      marketingData.faceToFaceStatus
                    )}
                    <Form.Group className="my-3">
                      <Form.Label>Date:</Form.Label>
                      <Form.Control
                        name="faceToFaceDate"
                        type="date"
                        value={marketingData.faceToFaceDate}
                        onChange={handleChange}
                      />
                    </Form.Group>
                    <Form.Group className="my-3">
                      <Form.Label>Note:</Form.Label>
                      <Form.Control
                        name="phoneInterviewComment"
                        as="textarea"
                        value={marketingData.phoneInterviewComment}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </td>
                </tr>

                <tr>
                  <td>Feedback Session Status</td>
                  <td>
                    {editing ? (
                      <Form.Control
                        as="select"
                        name="feedbackSessionStatus"
                        value={marketingData.feedbackSessionStatus}
                        onChange={handleChange}
                      >
                        <option value="">Select Feedback Session Status</option>
                        {feedbackSessionStatus.map((status) => (
                          <option key={status._id} value={status.status}>
                            {status.status}
                          </option>
                        ))}
                      </Form.Control>
                    ) : (
                      marketingData.feedbackSessionStatus
                    )}
                    <Form.Group className="my-3">
                      <Form.Label>Date:</Form.Label>
                      <Form.Control
                        name="feedbackSessionDate"
                        type="date"
                        value={marketingData.feedbackSessionDate}
                        onChange={handleChange}
                      />
                    </Form.Group>
                    <Form.Group className="my-3">
                      <Form.Label>Note:</Form.Label>
                      <Form.Control
                        name="feedbackSessionComment"
                        as="textarea"
                        value={marketingData.feedbackSessionComment}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </td>
                </tr>

                <tr>
                  <td>Recruitment Test Result Status</td>
                  <td>
                    {editing ? (
                      <Form.Control
                        as="select"
                        name="companyInterviewStatus"
                        value={marketingData.companyInterviewStatus}
                        onChange={handleChange}
                      >
                        <option value="">Select Recruitment Test Result Status</option>
                        {recruitmentTestResultStatus.map((status) => (
                          <option key={status._id} value={status.status}>
                            {status.status}
                          </option>
                        ))}
                      </Form.Control>
                    ) : (
                      marketingData.recruitmentTestResultStatus
                    )}
                    <Form.Group className="my-3">
                      <Form.Label>Date:</Form.Label>
                      <Form.Control
                        name="companyInterviewDate"
                        type="date"
                        value={marketingData.companyInterviewDate}
                        onChange={handleChange}
                      />
                    </Form.Group>
                    <Form.Group className="my-3">
                      <Form.Label>Note:</Form.Label>
                      <Form.Control
                        name="companyInterviewComment"
                        as="textarea"
                        value={marketingData.companyInterviewComment}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </td>
                </tr>

                <tr>
                  <td>Assigned Level</td>
                  <td>
                    {editing ? (
                      <Form.Control
                        type="text"
                        value={marketingData.assignedLevel.name || "Still Not Assigned"}
                        disabled={true} // Disable the input if the assignedTo field is empty
                      />
                    ) : (
                      marketingData.assignedLevel
                    )}
                  </td>
                </tr>

                <tr>
                  <td>
                    Select Batch
                  </td>
                  <td>
                    <Form.Control
                      as="select"
                      name="assignedBatch"
                      value={marketingData.assignedBatch}
                      onChange={handleChange}
                    >
                      <option value="">Select a batch</option>
                      {marketingData?.assignedLevel?.batches?.map((batch) => (
                        <option key={batch._id} value={batch._id}>
                          {batch.name} - {batch.status} - Code: {batch.code} - Cost: {batch.cost} EGP - Starts at {new Date(batch.shouldStartAt).toLocaleDateString()} - Ends at {new Date(batch.shouldEndAt).toLocaleDateString()} - {batch.limitTrainees} Trainees Limit
                        </option>
                      ))}
                    </Form.Control>
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
