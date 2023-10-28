import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Card, Form, Modal, Table } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AdminLayout } from "@layout";
import Link from "next/link";

const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [sortOrder, setSortOrder] = useState("asc");
  const [name, setName] = useState("");
  const [capacity, setCapacity] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const fetchRooms = async () => {
    try {
      const response = await axios.get("/api/room");
      if (response.status === 200) {
        setRooms(response.data);
      }
    } catch (error) {
      console.error("Error fetching room data:", error);
      setError("Failed to fetch room data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchCurrentReservations();
    fetchRooms();
  }, []);
  const [currentReservations, setCurrentReservations] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  console.log(currentReservations);
  // Function to fetch current reservations
  const fetchCurrentReservations = async () => {
    try {
      const response = await axios.get("/api/reservation");
      if (response.status === 200) {
        const reservations = response.data;
        setCurrentReservations(reservations);
      }
    } catch (error) {
      console.error("Error fetching reservations data:", error);
    }
  };
  const handleAddRoom = async () => {
    try {
      const response = await axios.post("/api/room", {
        name,
        capacity,
        location,
        description,
      });
      if (response.status === 201) {
        // Data added successfully
        fetchRooms();
        toast.success("Room added successfully!", {
          position: "top-right",
          autoClose: 3000,
        });
        setShowModal(false);
        // Clear the form fields
        setName("");
        setCapacity("");
        setLocation("");
        setDescription("");
      }
    } catch (error) {
      console.error("Error adding room:", error);
      setError("Failed to add the room. Please try again.");
      toast.error("Failed to add the room. Please try again.", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const handleSort = (order) => {
    setSortOrder(order);
    const sortedRooms = [...rooms].sort((a, b) => {
      return order === "asc"
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    });
    setRooms(sortedRooms);
  };
  const handleRefreshAvailability = () => {
    setCurrentTime(new Date());
  };
  function compareTimes(time1, time2) {
    // Convert times to minutes since midnight
    const time1Minutes = convertToMinutes(time1);
    const time2Minutes = convertToMinutes(time2);

    // Compare the times
    if (time1Minutes >= time2Minutes) {
      return true;
    } else {
      return false; // Times are equal
    }
  }

  function convertToMinutes(time) {
    const [hh, mm, a] = time.split(/:| /); // Split by colon or space

    // Convert to 24-hour format
    let hours = parseInt(hh, 10);
    if (a === "PM" && hours !== 12) {
      hours += 12;
    } else if (a === "AM" && hours === 12) {
      hours = 0;
    }

    // Calculate total minutes
    const minutes = hours * 60 + parseInt(mm, 10);
    return minutes;
  }
  const isRoomAvailable = (room, currentTime) => {
    const currentDate = currentTime.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    const currentDay = currentTime.toLocaleDateString("en-US", {
      weekday: "long",
    });
    const currentTimeString = currentTime.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });

    // Filter the reservations to only include those for the current room
    const roomReservations = currentReservations.filter(
      (reservation) => reservation.room === room._id
    );
    // Check if there are any reservations for the current room that match the current date, day, and time
    return roomReservations.every((reservation) => {
      const reservationDate = new Date(reservation.date).toLocaleDateString(
        "en-US",
        {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        }
      );
      const startTimeString = reservation.startTime;
      const endTimeString = reservation.endTime;
      console.log(reservationDate === currentDate);
      if (
        reservationDate === currentDate &&
        compareTimes(currentTimeString, startTimeString) &&
        compareTimes(endTimeString, currentTimeString)
      ) {
        console.log(currentDate, reservation.startDate);
        return false; // Room is reserved at this date and time
      }
      return true; // Room is available
    });
  };

  const handleRowClick = (room) => {
    setSelectedRoom(room);
    setShowDetailsModal(true);
  };
  return (
    <AdminLayout>
      <Card>
        <Card.Header>Rooms</Card.Header>
        <Card.Body>
          <Button
            variant="success"
            onClick={() => setShowModal(true)}
            className="mb-3"
          >
            Add Room
          </Button>
          <Button
            variant="primary"
            onClick={handleRefreshAvailability}
            className="mb-3 ms-3"
          >
            Refresh Availability
          </Button>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>#</th>
                <th
                  onClick={() =>
                    handleSort(sortOrder === "asc" ? "desc" : "asc")
                  }
                >
                  Room Name {sortOrder === "asc" ? "▲" : "▼"}
                </th>
                <th>Capacity</th>
                <th>Location</th>
                <th>Description</th>
                <th>Availability</th>
              </tr>
            </thead>
            <tbody>
              {rooms.map((room, index) => {
                const isRoomReserved = !isRoomAvailable(room, currentTime);
                return (
                  <tr key={room._id} onClick={() => handleRowClick(room)}>
                    <td>{index + 1}</td>
                    <td>{room.name}</td>
                    <td>{room.capacity}</td>
                    <td>{room.location}</td>
                    <td>{room.description}</td>
                    <td>{isRoomReserved ? "Reserved" : "Available"}</td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
      <ToastContainer position="top-right" autoClose={3000} />
      <Modal show={showDetailsModal} onHide={() => setShowDetailsModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Room Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedRoom && (
            <div>
              <p>Room Name: {selectedRoom.name}</p>
              <p>Capacity: {selectedRoom.capacity}</p>
              <p>Location: {selectedRoom.location}</p>
              <p>Description: {selectedRoom.description}</p>

              <Modal.Footer>
                <Button variant="success">
                  <Link
                    href={`/rooms/${selectedRoom._id}`}
                    className="text-decoration-none text-light"
                  >
                    View Room Reservations
                  </Link>
                </Button>
              </Modal.Footer>
            </div>
          )}
        </Modal.Body>
      </Modal>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Create New Room</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Room Name</Form.Label>
              <Form.Control
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Capacity</Form.Label>
              <Form.Control
                type="number"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Location</Form.Label>
              <Form.Control
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="success" onClick={handleAddRoom}>
            Add Room
          </Button>
        </Modal.Footer>
      </Modal>
    </AdminLayout>
  );
};

export default Rooms;
