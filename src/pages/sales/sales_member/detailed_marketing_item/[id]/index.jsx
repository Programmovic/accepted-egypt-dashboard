import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Table, Form, Button } from "react-bootstrap";
import { AdminLayout } from "@layout";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PendingPaymentsTable from "../../../../../components/PendingPayments";
const calculatePayments = (
  placementTestPaidAmount,
  placementTestDiscount,
  placementTestAmount,
  levelPaidAmount,
  assignedLevel,
  levelPaidRemainingAmount,
  levelPrice,
  levelDiscount
) => {
  // Calculate final amount for placement test
  const placementTestFinalAmount = placementTestAmount - placementTestDiscount;

  // Calculate final amount for the level after discount
  const levelFinalAmount = levelPrice - levelDiscount;

  // Calculate remaining amount for the level
  levelPaidRemainingAmount = levelFinalAmount - levelPaidAmount;
  const isLevelFullPayment = levelPaidRemainingAmount <= 0;

  // Calculate total amount after discounts
  const totalPaidAmount = placementTestPaidAmount + levelPaidAmount;
  const totalDiscount = placementTestDiscount + levelDiscount;
  const amountAfterDiscount = totalPaidAmount - totalDiscount;

  // Determine the total required amount
  const totalRequiredAmount = placementTestFinalAmount + levelFinalAmount;

  // Calculate remaining amount
  const remainingAmount = totalRequiredAmount - amountAfterDiscount;
  const isFullPayment = remainingAmount <= 0;

  return {
    placementTestFinalAmount,
    levelFinalAmount,
    levelPaidRemainingAmount,
    isLevelFullPayment,
    amountAfterDiscount,
    remainingAmount,
    isFullPayment,
  };
};

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
  const [candidateStatusForSalesPerson, setCandidateStatusForSalesPerson] = useState([]);
  const [salesRejectionReason, setSalesRejectionReason] = useState([]);
  const [trainingLocations, setTrainingLocations] = useState([]);
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const router = useRouter();
  const { id } = router.query;
  const apiUrl = `/api/marketing?id=${id}`; // Define the API route to fetch marketing data by ID
  const salesStatusApiUrl = `/api/sales-status`; // Define the API route to fetch sales statuses
  const editing = true;
  const [calculationResult, setCalculationResult] = useState({});


  useEffect(() => {
    const result = calculatePayments(
      marketingData.placementTestPaidAmount,
      marketingData.placementTestDiscount,
      marketingData.placementTestAmountAfterDiscount,
      marketingData.levelPrice,
      marketingData.levelDiscount,
      marketingData.levelPaidAmount
    );
    setCalculationResult(result);
  }, [
    marketingData.placementTestPaidAmount,
    marketingData.placementTestDiscount,
    marketingData.placementTestAmountAfterDiscount,
    marketingData.levelPrice,
    marketingData.levelDiscount,
    marketingData.levelPaidAmount
  ]);

  useEffect(() => {
    const toastId = toast.loading("Loading data...");

    const fetchMarketingData = async () => {
      try {
        const response = await axios.get(apiUrl);
        console.log(response)
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
        console.error("Error fetching payment methods:", error);
      }
    };

    const fetchCandidateSignUpForStatus = async () => {
      try {
        const response = await axios.get('/api/candidate_signup_for');
        if (response.status === 200) {
          setCandidateSignUpFor(response.data);
        }
      } catch (error) {
        console.error("Error fetching candidate sign up statuses:", error);
      }
    };

    const fetchCandidateStatusForSalesPersonStatus = async () => {
      try {
        const response = await axios.get('/api/candidate-status-for-sales-person');
        if (response.status === 200) {
          setCandidateStatusForSalesPerson(response.data);
        }
      } catch (error) {
        console.error("Error fetching candidate status for sales person:", error);
      }
    };

    const fetchSalesRejectionReason = async () => {
      try {
        const response = await axios.get('/api/sales-rejection-reason');
        if (response.status === 200) {
          setSalesRejectionReason(response.data);
        }
      } catch (error) {
        console.error("Error fetching sales rejection reasons:", error);
      }
    };

    const fetchTrainingLocation = async () => {
      try {
        const response = await axios.get('/api/trainingLocation');
        if (response.status === 200) {
          setTrainingLocations(response.data);
        }
      } catch (error) {
        console.error("Error fetching training locations:", error);
      }
    };

    const fetchData = async () => {
      try {
        await Promise.all([
          fetchMarketingData(),
          fetchSalesStatuses(),
          fetchPaymentMethods(),
          fetchCandidateSignUpForStatus(),
          fetchCandidateStatusForSalesPersonStatus(),
          fetchSalesRejectionReason(),
          fetchTrainingLocation(),
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
            {/* Floating Save Button */}
            {unsavedChanges && (
              <Button
                variant="warning"
                className="text-dark floating-save-button"
                onClick={handleSave}
              >
                Save Changes
              </Button>
            )}

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
                  <td>Placement Test</td>
                  <td>
                    {editing ? (
                      <Form.Control
                        as="select"
                        name="placementTest"
                        value={marketingData?.placementTest?._id}
                        onChange={() => {
                          handleChange();
                          setMarketingData((prevData) => ({
                            ...prevData,
                            placementTestDiscount: 0,
                            placementTestPaidAmount: marketingData?.placementTest?.cost, // Update the paid amount
                            placementTestAmountAfterDiscount: marketingData?.placementTest?.cost, // Update the amount after discount
                          }));

                        }}
                      >
                        <option value="">Select Placement Test</option>
                        {placementTests.map((test) => (
                          <option key={test._id} value={test._id}>
                            {test.cost} EGP - {new Date(test.date).toLocaleDateString()} - From {test.startTime} to {test.endTime} - {test.studentCount} of {test.limitTrainees}
                          </option>
                        ))}
                      </Form.Control>
                    ) : (
                      marketingData.placementTest
                    )}
                  </td>
                </tr>

                <tr>
                  <td>Placement Test Discount (%)</td>
                  <td>
                    {editing ? (
                      <div className="d-flex justify-content-between">
                        <Form.Range
                          name="placementTestDiscount"
                          value={marketingData.placementTestDiscount.toFixed(2)}
                          disabled={marketingData.placementTestDiscount}
                          onChange={(e) => {
                            const discount = parseFloat(e.target.value); // Get the discount value from slider

                            // Ensure placementTestCost is a number
                            const placementTestCost = marketingData.placementTest?.cost || 0; // Default to 0 if undefined

                            console.log('Discount:', discount);
                            console.log('Placement Test Cost:', placementTestCost);

                            // Calculate the paid amount based on the discount percentage
                            const paidAmount = ((100 - discount) / 100) * placementTestCost;
                            // Calculate the amount after discount
                            const amountAfterDiscount = placementTestCost - (placementTestCost * discount / 100);

                            console.log('Paid Amount:', paidAmount);
                            console.log('Amount After Discount:', amountAfterDiscount);

                            // Update the discount, paid amount, and the calculated amount after discount
                            setMarketingData((prevData) => ({
                              ...prevData,
                              placementTestDiscount: discount,
                              placementTestPaidAmount: +paidAmount, // Update the paid amount
                              placementTestAmountAfterDiscount: +amountAfterDiscount, // Update the amount after discount
                            }));
                            setUnsavedChanges(true);
                          }}
                          min={0}
                          max={100}
                        />
                        <span className="ms-3">{marketingData.placementTestDiscount}%</span> {/* Display the current discount value */}
                      </div>
                    ) : (
                      `${marketingData.placementTestDiscount}%`
                    )}
                  </td>
                </tr>


                <tr>
                  <td>Placement Test Paid Amount</td>
                  <td>
                    {editing ? (
                      <Form.Control
                        type="number"
                        name="placementTestPaidAmount"
                        value={marketingData.placementTestPaidAmount}
                        disabled={marketingData.placementTestPaidAmount}
                        onChange={(e) => {
                          const value = parseFloat(e.target.value); // Convert to number
                          const placementTestCost = marketingData.placementTest.cost; // Total cost of the placement test
                          let discountPercentage = 0; // Initialize discount

                          if (value > placementTestCost) {
                            alert(`Paid amount cannot exceed ${placementTestCost}`);
                          } else {
                            // Calculate the discount percentage if the paid amount is less than the cost
                            if (value < placementTestCost) {
                              discountPercentage = ((1 - value / placementTestCost) * 100).toFixed();
                              console.log(discountPercentage);

                              // Calculate the amount after discount
                              const amountAfterDiscount = value;

                              // Update the paid amount, discount, and the calculated amount after discount
                              setMarketingData((prevData) => ({
                                ...prevData,
                                placementTestPaidAmount: +value,
                                placementTestDiscount: +discountPercentage.toFixed(2), // Update the discount
                                placementTestAmountAfterDiscount: +amountAfterDiscount, // Update the amount after discount
                              }));
                            } else {
                              // If the full amount is paid, reset the discount to 0
                              setMarketingData((prevData) => ({
                                ...prevData,
                                placementTestPaidAmount: +value,
                                placementTestDiscount: +0, // No discount if fully paid
                                placementTestAmountAfterDiscount: +placementTestCost, // Set amount after discount to full cost
                              }));
                            }
                          }
                          setUnsavedChanges(true);
                        }}
                      />
                    ) : (
                      marketingData.placementTestPaidAmount
                    )}
                  </td>
                </tr>

                <tr>
                  <td>Placement Test Amount After Discount</td>
                  <td>
                    {editing ? (
                      <Form.Control
                        type="number"
                        name="placementTestAmountAfterDiscount"
                        value={marketingData.placementTestAmountAfterDiscount}
                        onChange={handleChange}
                        disabled
                      />
                    ) : (
                      marketingData.placementTestAmountAfterDiscount
                    )}
                  </td>
                </tr>
                <tr>
                  <td>Payment Method</td>
                  <td>
                    {editing ? (
                      <>
                        <Form.Control
                          as="select"
                          name="paymentMethod"
                          value={marketingData.paymentMethod}
                          onChange={handleChange}
                        >
                          <option value="">Select Payment Method</option>
                          {paymentMethods.map((method) => (
                            <option key={method._id} value={method.type}>
                              {method.type}
                            </option>
                          ))}
                        </Form.Control>

                        {marketingData.paymentMethod && (
                          paymentMethods
                            .filter((method) => method.type === marketingData.paymentMethod)
                            .map((method) => (
                              <div key={method._id}>
                                {method.type === "Bank Transfer" && method.configuration.bankAccountNumber.length > 0 && (
                                  <div className="mt-2">
                                    <Form.Control
                                      as="select"
                                      name="recieverNumber"
                                      value={marketingData.recieverNumber || ""}
                                      onChange={handleChange}
                                    >
                                      <option value="">Select Bank Account Number</option>
                                      {method.configuration.bankAccountNumber.map((number, index) => (
                                        <option key={index} value={number}>
                                          {number}
                                        </option>
                                      ))}
                                    </Form.Control>
                                  </div>
                                )}
                                {["Vodafone Cash", "Orange Money", "Etisalat Cash"].includes(method.type) && method.configuration.walletNumber.length > 0 && (
                                  <div className="mt-2">
                                    <Form.Control
                                      as="select"
                                      name="recieverNumber"
                                      value={marketingData.recieverNumber || ""}
                                      onChange={handleChange}
                                    >
                                      <option value="">Select {method.type} Number</option>
                                      {method.configuration.walletNumber.map((number, index) => (
                                        <option key={index} value={number}>
                                          {number}
                                        </option>
                                      ))}
                                    </Form.Control>
                                  </div>
                                )}
                              </div>
                            ))
                        )}
                      </>
                    ) : (
                      marketingData.paymentMethod
                    )}
                  </td>
                </tr>
                <tr>
                  <td>Sent The Screenshot</td>
                  <td>
                    {editing ? (
                      <Form.Check
                        type="switch"
                        id="custom-switch"
                        className="fs-3"
                        name="paymentScreenshotStatus"  // Add the name attribute here
                        checked={marketingData.paymentScreenshotStatus === "true"}
                        onChange={handleChange}
                      />
                    ) : (
                      marketingData.paymentScreenshotStatus
                    )}
                  </td>
                </tr>
                <tr>
                  <td>Assigned Level</td>
                  <td>
                    {editing ? (
                      <Form.Control
                        type="text"
                        value={marketingData?.assignedLevel?.name || "Still Not Assigned"}
                        disabled={true} // Disable the input if the assignedTo field is empty
                      />
                    ) : (
                      marketingData.assignedLevel
                    )}
                  </td>
                </tr>
                <tr>
                  <td>Level Discount (%)</td>
                  <td>
                    {editing ? (
                      <div className="d-flex justify-content-between">
                        <Form.Range
                          name="levelDiscount"
                          value={marketingData.levelDiscount.toFixed(2)}
                          disabled={marketingData.levelDiscount}
                          onChange={(e) => {
                            const discount = parseFloat(e.target.value); // Get the discount value from slider
                            const assignedLevelCost = marketingData?.assignedLevel.details.price; // Total cost of the assigned level

                            // Calculate the paid amount based on the discount percentage
                            const paidAmount = discount > 0 ? ((100 - discount) / 100) * assignedLevelCost : marketingData.levelPaidAmount;

                            // Calculate the amount after discount only if discount is greater than 0
                            const amountAfterDiscount = discount > 0 ? assignedLevelCost - (assignedLevelCost * discount / 100) : assignedLevelCost;

                            // Update the discount, paid amount, and the calculated amount after discount
                            setMarketingData((prevData) => ({
                              ...prevData,
                              levelDiscount: discount,
                              levelPaidAmount: paidAmount, // Update the paid amount
                              levelPaidRemainingAmount: (assignedLevelCost - paidAmount), // Update the remaining amount
                              levelAmountAfterDiscount: amountAfterDiscount, // Update the amount after discount
                              isLevelFullPayment: paidAmount >= assignedLevelCost // Automatically set full payment status
                            }));
                            setUnsavedChanges(true);
                          }}
                          min={0}
                          max={100}
                        />
                        <span className="ms-3">{marketingData.levelDiscount}%</span> {/* Display the current discount value */}
                      </div>
                    ) : (
                      `${marketingData.levelDiscount}%`
                    )}
                  </td>
                </tr>

                <tr>
                  <td>Level Paid Amount</td>
                  <td>
                    {editing ? (
                      <Form.Control
                        type="number"
                        name="levelPaidAmount"
                        value={marketingData.levelPaidAmount}
                        disabled={marketingData.levelPaidAmount}
                        onChange={(e) => {
                          const value = parseFloat(e.target.value); // Convert to number
                          const assignedLevelCost = marketingData?.assignedLevel.details.price;// Total cost of the assigned level
                          console.log(marketingData?.assignedLevel)
                          if (value > assignedLevelCost) {
                            alert(`Paid amount cannot exceed ${assignedLevelCost}`);
                          } else {
                            // Calculate the discount percentage if the paid amount is less than the cost
                            const discountPercentage = value < assignedLevelCost ? ((1 - value / assignedLevelCost) * 100) : 0;
                            const amountAfterDiscount = discountPercentage > 0 ? value : assignedLevelCost;

                            // Update the paid amount, discount, and the calculated amount after discount
                            setMarketingData((prevData) => ({
                              ...prevData,
                              levelPaidAmount: value,
                              levelDiscount: +discountPercentage.toFixed(2), // Update the discount
                              levelPaidRemainingAmount: (assignedLevelCost - value), // Update the remaining amount
                              levelAmountAfterDiscount: amountAfterDiscount, // Update the amount after discount
                              isLevelFullPayment: value >= assignedLevelCost // Automatically set full payment status
                            }));
                            setUnsavedChanges(true);
                          }
                        }}
                      />
                    ) : (
                      marketingData.levelPaidAmount
                    )}
                    {/* Check if levelAmountAfterDiscount has a value and display the warning */}
                    {marketingData.levelAmountAfterDiscount && unsavedChanges ? (
                      <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
                        <div
                          style={{
                            backgroundColor: '#fff3cd',
                            color: '#856404',
                            padding: '10px 15px',
                            borderRadius: '5px',
                            marginRight: '15px',
                            fontSize: '14px',
                            fontWeight: '500',
                            border: '1px solid #ffeeba',
                            display: 'flex',
                            alignItems: 'center',
                          }}
                        >
                          <i className="fas fa-exclamation-triangle" style={{ marginRight: '8px' }}></i>
                          Please Save
                        </div>
                        <Button
                          onClick={handleSave}
                          variant="warning"
                          style={{
                            fontWeight: 'bold',
                            padding: '8px 16px',
                            borderRadius: '5px',
                            fontSize: '14px',
                          }}
                        >
                          Save Changes
                        </Button>
                      </div>
                    ) : null}

                  </td>
                </tr>

                <tr>
                  <td>Level Amount After Discount</td>
                  <td>
                    {editing ? (
                      <>
                        <Form.Control
                          type="number"
                          name="levelAmountAfterDiscount"
                          value={marketingData.levelAmountAfterDiscount}
                          onChange={handleChange}
                          disabled
                        />

                      </>
                    ) : (
                      marketingData.levelAmountAfterDiscount
                    )}
                  </td>
                </tr>


                <tr>
                  <td>Level Paid Remaining Amount</td>
                  <td>
                    {editing ? (
                      <Form.Control
                        type="number"
                        name="levelPaidRemainingAmount"
                        value={marketingData.levelPaidRemainingAmount}
                        onChange={handleChange}
                        disabled
                      />
                    ) : (
                      marketingData.levelPaidRemainingAmount
                    )}
                  </td>
                </tr>


                <tr>
                  <td>Is Level Fully Paid</td>
                  <td>
                    {marketingData.isLevelFullPayment ? 'Yes' : 'No'}
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
                      value={marketingData?.assignedBatch?._id}
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
                  <td>Reference Number</td>
                  <td>
                    {editing ? (
                      <Form.Control
                        type="number"
                        name="referenceNumber"
                        value={marketingData.referenceNumber}
                        onChange={handleChange}
                      />
                    ) : (
                      marketingData.referenceNumber
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
      <Card className="mt-3">
        <Card.Header className="d-flex justify-content-between align-items-center">
          <span>Payments Need Verification</span>{" "}
        </Card.Header>
        <Card.Body>
          <PendingPaymentsTable marketingDataId={id} />
        </Card.Body>
      </Card>
    </AdminLayout>
  );
};

export default MarketingDataDetail;
