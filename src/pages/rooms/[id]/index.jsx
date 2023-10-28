import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Badge, Button } from "react-bootstrap";
import { AdminLayout } from "@layout";
import { useRouter } from "next/router";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid"; // a plugin!
// Import your custom CSS for styling

const RoomReservations = () => {
  const [roomReservations, setRoomReservations] = useState([]);
  const [weekView, setWeekView] = useState(false); // To toggle between week and list view
  const router = useRouter();
  const { id } = router.query;
  const apiUrl = `/api/reservation/${id}`;

  const fetchRoomReservations = async () => {
    try {
      const response = await axios.get(apiUrl);
      if (response.status === 200) {
        setRoomReservations(response.data);
      }
    } catch (error) {
      console.error("Error fetching room's reservations:", error);
    }
  };

  useEffect(() => {
    if (id) {
      fetchRoomReservations();
    }
  }, [id, apiUrl]);
  const calendarEvents = roomReservations.map((reservation) => ({
    title: `${reservation.title} From ${reservation.startTime} to ${reservation.endTime}`,
    date: reservation.date,
  }));
  console.log(calendarEvents)
  return (
    <AdminLayout>
      <Card>
        <Card.Header>
          Room Reservations{" "}
          <Badge pill variant="primary" className="me-2">
            {roomReservations.length}
          </Badge>
        </Card.Header>
        <Card.Body>
          <FullCalendar
            plugins={[dayGridPlugin]}
            initialView="dayGridMonth"
            weekends={true}
            events={calendarEvents}
          />
        </Card.Body>
      </Card>
    </AdminLayout>
  );
};

export default RoomReservations;
