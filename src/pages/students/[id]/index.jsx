import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  Table,
  Form,
  Modal,
  Accordion,
  Button,
  Row,
  Container,
  Col,
} from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AdminLayout } from "@layout";
import { ClassCard } from "@components/Classes";
import { useRouter } from "next/router";
import IdentityCard from "../../../components/StudentIDCard";
import StudentHistoryDisplay from "../../../components/StudentHistory";
import StudentFinance from "../../../components/StudentFinance";
import StudentNotifications from "../../../components/StudentNotifications";

const StudentProfile = () => {
  const [studentData, setStudentData] = useState({});
  const [batchData, setBatchData] = useState({});
  const [loading, setLoading] = useState(true);
  const [lectures, setLectures] = useState([]);
  const [attendances, setAttendances] = useState([]);
  const router = useRouter();
  const { id } = router.query;
  const [name, setName] = useState(studentData.name);
  const [phoneNumber, setPhoneNumber] = useState(studentData.phoneNumber);
  const [email, setEmail] = useState(studentData.email);
  const [nationalId, setNationalId] = useState(studentData.nationalId);
  const [status, setStatus] = useState(studentData.status);

  // Add state variables for other fields as needed
  const handleSave = async () => {
    try {
      const newStudentData = {
        name: name,
        phoneNumber: phoneNumber,
        email: email,
        nationalId: nationalId,
        status: status,
        // Include other fields in the request body as needed
      };
      const response = await axios.put(`/api/student/${id}`, newStudentData);
      console.log(newStudentData);
      if (response.status === 200) {
        toast.success("Student information updated successfully.", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error("Error updating student data:", error);
      toast.error(
        "Failed to update student information. Please try again later.",
        {
          position: "top-right",
          autoClose: 3000,
        }
      );
    }
  };
  const [marketingData, setMarketingData] = useState({
    assignedLevel: {
      details: {
        price: 0, // Default price of the level
      },
    },
    levelDiscount: 0, // Default discount percentage
    levelPaidAmount: 0, // Paid amount
    levelAmountAfterDiscount: 0, // Amount after discount is applied
    levelPaidRemainingAmount: 0, // Remaining amount to be paid
    isLevelFullPayment: false, // Boolean to check if the payment is full
  });
  const fetchStudentData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/student/${id}`); // Replace with your actual API endpoint
console.log(response.data.student)
      if (response.status === 200) {
        console.log(response);
        setMarketingData((prevData) => ({
          ...prevData,
          assignedLevel: {
            details: {
              price: response?.data?.level?.price, // Default price of the level
            },
          },
        }));
        setStudentData(response.data.student);
      }
    } catch (error) {
      console.error("Error updating finance or fetching student data:", error);
      toast.error("Failed to update finance or fetch student data. Please try again later.", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };
  const fetchBatchData = async () => {
    try {
      const response = await axios.get(`/api/batch/${studentData.batch}/batch`); // Replace with your actual API endpoint for batch data

      if (response.status === 200) {
        console.log(response);
        setBatchData(response.data); // Adjust the response data structure accordingly
      }
    } catch (error) {
      console.error("Error fetching batch data:", error);
      toast.error("Failed to fetch batch data. Please try again later.", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };
  const [batches, setBatches] = useState([]);
  const fetchBatchesData = async () => {
    try {
      const response = await axios.get(`/api/batch`); // Replace with your actual API endpoint for batch data

      if (response.status === 200) {
        console.log(response);
        setBatches(response.data); // Adjust the response data structure accordingly
      }
    } catch (error) {
      console.error("Error fetching batch data:", error);
      toast.error("Failed to fetch batch data. Please try again later.", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };
  const fetchLecturesForBatch = async () => {
    try {
      const response = await axios.get(`/api/batch/${studentData.batch}`); // Replace with your actual API endpoint for batch lectures

      if (response.status === 200) {
        setLectures(response.data);
      }
    } catch (error) {
      console.error("Error fetching batch lectures:", error);
      toast.error("Failed to fetch batch lectures. Please try again later.", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };
  const fetchAttendancesForStudent = async () => {
    try {
      const response = await axios.get(
        `/api/attendance/student-attendances?studentId=${studentData._id}`
      ); // Replace with your actual API endpoint for batch lectures

      if (response.status === 200) {
        console.log(response);
        setAttendances(response.data);
      }
    } catch (error) {
      console.error("Error fetching batch lectures:", error);
      toast.error("Failed to fetch batch lectures. Please try again later.", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };
  useEffect(() => {
    if (id) {
      fetchStudentData();
      {
        studentData.batch && fetchBatchData();
      }
      {
        studentData.batch && fetchLecturesForBatch();
      }
      {
        studentData._id && fetchAttendancesForStudent();
      }
      fetchPlacementTests();
      fetchBatchesData();
    }
  }, [id, studentData.batch, studentData._id, studentData.placementTestDate]);
  function calculateTimeDuration(startTime, endTime) {
    // Split the time strings into hours and minutes
    const [startHour, startMinute] = startTime.split(":");
    const [endHour, endMinute] = endTime.split(":");

    // Convert hours and minutes to numbers
    const startHourNum = parseInt(startHour, 10);
    const startMinuteNum = parseInt(startMinute, 10);
    const endHourNum = parseInt(endHour, 10);
    const endMinuteNum = parseInt(endMinute, 10);

    // Calculate the duration in minutes
    const totalMinutesStart = startHourNum * 60 + startMinuteNum;
    const totalMinutesEnd = endHourNum * 60 + endMinuteNum;
    const duration = totalMinutesEnd - totalMinutesStart;

    return duration;
  }
  const [placementTests, setPlacementTests] = useState([]);

  const [showPlacementTestModal, setShowPlacementTestModal] = useState(false);
  const [selectedPlacementTest, setSelectedPlacementTest] = useState(null);
  const openPlacementTestModal = (student) => {
    setSelectedPlacementTest(null); // Clear the selected placement test
    setShowPlacementTestModal(true);
  };
  const handlePlacementTestSelect = (event) => {
    const testId = event.target.value;
    setSelectedPlacementTest(testId);
  };
  const fetchPlacementTests = async () => {
    try {
      const response = await axios.get("/api/placement_test_settings");
      if (response.status === 200) {
        setPlacementTests(response.data);
      }
    } catch (error) {
      console.error("Error fetching placement tests:", error);
      toast.error("Failed to fetch placement tests. Please try again later.", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const [showBatchModal, setShowBatchModal] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState(studentData.batch);

  // Function to open the batch update modal
  const openBatchModal = () => {
    setShowBatchModal(true);
  };

  // Function to handle the batch update
  const handleBatchUpdate = async () => {
    try {
      // Send a request to update the student's batch with selectedBatch
      console.log(selectedBatch)
      const response = await axios.put(`/api/student/${id}`, {
        batch: selectedBatch || null,
      });

      if (response.status === 200) {
        toast.success("Student's batch updated successfully.", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error("Error updating student's batch:", error);
      toast.error("Failed to update student's batch. Please try again later.", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      // Close the modal and refresh data
      setShowBatchModal(false);
      fetchStudentData(); // You should implement fetchStudentData to update the student's batch data
    }
  };
  const [showIdentityModal, setShowIdentityModal] = useState(false);

  // Function to open the identity card modal
  const openIdentityModal = () => {
    setShowIdentityModal(true);
  };

  // Function to close the identity card modal
  const closeIdentityModal = () => {
    setShowIdentityModal(false);
  };

  const [transactions, setTransactions] = useState([]);

  // Function to fetch transactions related to the student
  const fetchTransactions = async () => {
    try {
      const response = await axios.get(`/api/student/${id}/transactions`); // Adjust the API endpoint as per your backend implementation
      console.log(response);
      if (response.status === 200) {
        setTransactions(response.data);
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
      toast.error("Failed to fetch transactions. Please try again later.", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  // Fetch transactions when the component mounts or when student ID changes
  useEffect(() => {
    if (id) {
      fetchTransactions();
    }
  }, [id]);
  const [showFinancialModal, setShowFinancialModal] = useState(false);

  const [unsavedChanges, setUnsavedChanges] = useState(false);

  // Function to open the modal
  const handleOpenFinancialModal = () => setShowFinancialModal(true);

  // Function to close the modal
  const handleCloseFinancialModal = () => setShowFinancialModal(false);

  // Function to handle form changes (if needed)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setMarketingData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <AdminLayout>
      <StudentNotifications studentId={id} />

      <div className="row">
        <ClassCard
          data={lectures.length}
          title="Total Lectures"
          enableOptions={false}
          isLoading={loading}
        />
        <ClassCard
          data={`${attendances.filter((attendance) => attendance.status === "Attended")
            .length
            } (${(
              (attendances.filter(
                (attendance) => attendance.status === "Attended"
              ).length /
                attendances.length) *
              100
            ).toFixed(2)}%)`}
          title="Total Attendend Lectures"
          enableOptions={false}
          isLoading={loading}
        />
        <ClassCard
          data={`${attendances.filter((attendance) => attendance.status === "Absent")
            .length
            } (${(
              (attendances.filter((attendance) => attendance.status === "Absent")
                .length /
                attendances.length) *
              100
            ).toFixed(2)}%)`}
          title="Total Absent Lectures"
          enableOptions={false}
          isLoading={loading}
        />
        <ClassCard
          data={`${attendances.filter((attendance) => attendance.status === "Execused")
            .length
            } (${(
              (attendances.filter(
                (attendance) => attendance.status === "Execused"
              ).length /
                attendances.length) *
              100
            ).toFixed(2)}%)`}
          title="Total Execused Lectures"
          enableOptions={false}
          isLoading={loading}
        />
        <ClassCard
          data={`${attendances.filter((attendance) => attendance.status === "Late")
            .length
            } (${(
              (attendances.filter((attendance) => attendance.status === "Late")
                .length /
                attendances.length) *
              100
            ).toFixed(2)}%)`}
          title="Total Late Lectures"
          enableOptions={false}
          isLoading={loading}
        />
        <ClassCard
          data={`${attendances.filter(
            (attendance) => attendance.status === "Not Assigned"
          ).length
            } (${(
              (attendances.filter(
                (attendance) => attendance.status === "Not Assigned"
              ).length /
                attendances.length) *
              100
            ).toFixed(2)}%)`}
          title="Not Assigned Lectures"
          enableOptions={false}
          isLoading={loading}
        />
      </div>
      <IdentityCard
        studentData={studentData}
        showIdentityModal={showIdentityModal}
        setShowIdentityModal={setShowIdentityModal}
      />
      <StudentFinance paid={studentData.paid} due={studentData.due} balance={studentData.balance} />

      <div>
        <Row className="mb-3">
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>ID</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{studentData._id}</td>
              </tr>
            </tbody>
          </Table>
        </Row>
        <StudentHistoryDisplay id={id} />
      </div>
      <Row>
        <Col xs={4}>
          <Form.Group className="my-3" controlId="name">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="First name"
              defaultValue={studentData.name}
              onChange={(e) => setName(e.target.value)}
            />
          </Form.Group>
        </Col>
        <Col xs={4}>
          <Form.Group className="my-3" controlId="phoneNumber">
            <Form.Label>Mobile Number</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter phone number"
              defaultValue={studentData.phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </Form.Group>
        </Col>
        <Col xs={4}>
          <Form.Group className="my-3" controlId="email">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter email id"
              defaultValue={studentData.email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>
        </Col>
        <Col xs={4}>
          <Form.Group className="my-3" controlId="nationalId">
            <Form.Label>National Id</Form.Label>
            <Form.Control
              type="text"
              placeholder="National Id"
              defaultValue={studentData.nationalId}
              onChange={(e) => setNationalId(e.target.value)}
            />
          </Form.Group>
        </Col>
        <Col xs={4}>
          <Form.Group className="my-3" controlId="status">
            <Form.Label>Status</Form.Label>
            <Form.Control
              type="text"
              placeholder="Status"
              defaultValue={studentData.status}
              disabled
            />
          </Form.Group>
        </Col>
        <Col xs={4}>
          <Form.Group className="my-3" controlId="paid">
            <Form.Label>Paid (EGP)</Form.Label>
            <Form.Control
              type="text"
              defaultValue={studentData.paid}
              disabled
            />
          </Form.Group>
        </Col>
        <Col xs={4}>
          <Form.Group className="my-3" controlId="due">
            <Form.Label>Due (EGP)</Form.Label>
            <Form.Control
              type="text"
              defaultValue={studentData.due}
              disabled
            />
          </Form.Group>
        </Col>
        <Col xs={4}>
          <Form.Group className="my-3" controlId="level">
            <Form.Label>Level</Form.Label>
            <Form.Control
              type="text"
              defaultValue={studentData.level}
              disabled
            />
          </Form.Group>
        </Col>
        <Col xs={4}>
          <Form.Group className="my-3" controlId="placementTest">
            <Form.Label>Placement Test</Form.Label>
            <Form.Control
              type="text"
              value={new Date(studentData?.placementTestDate).toLocaleString(
                undefined,
                { year: "numeric", day: "numeric", month: "long" }
              )}
              disabled
            />
          </Form.Group>
        </Col>
      </Row>
      <div className="mt-3 justify-content-between d-flex">
        <Button variant="primary" type="button" onClick={handleSave}>
          Update
        </Button>
        <Button variant="primary" onClick={handleOpenFinancialModal}>
          Complete renew fees
        </Button>
        <Button variant="primary" type="button" onClick={openBatchModal}>
          Update Batch
        </Button>
        
        <Button
          variant="outline-primary"
          type="button"
          className="fw-bold"
          onClick={openIdentityModal}
        >
          View Card
        </Button>
        {/* Button to open the batch update modal */}
      </div>
      <Modal show={showBatchModal} onHide={() => setShowBatchModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Update Student's Batch</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="my-3" controlId="batchSelect">
            <Form.Label>Select Batch</Form.Label>
            <Form.Control
              as="select"
              value={selectedBatch}
              onChange={(e) => setSelectedBatch(e.target.value)}
            >
              <option value="">Select a batch</option>
              {batches.map((batch) => (
                <option key={batch.id} value={batch._id}>
                  {batch.name}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowBatchModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleBatchUpdate}>
            Update
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={showFinancialModal} onHide={() => setShowFinancialModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Update Student's Level</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Level Discount (%) */}
          <Form.Group className="my-3" controlId="levelDiscount">
            <Form.Label>Level Discount (%)</Form.Label>
            <div className="d-flex justify-content-between">
              <Form.Range
                name="levelDiscount"
                value={marketingData.levelDiscount}
                onChange={(e) => {
                  const discount = parseFloat(e.target.value); // Get the discount value from the slider
                  console.log(marketingData)
                  const assignedLevelCost = marketingData?.assignedLevel.details.price; // Total cost of the assigned level

                  // Calculate the amount after discount
                  const amountAfterDiscount = (100 - discount) / 100 * assignedLevelCost;

                  // Update the paid amount and the remaining amount
                  const paidAmount = marketingData.levelPaidAmount > amountAfterDiscount
                    ? amountAfterDiscount
                    : marketingData.levelPaidAmount;
                  const remainingAmount = amountAfterDiscount - paidAmount;

                  setMarketingData((prevData) => ({
                    ...prevData,
                    levelDiscount: discount,
                    levelAmountAfterDiscount: amountAfterDiscount, // Update amount after discount
                    levelPaidAmount: paidAmount, // Adjust paid amount if discount applied
                    levelPaidRemainingAmount: remainingAmount, // Update remaining amount
                    isLevelFullPayment: paidAmount >= amountAfterDiscount, // Check if fully paid
                  }));
                  setUnsavedChanges(true);
                }}
                min={0}
                max={100}
              />
              <span className="ms-3">{marketingData.levelDiscount}%</span>
            </div>
          </Form.Group>

          {/* Level Paid Amount */}
          <Form.Group className="my-3" controlId="levelPaidAmount">
            <Form.Label>Level Paid Amount</Form.Label>
            <Form.Control
              type="number"
              name="levelPaidAmount"
              value={marketingData.levelPaidAmount}
              onChange={(e) => {
                const value = parseFloat(e.target.value); // Convert to number
                const assignedLevelCost = marketingData?.assignedLevel.details.price; // Total cost of the assigned level
                const amountAfterDiscount = marketingData.levelAmountAfterDiscount;

                if (value > amountAfterDiscount) {
                  alert(`Paid amount cannot exceed ${amountAfterDiscount}`);
                } else {
                  const remainingAmount = amountAfterDiscount - value;
                  const discountPercentage = 100 - (value / assignedLevelCost) * 100;

                  setMarketingData((prevData) => ({
                    ...prevData,
                    levelPaidAmount: value,
                    levelPaidRemainingAmount: remainingAmount, // Update remaining amount
                    levelDiscount: discountPercentage, // Automatically adjust discount
                    isLevelFullPayment: value >= amountAfterDiscount, // Set full payment status
                  }));
                  setUnsavedChanges(true);
                }
              }}
            />
          </Form.Group>

          {/* Level Amount After Discount */}
          <Form.Group className="my-3" controlId="levelAmountAfterDiscount">
            <Form.Label>Level Amount After Discount</Form.Label>
            <Form.Control
              type="number"
              name="levelAmountAfterDiscount"
              value={marketingData.levelAmountAfterDiscount}
              disabled
            />
          </Form.Group>

          {/* Level Paid Remaining Amount */}
          <Form.Group className="my-3" controlId="levelPaidRemainingAmount">
            <Form.Label>Level Paid Remaining Amount</Form.Label>
            <Form.Control
              type="number"
              name="levelPaidRemainingAmount"
              value={marketingData.levelPaidRemainingAmount}
              disabled
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowFinancialModal(false)}>
            Close
          </Button>
          <Button variant="primary">
            Update
          </Button>
        </Modal.Footer>
      </Modal>

      <Card className="mt-5">
        <Card.Header>Lectures for {batchData?.name}</Card.Header>
        <Card.Body>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Lecture Name</th>
                <th>Date</th>
                <th>Time</th>
                <th>Duration</th>
                <th>Attendance Status</th>
              </tr>
            </thead>
            <tbody>
              {lectures.map((lecture) => {
                // Find the attendance record for this lecture
                const attendanceRecord = attendances.find(
                  (attendance) => attendance.lecture === lecture._id
                );
                const status = attendanceRecord
                  ? attendanceRecord.status
                  : "Not Assigned";

                return (
                  <tr key={lecture._id}>
                    <td>{lecture.name}</td>
                    <td>{new Date(lecture.date).toLocaleDateString()}</td>
                    <td>{`${lecture.weeklyHours.day}: ${lecture.weeklyHours.from} to ${lecture.weeklyHours.to}`}</td>
                    <td>
                      {calculateTimeDuration(
                        lecture.weeklyHours.from,
                        lecture.weeklyHours.to
                      )}{" "}
                      Minutes
                    </td>
                    <td>{status}</td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
      <Card className="mt-5">
        <Card.Header>Transactions</Card.Header>
        <Card.Body>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Transaction ID</th>
                <th>Date</th>
                <th>Batch</th>
                <th>Type</th>
                {transactions.some(transaction => transaction.type === "expenses") && (
                  <th>Expense Type</th>
                )}
                <th>Amount</th>
                <th>Description</th>
                {/* Add more columns as needed */}
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction._id}>
                  <td>{transaction._id}</td>
                  <td>{new Date(transaction.createdAt).toLocaleString()}</td>
                  <td>{transaction?.batch?.name || (<span className="text-danger fw-bold">No Batch</span>)}</td>
                  <td>{transaction.type}</td>
                  {transaction.type === "expenses" && (
                    <td>{transaction.expense_type}</td>
                  )}
                  <td>{transaction.amount}</td>
                  <td>{transaction.description}</td>
                  {/* Add more cells for additional transaction data */}
                </tr>
              ))}
            </tbody>
          </Table>

        </Card.Body>
      </Card>

      <ToastContainer />
    </AdminLayout>
  );
};

export default StudentProfile;
