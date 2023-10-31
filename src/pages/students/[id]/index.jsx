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
import { ClassCard } from "@components/Classes";
import { useRouter } from "next/router";

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
      const response = await axios.put(`/api/student/${id}`, {
        name,
        phoneNumber,
        email,
        nationalId,
        status,
        // Include other fields in the request body as needed
      });
  
      if (response.status === 200) {
        toast.success("Student information updated successfully.", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error("Error updating student data:", error);
      toast.error("Failed to update student information. Please try again later.", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };
    
  // Function to fetch student data
  const fetchStudentData = async () => {
    try {
      const response = await axios.get(`/api/student/${id}`); // Replace with your actual API endpoint

      if (response.status === 200) {
        console.log(response);
        setStudentData(response.data.students[0]);
      }
    } catch (error) {
      console.error("Error fetching student data:", error);
      toast.error("Failed to fetch student data. Please try again later.", {
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
  
  
  return (
    <AdminLayout>
      <div className="row">
        <ClassCard
          data={lectures.length}
          title="Total Lectures"
          enableOptions={false}
          isLoading={loading}
        />
        <ClassCard
          data={`${
            attendances.filter((attendance) => attendance.status === "Attended")
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
          data={`${
            attendances.filter((attendance) => attendance.status === "Absent")
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
          data={`${
            attendances.filter((attendance) => attendance.status === "Execused")
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
          data={`${
            attendances.filter((attendance) => attendance.status === "Late")
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
          data={`${
            attendances.filter(
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
      <div className="container rounded bg-white mt-5 mb-5">
        <div className="row">
          <div className="col-md-12 border-right">
            <div>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="text-right">{studentData.name}</h4>
              </div>
              <div className="row mt-2">
                <div className="col-md-12">
                  <label className="labels">Name</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="first name"
                    defaultValue={studentData.name}
                  />
                </div>
              </div>
              <div className="row mt-3">
                <div className="col-md-12">
                  <label className="labels">Mobile Number</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="enter phone number"
                    defaultValue={studentData.phoneNumber}
                  />
                </div>

                <div className="col-md-12">
                  <label className="labels">Email</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="enter email id"
                    defaultValue={studentData.email}
                  />
                </div>
                <div className="col-md-12">
                  <label className="labels">National Id</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="education"
                    defaultValue={studentData.nationalId}
                  />
                </div>
              </div>
              <div className="row mt-3">
                <div className="col-md-6">
                  <label className="labels">Status</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="country"
                    defaultValue={studentData.status}
                  />
                </div>
                <div className="col-md-6">
                  <label className="labels">Paid</label>
                  <input
                    type="text"
                    className="form-control"
                    defaultValue={studentData.paid}
                    disabled
                  />
                </div>
                <div className="col-md-6">
                  <label className="labels">Due</label>
                  <input
                    type="text"
                    className="form-control"
                    defaultValue={studentData.due}
                    disabled
                  />
                </div>
                <div className="col-md-6">
                  <label className="labels">level</label>
                  <input
                    type="text"
                    className="form-control"
                    defaultValue={studentData.level}
                    disabled
                  />
                </div>
                <div className="col-md-6">
                  <label className="labels">Waiting list</label>
                  <input
                    type="text"
                    className="form-control"
                    defaultValue={studentData.waitingList}
                    disabled
                  />
                </div>
                <div className="col-md-6">
                  <label className="labels">Placement Test</label>
                  <input
                    type="text"
                    className="form-control"
                    defaultValue={new Date(
                      studentData.placementTestDate
                    ).toLocaleDateString()}
                    disabled
                  />
                </div>
                <div className="col-md-6">
                  <label className="labels">Batch</label>
                  <input
                    type="text"
                    className="form-control"
                    defaultValue={batchData.name}
                    disabled
                  />
                </div>
              </div>
              <div className="mt-5 text-end">
                <button
                  className="btn btn-primary profile-button"
                  type="button"
                >
                  Move To Waiting list
                </button>
                <button
                  className="btn btn-primary profile-button"
                  type="button"
                  onClick={handleSave}
                >
                  Update
                </button>
              </div>
            </div>
          </div>
          
        </div>
      </div>
      <Card>
        <Card.Header>Lectures for {batchData.name}</Card.Header>
        <Card.Body>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Lecture Name</th>
                <th>Date</th>
                <th>Time</th>
                <th>Duration</th>
                <th>Attendance Status</th> {/* Add this column */}
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
                    <td>{calculateTimeDuration(lecture.weeklyHours.from, lecture.weeklyHours.to)} Minutes</td>
                    <td>{status}</td> {/* Display attendance status here */}
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
      <ToastContainer />
    </AdminLayout>
  );
};

export default StudentProfile;
