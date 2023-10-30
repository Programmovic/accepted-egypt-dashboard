// LectureAttendance.js
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
} from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AdminLayout } from "@layout";
import Select from "react-select";
import { useRouter } from "next/router";
import { ClassCard } from "@components/Classes";

const LectureAttendance = () => {
  const [lectureAttendances, setLectureAttendances] = useState([]);
  const [selectedLecture, setSelectedLecture] = useState(null);
  const [showAttendanceDetailsModal, setShowAttendanceDetailsModal] =
    useState(false);
  const [students, setStudents] = useState([]);
  // Add state variables for the filter values
  const [filterTraineeName, setFilterTraineeName] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterFromDate, setFilterFromDate] = useState("");
  const [filterToDate, setFilterToDate] = useState("");
  const [filteredAttendances, setFilteredAttendances] = useState([]);

  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { id } = router.query;
  // Function to fetch lecture attendance data
  console.log(id);
  const fetchLectureAttendanceData = async () => {
    try {
      const response = await axios.get(`/api/attendance/${id}`);

      if (response.status === 200) {
        setLectureAttendances(response.data);
        setFilteredAttendances(response.data);
      }
    } catch (error) {
      console.error("Error fetching lecture attendance data:", error);
      toast.error(
        "Failed to fetch lecture attendance data. Please try again later.",
        {
          position: "top-right",
          autoClose: 3000,
        }
      );
    } finally {
      setLoading(false);
    }
  };
  const fetchStudents = async () => {
    try {
      const response = await axios.get(`/api/student`);
      if (response.status === 200) {
        setStudents(response.data.students);
      }
    } catch (error) {
      console.error("Error fetching lecture attendance data:", error);
      toast.error(
        "Failed to fetch lecture attendance data. Please try again later.",
        {
          position: "top-right",
          autoClose: 3000,
        }
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchLectureAttendanceData();
      fetchStudents();
    }
  }, [id]);

  // Function to apply filters
  const applyFilters = () => {
    const filteredData = lectureAttendances.filter((attendance) => {
      const isTraineeNameMatch =
        filterTraineeName === "" ||
        attendance.trainee.name
          .toLowerCase()
          .includes(filterTraineeName.toLowerCase());
      const isStatusMatch =
        filterStatus === "" || attendance.status === filterStatus;

      const attendanceDate = new Date(attendance.date);
      const startDate = filterFromDate ? new Date(filterFromDate) : null;
      const endDate = filterToDate ? new Date(filterToDate) : null;

      if (startDate && endDate) {
        return (
          isTraineeNameMatch &&
          isStatusMatch &&
          attendanceDate >= startDate &&
          attendanceDate <= endDate
        );
      } else if (startDate && endDate === null) {
        return (
          isTraineeNameMatch &&
          isStatusMatch &&
          attendanceDate >= startDate &&
          attendanceDate <= new Date()
        );
      } else {
        return isTraineeNameMatch && isStatusMatch;
      }
    });

    setFilteredAttendances(filteredData);
  };

  useEffect(() => {
    applyFilters();
  }, [filterTraineeName, filterStatus, filterFromDate, filterToDate]);

  const openAttendanceDetailsModal = (attendance) => {
    setSelectedLecture(attendance);
    setShowAttendanceDetailsModal(true);
  };
  const [selectedAttendanceStatus, setSelectedAttendanceStatus] = useState(""); // State to store the selected attendance status

  const saveAttendanceStatus = async () => {
    if (selectedLecture) {
      try {
        // Make an API call to update the attendance status
        const response = await axios.put(
          `/api/attendance/${selectedLecture._id}`,
          {
            attendanceId: selectedLecture._id,
            status: selectedAttendanceStatus,
          }
        );

        if (response.status === 200) {
          // Update the attendance status in the UI
          setSelectedLecture({
            ...selectedLecture,
            status: selectedAttendanceStatus,
          });
          toast.success("Attendance status updated successfully!", {
            position: "top-right",
            autoClose: 3000,
          });
          fetchLectureAttendanceData();
          setShowAttendanceDetailsModal(false); // Close the modal
        } else {
          toast.error(
            "Failed to update attendance status. Please try again later.",
            {
              position: "top-right",
              autoClose: 3000,
            }
          );
        }
      } catch (error) {
        console.error("Error updating attendance status:", error);
        toast.error(
          "Failed to update attendance status. Please try again later.",
          {
            position: "top-right",
            autoClose: 3000,
          }
        );
      }
    }
  };

  const getAttendanceByStatus = (status) => {
    return filteredAttendances.filter((test) => test.status === status).length;
  };
  return (
    <AdminLayout>
      <Row>
        <ClassCard
          data={getAttendanceByStatus("Absent")}
          title="Total Absent Students"
          enableOptions={false}
          isLoading={loading}
        />
        <ClassCard
          data={getAttendanceByStatus("Attended")}
          title="Total Attended Students"
          enableOptions={false}
          isLoading={loading}
        />
        <ClassCard
          data={getAttendanceByStatus("Execused")}
          title="Total Execused Students"
          enableOptions={false}
          isLoading={loading}
        />
        <ClassCard
          data={getAttendanceByStatus("Late")}
          title="Total Late Students"
          enableOptions={false}
          isLoading={loading}
        />
        <ClassCard
          data={getAttendanceByStatus("Not Assigned")}
          title="Still Not Assigned Students"
          enableOptions={false}
          isLoading={loading}
        />
      </Row>
      <Card>
        <Card.Header>Lecture Attendances</Card.Header>
        <Card.Body>
          <Accordion defaultActiveKey="0" allowMultiple>
            {/* Filter Form */}
            <Accordion.Item eventKey="0">
              <Accordion.Header as={Card.Header}>
                Filter Options
              </Accordion.Header>
              <Accordion.Body>
                <Form className="mb-3 p-5">
                  <Form.Group className="mb-3">
                    <Form.Label>Filter by Trainee Name</Form.Label>
                    <Form.Control
                      type="text"
                      value={filterTraineeName}
                      onChange={(e) => setFilterTraineeName(e.target.value)}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Filter by Status</Form.Label>
                    <Form.Control
                      as="select"
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                    >
                      <option value="">All</option>
                      <option value="Attended">Attended</option>
                      <option value="Absent">Absent</option>
                      <option value="Late">Late</option>
                      <option value="Excused">Excused</option>
                      <option value="Not Assigned">Not Assigned</option>
                    </Form.Control>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Filter by Date (From)</Form.Label>
                    <Form.Control
                      type="date"
                      value={filterFromDate}
                      onChange={(e) => setFilterFromDate(e.target.value)}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Filter by Date (To)</Form.Label>
                    <Form.Control
                      type="date"
                      value={filterToDate}
                      onChange={(e) => setFilterToDate(e.target.value)}
                    />
                  </Form.Group>
                </Form>
              </Accordion.Body>
            </Accordion.Item>

            {/* Lecture Attendance Table */}
            <Accordion.Item eventKey="1">
              <Accordion.Header as={Card.Header}>
                Lecture Attendances
              </Accordion.Header>
              <Accordion.Body>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Trainee Name</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Remarks</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAttendances.map((attendance) => (
                      <tr key={attendance._id}>
                        <td>
                          {
                            students.find(
                              (student) => student._id === attendance.trainee
                            )?.name
                          }
                        </td>
                        <td>
                          {new Date(attendance.date).toLocaleDateString()}
                        </td>
                        <td>{attendance.status}</td>
                        <td>{attendance.remarks || "-"}</td>
                        <td>
                          <button
                            className="btn btn-info btn-sm"
                            onClick={() =>
                              openAttendanceDetailsModal(attendance)
                            }
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </Card.Body>
      </Card>

      <Modal
        show={showAttendanceDetailsModal}
        onHide={() => setShowAttendanceDetailsModal(false)}
      >
        <Modal.Header>
          <Modal.Title>Attendance Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedLecture && (
            <div>
              <p>Trainee: {selectedLecture.trainee.name}</p>
              <p>Date: {new Date(selectedLecture.date).toLocaleDateString()}</p>
              <p>Status: {selectedLecture.status}</p>
              <p>Remarks: {selectedLecture.remarks || "-"}</p>

              {/* Select list for assigning attendance status */}
              <Form.Group>
                <Form.Label>Assign Attendance Status</Form.Label>
                <Select
                  value={selectedAttendanceStatus}
                  onChange={(selectedOption) =>
                    setSelectedAttendanceStatus(selectedOption.value)
                  }
                  options={[
                    { value: "Attended", label: "Attended" },
                    { value: "Absent", label: "Absent" },
                    { value: "Late", label: "Late" },
                    { value: "Excused", label: "Excused" },
                    { value: "Not Assigned", label: "Not Assigned" },
                  ]}
                />
              </Form.Group>
              <Modal.Footer>
                <Button variant="success" onClick={saveAttendanceStatus}>
                  Save
                </Button>
              </Modal.Footer>
            </div>
          )}
        </Modal.Body>
      </Modal>

      <ToastContainer />
    </AdminLayout>
  );
};

export default LectureAttendance;
