import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import bootstrap5Plugin from "@fullcalendar/bootstrap5";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import { Card, Badge, Button, Modal } from "react-bootstrap";
import axios from "axios";

const Calendar = ({ id }) => {
  const [roomReservations, setRoomReservations] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showEventModal, setShowEventModal] = useState(false);

  const apiUrl = id ? `/api/reservation/${id}` : "/api/reservation";

  const fetchReservations = async () => {
    try {
      const response = await axios.get(apiUrl);
      if (response.status === 200) {
        setRoomReservations(response.data);
      }
    } catch (error) {
      console.error("Error fetching reservations:", error);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, [id]);

  const getRandomColor = (title) => {
    if (title === "Placement Test") {
      return "navy";
    } else {
      const letters = "0123456789ABCDEF";
      let color = `#${title.split(" - ")[2]}`;
      return color;
    }
  };

  function convertDateFormat(originalDateTime) {
    const dateParts = originalDateTime.split(" ");
    const date = new Date(dateParts[0]);
    const time12Hour = dateParts[1] + " " + dateParts[2];
    const convertedDateTime = new Date(
      date.toISOString().split("T")[0] + "T" + convertTime12to24(time12Hour)
    );
    return convertedDateTime;
  }

  function convertTime12to24(time12) {
    const [time, modifier] = time12.split(" ");
    let [hours, minutes] = time.split(":");
    
    if (modifier === "AM") {
      if (hours === "12") {
        hours = "00";
      }
    } else if (modifier === "PM") {
      if (hours !== "12") {
        hours = parseInt(hours, 10) + 12;
      }
    }
    
    return hours + ":" + minutes;
  }
  

  const calendarEvents = roomReservations.map((reservation, index) => {
    const startDateTime = convertDateFormat(
      `${reservation?.date} ${reservation?.startTime}`
    );
    const endDateTime = convertDateFormat(
      `${reservation?.date} ${reservation?.endTime}`
    );
    return {
      title: `${reservation.title}`,
      start: startDateTime,
      end: endDateTime,
      color: getRandomColor(reservation.title),
      eventInfo: reservation,
      allDay: reservation.title === "Placement Test" && true,
    };
  });

  const handleEventClick = (clickInfo) => {
    setSelectedEvent(clickInfo.event.extendedProps.eventInfo);
    setShowEventModal(true);
  };

  const eventRender = (info) => {
    const eventTitle = info.event.title;
    info.el.querySelector(".fc-title").innerText = eventTitle;
  };

  return (
    <>
      <Card>
        <Card.Header>
          Room Reservations{" "}
          <Badge pill variant="primary" className="me-2">
            {roomReservations.length}
          </Badge>
        </Card.Header>
        <Card.Body>
          <FullCalendar
            plugins={[
              dayGridPlugin,
              bootstrap5Plugin,
              timeGridPlugin,
              listPlugin,
            ]}
            initialView="dayGridMonth"
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right:
                "dayGridMonth,timeGridWeek,timeGridDay,listWeek,listDay",
            }}
            weekends={true}
            events={calendarEvents}
            timeFormat="H(:mm)"
            selectable={true}
            editable
            displayEventTime={false}
            eventRender={eventRender}
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
              <p>Date: {new Date(selectedEvent.date).toLocaleDateString()}</p>
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
    </>
  );
};

export default Calendar;
