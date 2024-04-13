import React, { useEffect, useState } from "react";
import { AdminLayout } from "@layout";
import { useRouter } from "next/router";
import axios from "axios";
import { Table, Card, Pagination, ProgressBar } from "react-bootstrap";
import { Line } from 'react-chartjs-2';
import Calendar from "../../../components/Calendar";
import { ClassCard } from "@components/Classes";
import Chart from 'chart.js/auto';

const RoomReservations = () => {
  const router = useRouter();
  const { id } = router.query;
  const [reservations, setReservations] = useState([]);
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(10);
  const [roomUtilization, setRoomUtilization] = useState({ utilizationPerDay: {}, utilizationPerMonth: {} });

  useEffect(() => {
    if (id) {
      fetchReservations(id);
    }
  }, [id]);

  useEffect(() => {
    calculateRoomUtilization();
  }, [reservations]);

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

  const calculateRoomUtilization = () => {
    const utilizationPerDay = {};
    const utilizationPerMonth = {};

    reservations.forEach((reservation) => {
      const date = new Date(reservation.date);
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const studentCount = reservation?.batch?.studentCount || 0;
      const capacity = reservation?.room?.capacity || 1; // Ensure no division by zero
      const usagePercentage = (studentCount / capacity) * 100;

      if (!utilizationPerDay.hasOwnProperty(day)) {
        utilizationPerDay[day] = [];
      }
      utilizationPerDay[day].push(usagePercentage);

      if (!utilizationPerMonth.hasOwnProperty(month)) {
        utilizationPerMonth[month] = [];
      }
      utilizationPerMonth[month].push(usagePercentage);
    });

    // Calculate average utilization per day and per month
    Object.keys(utilizationPerDay).forEach(day => {
      utilizationPerDay[day] = utilizationPerDay[day].reduce((a, b) => a + b, 0) / utilizationPerDay[day].length;
    });
    Object.keys(utilizationPerMonth).forEach(month => {
      utilizationPerMonth[month] = utilizationPerMonth[month].reduce((a, b) => a + b, 0) / utilizationPerMonth[month].length;
    });

    setRoomUtilization({ utilizationPerDay, utilizationPerMonth });
  };

  const dataPerDay = {
    labels: Object.keys(roomUtilization.utilizationPerDay).map(day => `Day ${day}`),
    datasets: [
      {
        label: 'Room Utilization Per Day (%)',
        data: Object.values(roomUtilization.utilizationPerDay),
        borderColor: 'rgba(255, 99, 132, 0.5)',
        fill: false,
      },
    ],
  };

  const dataPerMonth = {
    labels: Object.keys(roomUtilization.utilizationPerMonth).map(month => `Month ${month}`),
    datasets: [
      {
        label: 'Room Utilization Per Month (%)',
        data: Object.values(roomUtilization.utilizationPerMonth),
        borderColor: 'rgba(53, 162, 235, 0.5)',
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

  return (
    <AdminLayout>
      <ClassCard
        data={`${reservations[0]?.room?.capacity || 0} Students`}
        title="Capacity"
        enableOptions={false}
      />
      <Card style={{ marginBottom: 20 }}>
        <Card.Header as="h5">Room Reservations</Card.Header>
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

      {/* Chart for Room Utilization Per Day */}
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

      <Calendar id={id} />
    </AdminLayout>
  );
};

export default RoomReservations;
