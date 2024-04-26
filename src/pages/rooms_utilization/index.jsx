import React, { useEffect, useState } from "react";
import { AdminLayout } from "@layout";
import { Card, Form, Button, Row, Col, ProgressBar } from "react-bootstrap";
import axios from "axios";
import { useRouter } from "next/router";

const RoomUtilizations = () => {
  const [allReservations, setAllReservations] = useState([]);
  const [roomUtilization, setRoomUtilization] = useState({});
  const router = useRouter();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    fetchAllReservations();
  }, []);

  useEffect(() => {
    if (startDate && endDate) {
      calculateRoomUtilization();
    }
  }, [startDate, endDate]);

  const fetchAllReservations = async () => {
    try {
      const response = await axios.get(`/api/reservation`);
      setAllReservations(response.data);
    } catch (error) {
      console.error("Error fetching reservations:", error);
    }
  };

  const handleStartDateChange = (event) => {
    setStartDate(event.target.value);
  };

  const handleEndDateChange = (event) => {
    setEndDate(event.target.value);
  };

  const calculateRoomUtilization = () => {
    const roomUtilizationSummary = {};

    allReservations.forEach((reservation) => {
      const reservationDate = new Date(reservation.date);
      if (
        reservationDate >= new Date(startDate) &&
        reservationDate <= new Date(endDate) &&
        !reservation?.room?.disabled
      ) {
        const roomId = reservation.room?._id;
        const dayKey = reservationDate.toDateString(); // Use date string as key for each day

        if (!roomUtilizationSummary[roomId]) {
          roomUtilizationSummary[roomId] = {
            roomName: reservation.room?.name,
            totalUtilization: 0,
            reservationCount: 0,
            reservations: [], // Store reservations for each room
          };
        }

        const workingHours = reservation.room?.actualWorkingHours;
        const utilizationPercentage = calculateUtilizationPercentage(
          reservation.startTime,
          reservation.endTime,
          workingHours
        );
        console.log(utilizationPercentage);
        roomUtilizationSummary[roomId].totalUtilization +=
          utilizationPercentage;

        roomUtilizationSummary[roomId].reservationCount++;
        roomUtilizationSummary[roomId].reservations.push(reservation); // Store reservation for the room
      }
    });

    // Calculate average utilization percentage for each room
    Object.keys(roomUtilizationSummary).forEach((roomId) => {
      const roomData = roomUtilizationSummary[roomId];
      if (roomData.reservationCount > 0) {
        roomData.totalUtilization /= roomData.reservationCount;
      }
    });

    setRoomUtilization(roomUtilizationSummary);
  };

  const calculateUtilizationPercentage = (startTime, endTime, workingHours) => {
    // Convert start time and end time to minutes for easier calculation
    const [startHour, startMinute] = startTime.split(":").map(Number);
    const [endHour, endMinute] = endTime.split(":").map(Number);

    const reservationStartMinutes = startHour * 60 + startMinute;
    const reservationEndMinutes = endHour * 60 + endMinute;

    // Ensure that workingHours is defined and has the expected structure
    if (
      workingHours &&
      workingHours.from &&
      workingHours.to &&
      typeof workingHours.from === "string" &&
      typeof workingHours.to === "string"
    ) {
      const [workingStartHour, workingStartMinute] = workingHours.from
        .split(":")
        .map(Number);
      const [workingEndHour, workingEndMinute] = workingHours.to
        .split(":")
        .map(Number);

      const workingStartMinutes = workingStartHour * 60 + workingStartMinute;
      const workingEndMinutes = workingEndHour * 60 + workingEndMinute;

      // Calculate the overlap time between reservation and working hours
      const overlapStart = Math.max(
        reservationStartMinutes,
        workingStartMinutes
      );
      const overlapEnd = Math.min(reservationEndMinutes, workingEndMinutes);

      const reservationDuration =
        reservationEndMinutes - reservationStartMinutes;
      const workingHoursDuration = workingEndMinutes - workingStartMinutes;

      // Calculate the utilization percentage
      let utilizationPercentage = 0;
      if (reservationDuration > 0 && workingHoursDuration > 0) {
        utilizationPercentage =
          ((overlapEnd - overlapStart) / reservationDuration) * 100;
      }

      return utilizationPercentage;
    } else {
      console.error("Working hours are not properly defined.");
      return 0; // Return 0 if working hours are not properly defined
    }
  };
  const handleCardClick = (roomId) => {
    router.push(`/rooms/${roomId}?startDate=${startDate}&endDate=${endDate}`);
  };
  return (
    <AdminLayout>
      <Card style={{ marginBottom: 20 }}>
        <Card.Header as="h5">Select Date Range</Card.Header>
        <Card.Body>
          <Form.Group className="mb-3">
            <Row>
              <Col>
                <Form.Label>Start Date:</Form.Label>
                <Form.Control
                  type="date"
                  value={startDate}
                  onChange={handleStartDateChange}
                />
              </Col>
              <Col>
                <Form.Label>End Date:</Form.Label>
                <Form.Control
                  type="date"
                  value={endDate}
                  onChange={handleEndDateChange}
                />
              </Col>
            </Row>
          </Form.Group>
        </Card.Body>
      </Card>
      <Row>
        {Object.keys(roomUtilization).map((roomId) => (
          <Col lg={4} md={6} key={roomId} className="mb-4">
            <Card
              className="h-100 shadow"
              onClick={() => handleCardClick(roomId)}
              style={{ cursor: "pointer", borderRadius: "15px" }}
            >
              <Card.Header
                as="h6"
                style={{
                  borderTopLeftRadius: "15px",
                  borderTopRightRadius: "15px",
                }}
              >
                {roomUtilization[roomId].roomName}
              </Card.Header>
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <ProgressBar
                    now={roomUtilization[roomId].totalUtilization}
                    label={`${roomUtilization[roomId].totalUtilization.toFixed(
                      2
                    )}%`}
                    variant="success"
                    style={{ height: "30px", width: "100%" }}
                  />
                </div>
                <div className="text-center">
                <span className="badge fs-6 bg-secondary">
                  Reservation Count: {roomUtilization[roomId].reservationCount}
                </span>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </AdminLayout>
  );
};

export default RoomUtilizations;
