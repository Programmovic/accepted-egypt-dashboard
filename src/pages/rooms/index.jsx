import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Card, Form, Modal, Table, Col, Row } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AdminLayout } from "@layout";
import Link from "next/link";
import Select from "react-select";
import TimePicker from "react-time-picker";
import "react-time-picker/dist/TimePicker.css";
import "react-clock/dist/Clock.css";

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
  const [actualWorkingHours, setActualWorkingHours] = useState({});
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [branches, setBranches] = useState([]);

  // Function to fetch branches
  const fetchBranches = async () => {
    try {
      const response = await axios.get("/api/branch");
      if (response.status === 200) {
        setBranches(response.data);
      }
    } catch (error) {
      console.error("Error fetching branch data:", error);
      setError("Failed to fetch branch data. Please try again later.");
    }
  };

  const fetchRooms = async () => {
    try {
      const response = await axios.get("/api/room");
      if (response.status === 200) {
        console.log(response);
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
    fetchBranches();
  }, []);
  const [currentReservations, setCurrentReservations] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());
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
        actualWorkingHours,
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
        setActualWorkingHours("");
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

  const handleRowClick = (room) => {
    setSelectedRoom(room);
    setShowDetailsModal(true);
  };

  const checkRoomAvailability = async (
    selectedRoomId,
    date,
    fromTime,
    toTime
  ) => {
    const apiUrl = "/api/reservation/available-rooms";
    try {
      const params = {
        date,
        fromTime,
        toTime,
      };

      const availableRoomsResponse = await axios.get(apiUrl, { params });

      if (availableRoomsResponse.status !== 200) {
        console.error(
          "Error fetching available rooms:",
          availableRoomsResponse.statusText
        );
        return false; // Unable to determine room availability
      }

      // Extract the available room IDs from the response
      const availableRoomIds = availableRoomsResponse.data.map(
        (room) => room._id
      );
      return availableRoomIds.includes(selectedRoomId);
    } catch (error) {
      console.error("Error checking room availability:", error);
      return false; // Unable to determine room availability (consider handling errors more specifically)
    }
  };
  const [roomAvailability, setRoomAvailability] = useState({});

  const fetchRoomAvailability = async () => {
    try {
      // Check if room availability data is already cached
      const cachedAvailability = localStorage.getItem("roomAvailability");
      if (cachedAvailability) {
        setRoomAvailability(JSON.parse(cachedAvailability));
      } else {
        const currentDate = new Date().toLocaleDateString();
        const startTime = "9:00";
        const endTime = "5:00";

        const availabilityData = await Promise.all(
          rooms.map(async (room) => {
            const isAvailable = await checkRoomAvailability(
              room._id,
              currentDate,
              startTime,
              endTime
            );
            return {
              roomId: room._id,
              isAvailable,
            };
          })
        );

        // Convert the availability data to an object for easier access
        const availabilityObj = availabilityData.reduce((obj, item) => {
          obj[item.roomId] = item.isAvailable;
          return obj;
        }, {});

        // Update room availability state
        setRoomAvailability(availabilityObj);

        // Cache room availability data
        localStorage.setItem(
          "roomAvailability",
          JSON.stringify(availabilityObj)
        );
      }
    } catch (error) {
      console.error("Error fetching room availability:", error);
    }
  };

  useEffect(() => {
    fetchRoomAvailability();

    // Refresh room availability every 5 minutes
    const intervalId = setInterval(fetchRoomAvailability, 5 * 60 * 1000);

    // Clean up interval
    return () => clearInterval(intervalId);
  }, []);

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
                <th>Actual Working Hours</th>
                <th>Availability</th>
              </tr>
            </thead>
            <tbody>
              {rooms.map((room, index) => {
                return (
                  <tr key={room._id} onClick={() => handleRowClick(room)}>
                    <td>{index + 1}</td>
                    <td>{room.name}</td>
                    <td>{room.capacity}</td>
                    <td>{room?.location?.name}</td>
                    <td>{room.description}</td>
                    <td>
                      {room?.actualWorkingHours?.from} to{" "}
                      {room?.actualWorkingHours?.to}
                    </td>
                    <td>
                      {roomAvailability[room._id]
                        ? "Available"
                        : "Not Available"}
                    </td>
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
              <p>Location: {selectedRoom?.location?.name}</p>
              <p>Description: {selectedRoom.description}</p>

              <Modal.Footer>
                <Button variant="success">
                  <Link
                    href={`/rooms/${selectedRoom._id}`}
                    className="text-decoration-none text-light"
                  >
                    View Room
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
            <Row>
              <Form.Group as={Col} sm={6}>
                <Form.Label>Actual Working Hours (From)</Form.Label>
                <Form.Control
                  type="time"
                  value={actualWorkingHours.from || ""} // Add a fallback value to prevent null/undefined
                  onChange={(event) =>
                    setActualWorkingHours((prev) => ({
                      ...prev,
                      from: event.target.value,
                    }))
                  }
                />
              </Form.Group>

              <Form.Group as={Col} sm={6}>
                <Form.Label>Actual Working Hours (To)</Form.Label>
                <Form.Control
                  type="time"
                  value={actualWorkingHours.to || ""} // Add a fallback value to prevent null/undefined
                  onChange={(event) =>
                    setActualWorkingHours((prev) => ({
                      ...prev,
                      to: event.target.value,
                    }))
                  }
                />
              </Form.Group>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Location</Form.Label>
              <Select
                options={branches.map((branch) => ({
                  value: branch._id,
                  label: branch.name,
                }))}
                onChange={(selectedOption) => setLocation(selectedOption.value)}
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
