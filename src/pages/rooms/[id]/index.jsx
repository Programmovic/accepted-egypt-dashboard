import React, { useEffect, useState } from "react";
import { AdminLayout } from "@layout";
import { useRouter } from "next/router";
import axios from "axios";
import { Table, Card, Pagination } from "react-bootstrap";
import Calendar from "../../../components/Calendar";
import { ClassCard } from "@components/Classes";

const RoomReservations = () => {
  const router = useRouter();
  const { id } = router.query;
  const [reservations, setReservations] = useState([]);
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(10);
  const [roomUtilization, setRoomUtilization] = useState({});

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
      const startTime = parseInt(reservation.startTime.split(":")[0], 10);
      const endTime = parseInt(reservation.endTime.split(":")[0], 10);

      const reservedTime = endTime - startTime;

      if (!utilizationPerDay.hasOwnProperty(day)) {
        utilizationPerDay[day] = 0;
      }
      utilizationPerDay[day] += reservedTime;

      if (!utilizationPerMonth.hasOwnProperty(month)) {
        utilizationPerMonth[month] = 0;
      }
      utilizationPerMonth[month] += reservedTime;
    });

    setRoomUtilization({ utilizationPerDay, utilizationPerMonth });
  };

  // Sort reservations array in descending order based on the date
  const sortedReservations = [...reservations].sort((a, b) => new Date(b.date) - new Date(a.date));

  const indexOfLastReservation = page * rowsPerPage;
  const indexOfFirstReservation = indexOfLastReservation - rowsPerPage;
  const currentReservations = sortedReservations.slice(indexOfFirstReservation, indexOfLastReservation);

  const totalPages = Math.ceil(sortedReservations.length / rowsPerPage);

  return (
    <AdminLayout>
      <ClassCard
          data={`${reservations[0]?.room?.capacity} Student`}
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
                <th>Date</th>
                <th>Days of Week</th>
                <th>Start Time</th>
                <th>End Time</th>
              </tr>
            </thead>
            <tbody>
              {currentReservations.map((reservation) => (
                <tr key={reservation._id}>
                  <td>{reservation.title}</td>
                  <td>{new Date(reservation.date).toLocaleDateString()}</td>
                  <td>{reservation.daysOfWeek.join(", ")}</td>
                  <td>{reservation.startTime}</td>
                  <td>{reservation.endTime}</td>
                </tr>
              ))}
            </tbody>
          </Table>
          <div className="d-flex justify-content-between align-items-center">
            <div className="fw-bold">Total entries: {sortedReservations.length}</div>
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

      <Calendar id={id} />
    </AdminLayout>
  );
};

export default RoomReservations;
