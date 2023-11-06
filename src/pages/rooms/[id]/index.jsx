import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Badge, Button, Modal } from "react-bootstrap";
import { AdminLayout } from "@layout";
import { useRouter } from "next/router";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid"; // Import the timeGrid plugin
import bootstrap5Plugin from "@fullcalendar/bootstrap5";

const RoomReservations = () => {
  const [roomReservations, setRoomReservations] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showEventModal, setShowEventModal] = useState(false);
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
    eventInfo: reservation,
  }));

  const handleEventClick = (clickInfo) => {
    setSelectedEvent(clickInfo.event.extendedProps.eventInfo);
    setShowEventModal(true);
  };

  // Callback to customize event rendering
  const eventRender = (info) => {
    const eventTitle = info.event.title;
    info.el.querySelector(".fc-title").innerText = eventTitle;
  };

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
            plugins={[timeGridPlugin, bootstrap5Plugin]}
            initialView="timeGridWeek"
            weekends={true}
            events={calendarEvents}
            selectable={true}
            editable
            eventColor="#378006"
            eventBackgroundColor="black"
            displayEventTime={true}
            eventRender={eventRender} // Customize event rendering
            eventClick={handleEventClick}
          />
        </Card.Body>
      </Card>

      <Modal show={showEventModal} onHide={() => setShowEventModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Event Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedEvent && (
            <div>
              <p>Title: {selectedEvent.title}</p>
              <p>Date: {selectedEvent.date}</p>
              <p>Start Time: {selectedEvent.startTime}</p>
              <p>End Time: {selectedEvent.endTime}</p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEventModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </AdminLayout>
  );
};

export default RoomReservations;
