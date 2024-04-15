import React, { useEffect, useState } from "react";
import { AdminLayout } from "@layout";
import { useRouter } from "next/router";
import axios from "axios";
import {
  Table,
  Card,
  Pagination,
  ProgressBar,
  Form,
  Button,
  Row,
  Col,
} from "react-bootstrap";
import { Line } from "react-chartjs-2";
import Calendar from "../../../components/Calendar";
import { ClassCard } from "@components/Classes";
import Chart from "chart.js/auto";
import { RoomPreferencesRounded } from "@mui/icons-material";
import Cookies from "js-cookie";
import Link from "next/link"; // Import Link from Next.js

const RoomReservations = () => {
  const router = useRouter();
  const { id } = router.query;
  const [reservations, setReservations] = useState([]);
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(10);
  const [roomUtilization, setRoomUtilization] = useState({
    utilizationPerDay: {},
    utilizationPerMonth: {},
  });
  const [freeTimeSlots, setFreeTimeSlots] = useState([]);
  const [room, setRoom] = useState({});
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  useEffect(() => {
    if (id) {
      fetchReservations(id);
      fetchRoomData(id);
    }
  }, [id]);

  useEffect(() => {
    calculateRoomUtilization();
  }, [reservations, dateRange]); // Include selectedDate in dependencies
  const fetchRoomData = async (roomId) => {
    try {
      const response = await axios.get(`/api/room/${roomId}`);
      setRoom(response.data);
    } catch (error) {
      console.error("Error fetching room data:", error);
    }
  };
  const fetchReservations = async (roomId) => {
    try {
      const response = await axios.get(`/api/reservation/${roomId}`);
      setReservations(response.data);
    } catch (error) {
      console.error("Error fetching reservations:", error);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleStartDateChange = (event) => {
    setDateRange({ ...dateRange, start: event.target.value });
  };

  const handleEndDateChange = (event) => {
    setDateRange({ ...dateRange, end: event.target.value });
  };

  const calculateRoomUtilization = () => {
    const utilizationPerDay = {};
    const utilizationPerMonth = {};
    const freeTimeSlots = [];

    const startDate = new Date(dateRange.start);
    const endDate = new Date(dateRange.end);

    let currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      const day = currentDate.toISOString().slice(0, 10);
      const month = currentDate.getMonth() + 1;

      // Initialize utilization arrays for each day and month
      utilizationPerDay[day] = [];
      utilizationPerMonth[month] = [];

      // Calculate utilization for each day
      if (reservations.length > 0) {
        const filteredReservations = reservations.filter((reservation) => {
          const reservationDate = new Date(reservation.date);
          return reservationDate.toISOString().slice(0, 10) === day;
        });

        filteredReservations.forEach((reservation) => {
          const reservationDate = new Date(reservation.date);
          const workingHours = room?.actualWorkingHours;
          const utilizationPercentage = calculateRoomUtilizationPercentage(
            reservationDate,
            reservation.startTime,
            reservation.endTime,
            workingHours
          );
          utilizationPerDay[day].push(utilizationPercentage);
          utilizationPerMonth[month].push(utilizationPercentage);
        });
      }

      // Calculate average utilization per day
      if (utilizationPerDay[day].length > 0) {
        const averageUtilization =
          utilizationPerDay[day].reduce((acc, curr) => acc + curr, 0) /
          utilizationPerDay[day].length;
        utilizationPerDay[day] = averageUtilization.toFixed(2);
      } else {
        utilizationPerDay[day] = 0; // Set utilization to 0 if there are no reservations
      }

      // Calculate average utilization per month
      if (utilizationPerMonth[month].length > 0) {
        const averageUtilization =
          utilizationPerMonth[month].reduce((acc, curr) => acc + curr, 0) /
          utilizationPerMonth[month].length;
        utilizationPerMonth[month] = averageUtilization.toFixed(2);
      } else {
        utilizationPerMonth[month] = 0; // Set utilization to 0 if there are no reservations
      }

      // Calculate free time slots for each day
      const workingHours = room?.actualWorkingHours;
      const dayFreeTimeSlots = calculateFreeTimeSlots(day, workingHours);
      freeTimeSlots.push({ date: day, slots: dayFreeTimeSlots });

      // Move to the next day
      currentDate.setDate(currentDate.getDate() + 1);
    }

    setRoomUtilization({ utilizationPerDay, utilizationPerMonth });
    setFreeTimeSlots(freeTimeSlots);
  };

  const calculateRoomUtilizationPercentage = (
    reservationDate,
    startTime,
    endTime,
    workingHours
  ) => {
    if (!workingHours) {
      // If workingHours is undefined, return 0 as the utilization percentage
      return 0;
    }

    // Extract start and end times from the working hours
    const { from, to } = workingHours;
    const [startHour, startMinute] = from.split(":").map(Number);
    const [endHour, endMinute] = to.split(":").map(Number);

    // Convert reservation start and end times to milliseconds since midnight
    const [reservationStartHour, reservationStartMinute] = startTime
      .split(":")
      .map(Number);
    const [reservationEndHour, reservationEndMinute] = endTime
      .split(":")
      .map(Number);
    const reservationStartMs =
      reservationStartHour * 60 * 60 * 1000 +
      reservationStartMinute * 60 * 1000;
    const reservationEndMs =
      reservationEndHour * 60 * 60 * 1000 + reservationEndMinute * 60 * 1000;

    // Convert working hours to milliseconds
    const workingHoursStartMs =
      startHour * 60 * 60 * 1000 + startMinute * 60 * 1000;
    const workingHoursEndMs = endHour * 60 * 60 * 1000 + endMinute * 60 * 1000;

    // Calculate the total duration of working hours in milliseconds
    const workingHoursDurationMs = workingHoursEndMs - workingHoursStartMs;

    // Calculate overlap duration between working hours and reservation
    const overlapStart = Math.max(workingHoursStartMs, reservationStartMs);
    const overlapEnd = Math.min(workingHoursEndMs, reservationEndMs);
    const overlapDurationMs = Math.max(0, overlapEnd - overlapStart);

    // Calculate room utilization percentage within working hours
    const roomUtilizationPercentage = (
      (overlapDurationMs / workingHoursDurationMs) *
      100
    ).toFixed(2);

    return parseFloat(roomUtilizationPercentage); // Convert back to float
  };

  const calculateFreeTimeSlots = (date, workingHours) => {
    const freeTimeSlots = [];

    if (!workingHours) {
      return { date, slots: freeTimeSlots }; // Return an object with date and empty slots array if working hours are not defined
    }

    const { from, to } = workingHours;
    const [startHour, startMinute] = from.split(":").map(Number);
    const [endHour, endMinute] = to.split(":").map(Number);

    const existingReservations = reservations.filter((reservation) => {
      const reservationDate = new Date(reservation.date)
        .toISOString()
        .slice(0, 10);
      return reservationDate === date;
    });

    let currentHour = startHour;
    let currentMinute = startMinute;

    existingReservations.forEach((reservation) => {
      const [reservationStartHour, reservationStartMinute] =
        reservation.startTime.split(":").map(Number);
      const [reservationEndHour, reservationEndMinute] = reservation.endTime
        .split(":")
        .map(Number);

      if (
        reservationStartHour > currentHour ||
        (reservationStartHour === currentHour &&
          reservationStartMinute > currentMinute)
      ) {
        // Add time slot from current time to the start of the reservation
        const endTime = `${reservationStartHour
          .toString()
          .padStart(2, "0")}:${reservationStartMinute
          .toString()
          .padStart(2, "0")}`;
        freeTimeSlots.push({
          date: date,
          start: `${currentHour.toString().padStart(2, "0")}:${currentMinute
            .toString()
            .padStart(2, "0")}`,
          end: endTime,
        });
      }

      // Update current time to end of the reservation
      currentHour = reservationEndHour;
      currentMinute = reservationEndMinute;
    });

    // Add the remaining time slot after the last reservation
    if (
      currentHour < endHour ||
      (currentHour === endHour && currentMinute < endMinute)
    ) {
      const endTime = `${endHour.toString().padStart(2, "0")}:${endMinute
        .toString()
        .padStart(2, "0")}`;
      freeTimeSlots.push({
        date: date,
        start: `${currentHour.toString().padStart(2, "0")}:${currentMinute
          .toString()
          .padStart(2, "0")}`,
        end: endTime,
      });
    }
    console.log(freeTimeSlots);
    return freeTimeSlots;
  };

  const dataPerDay = {
    labels: Object.keys(roomUtilization.utilizationPerDay).map(
      (day) => `Day ${day}`
    ),
    datasets: [
      {
        label: "Room Utilization Per Day (%)",
        data: Object.values(roomUtilization.utilizationPerDay),
        borderColor: "rgba(255, 99, 132, 0.5)",
        fill: false,
      },
    ],
  };

  const dataPerMonth = {
    labels: Object.keys(roomUtilization.utilizationPerMonth).map(
      (month) => `Month ${month}`
    ),
    datasets: [
      {
        label: "Room Utilization Per Month (%)",
        data: Object.values(roomUtilization.utilizationPerMonth),
        borderColor: "rgba(53, 162, 235, 0.5)",
        fill: false,
      },
    ],
  };

  const sortedReservations = [...reservations].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  const indexOfLastReservation = page * rowsPerPage;
  const indexOfFirstReservation = indexOfLastReservation - rowsPerPage;
  const currentReservations = sortedReservations.slice(
    indexOfFirstReservation,
    indexOfLastReservation
  );

  const totalPages = Math.ceil(sortedReservations.length / rowsPerPage);
  console.log(roomUtilization.utilizationPerDay);
  const handleDeleteRoom = async () => {
    const roomName = prompt("Please enter the room name to confirm deletion:");
    if (!roomName || roomName !== room?.name) {
      alert("Room name entered does not match. Deletion cancelled.");
      return;
    }

    try {
      await axios.delete(`/api/room/${id}`);
      // Handle success scenario (e.g., show a success message, redirect to a different page)
      router.push("/rooms"); // Example redirection to rooms page
    } catch (error) {
      console.error("Error deleting room:", error);
      // Handle error scenario (e.g., show an error message)
    }
  };
  const handleDisableRoom = async () => {
    const roomName = prompt("Please enter the room name to confirm Disable:");
    if (!roomName || roomName !== room?.name) {
      alert("Room name entered does not match. Disabling cancelled.");
      return;
    }
    const token = Cookies.get("client_token");

    const decodedToken = JSON.parse(atob(token.split(".")[1]));
    console.log(decodedToken);
    try {
      await axios.put(`/api/room/${id}/disable-room`, {
        userId: decodedToken.adminId,
      });
    } catch (error) {
      console.error("Error disabling room:", error);
      // Handle error scenario (e.g., show an error message)
    }
  };

  const handleEditRoom = () => {
    // Redirect to edit room page with room ID
    router.push(`/rooms/${id}/edit`);
  };

  return (
    <AdminLayout>
      {room.disabled && (
        <div
          className="alert alert-warning d-flex justify-content-between align-items-center fw-bold"
          role="alert"
        >
          This room is disabled at {new Date(room?.disabledAt).toLocaleString()}
          .
          <div>
            <Button
              variant="outline-success"
              className="me-2 fw-bold"
              onClick={handleDisableRoom}
            >
              Enable
            </Button>
            <Link href={`/rooms/${room._id}/status-logs`} passHref>
              <Button variant="outline-info" className="fw-bold">
                View Logs
              </Button>
            </Link>
          </div>
        </div>
      )}

      <Row>
        <ClassCard
          data={`${room?.capacity || 0} Students`}
          title="Capacity"
          enableOptions={false}
        />
        <ClassCard
          data={`${room?.actualWorkingHours?.from || "00:00"} To ${
            room?.actualWorkingHours?.to || "23:59"
          }`}
          title="Working Hours"
          enableOptions={false}
        />
      </Row>
      <Card style={{ marginBottom: 20 }}>
        <Card.Header
          as="h5"
          className="d-flex justify-content-between align-items-center"
        >
          Room Reservations{""}{" "}
          <div>
            <Button
              variant="primary"
              className="me-2 fw-bold"
              onClick={handleEditRoom}
            >
              Edit
            </Button>
            {room?.disabled || (
              <>
                <Button
                  variant="warning"
                  className="me-2 fw-bold"
                  onClick={handleDisableRoom}
                >
                  {"Disable"}
                </Button>
                <Link href={`/rooms/${room._id}/status-logs`} className="me-2" passHref>
                  <Button variant="info" className="fw-bold">
                    View Logs
                  </Button>
                </Link>
              </>
            )}
            <Button
              variant="danger"
              className="fw-bold"
              onClick={handleDeleteRoom}
            >
              Delete
            </Button>
          </div>
        </Card.Header>
        <Card.Body>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Title</th>
                <th>Level</th>
                <th>Date</th>
                <th>Days of Week</th>
                <th>Start Time</th>
                <th>End Time</th>
                <th>Students</th>
              </tr>
            </thead>
            <tbody>
              {currentReservations.map((reservation) => (
                <tr key={reservation._id}>
                  <td title={reservation.title}>
                    {reservation.title.substring(0, 4)}....
                  </td>
                  <td>{reservation?.batch?.levelName}</td>
                  <td>{new Date(reservation.date).toLocaleDateString()}</td>
                  <td>{reservation.daysOfWeek.join(", ")}</td>
                  <td>{reservation.startTime}</td>
                  <td>{reservation.endTime}</td>
                  <td>
                    <div className="d-flex align-items-center">
                      <span className="me-2">
                        {reservation?.batch?.studentCount || 0}/
                        {reservation?.room?.capacity || 0}
                      </span>
                      <ProgressBar
                        now={
                          ((reservation?.batch?.studentCount || 0) /
                            (reservation?.room?.capacity || 1)) *
                          100
                        }
                        label={`${(
                          ((reservation?.batch?.studentCount || 0) /
                            (reservation?.room?.capacity || 1)) *
                          100
                        ).toFixed(0)}%`}
                        variant="info"
                        style={{ width: "100%", fontSize: "0.75rem" }}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <div className="d-flex justify-content-between align-items-center">
            <div className="fw-bold">
              Total entries: {sortedReservations.length}
            </div>
            <Pagination className="mb-0">
              <Pagination.Prev
                onClick={() => handleChangePage(null, page - 1)}
                disabled={page === 1}
              />
              <Pagination.Item active>{page}</Pagination.Item>
              <Pagination.Next
                onClick={() => handleChangePage(null, page + 1)}
                disabled={page === totalPages}
              />
            </Pagination>
            <div className="fw-bold">Total pages: {totalPages}</div>
          </div>
        </Card.Body>
      </Card>
      <Card style={{ marginBottom: 20 }}>
        <Card.Header as="h5">Available Time Slots</Card.Header>
        <Card.Body>
          <Form.Group className="mb-3">
            <Row>
              <Col>
                <Form.Label>Start Date:</Form.Label>
                <Form.Control
                  type="date"
                  value={dateRange.start}
                  onChange={handleStartDateChange}
                />
              </Col>
              <Col>
                <Form.Label>End Date:</Form.Label>
                <Form.Control
                  type="date"
                  value={dateRange.end}
                  onChange={handleEndDateChange}
                />
              </Col>
            </Row>
          </Form.Group>
          {Object.keys(roomUtilization.utilizationPerDay).map((day) => (
            <Card key={day} style={{ marginBottom: 20 }}>
              <Card.Header>{day}</Card.Header>
              <Card.Body>
                <ProgressBar
                  now={roomUtilization.utilizationPerDay[day]}
                  label={`${roomUtilization.utilizationPerDay[day]}%`}
                  variant="success"
                  striped
                  style={{ width: "100%", fontSize: "1.75rem", height: "80px" }}
                />
                {freeTimeSlots.length === 0 ? (
                  <p>No Free Slots</p>
                ) : (
                  <Row xs={1} md={2} lg={4} className="mt-3">
                    {freeTimeSlots
                      .filter((slot) => slot.slots.some((s) => s.date === day))
                      .map((slot, index) => (
                        <>
                          {slot.slots.map((s, idx) => (
                            <ClassCard
                              key={idx}
                              data={`${s.start} - ${s.end}`}
                              title="Free Slot"
                              enableOptions={false}
                            />
                          ))}
                        </>
                      ))}
                  </Row>
                )}
              </Card.Body>
            </Card>
          ))}
        </Card.Body>
      </Card>

      {/* <Card style={{ marginBottom: 20 }}>
        <Card.Header as="h5">Available Time Slots for Selected Day</Card.Header>
        <Card.Body>
          <Form.Group className="mb-3">
            <Form.Label>Select a Date:</Form.Label>
            <Form.Control
              type="date"
              value={selectedDate}
              onChange={handleDateChange}
            />
          </Form.Group>
          <ProgressBar
            now={calculateRoomUtilizationPercentage(reservations, selectedDate, room?.actualWorkingHours)}
            label={`${calculateRoomUtilizationPercentage(
              reservations,
              selectedDate,
              room?.actualWorkingHours
            )}%`}
            variant="success"
            striped
            style={{ width: "100%", fontSize: "1.75rem", height: "80px" }}
          />
          {freeTimeSlots.length === 0 ? (
            <p>No Free Slots</p>
          ) : (
            <Row xs={1} md={2} lg={4} className="mt-3">
              {freeTimeSlots.map((slot, index) => (
                <Col key={index}>
                  <Card className="mb-3">
                    <Card.Body>
                      <Card.Title>Free Slot</Card.Title>
                      <Card.Text>
                        {slot.start} - {slot.end}
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </Card.Body>
      </Card> */}
      {/* Chart for Room Utilization Per Day */}
      {dateRange && (
        <>
          <Card style={{ marginBottom: 20 }}>
            <Card.Header as="h5">Room Utilization Per Day (%)</Card.Header>
            <Card.Body>
              <Line data={dataPerDay} />
            </Card.Body>
          </Card>

          {/* Chart for Room Utilization Per Month */}
          <Card style={{ marginBottom: 20 }}>
            <Card.Header as="h5">Room Utilization Per Month (%)</Card.Header>
            <Card.Body>
              <Line data={dataPerMonth} />
            </Card.Body>
          </Card>
        </>
      )}

      <Calendar id={id} />
    </AdminLayout>
  );
};

export default RoomReservations;
