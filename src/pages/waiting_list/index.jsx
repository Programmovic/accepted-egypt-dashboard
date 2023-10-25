// WaitingList.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Button, Table, Modal } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AdminLayout } from "@layout";
import { useRouter } from "next/router"; // Import useRouter

const WaitingList = () => {
  const [waitingListItems, setWaitingListItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedWaitingListItem, setSelectedWaitingListItem] = useState(null);

  const fetchWaitingListData = async () => {
    try {
      const response = await axios.get("/api/waiting_list");
      if (response.status === 200) {
        setWaitingListItems(response.data.waiting_list);
      }
    } catch (error) {
      console.error("Error fetching waiting list data:", error);
      toast.error("Failed to fetch waiting list data. Please try again later.", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  useEffect(() => {
    fetchWaitingListData();
  }, []);

  const router = useRouter();

  const openWaitingListDetailsModal = (waitingListItem) => {
    setSelectedWaitingListItem(waitingListItem);
    setShowModal(true);
  };

  return (
    <AdminLayout>
      <Card>
        <Card.Header>Waiting List</Card.Header>
        <Card.Body>
          <Button
            variant="success"
            onClick={() => setShowModal(true)}
            className="mb-3"
          >
            Add to Waiting List
          </Button>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>#</th>
                <th>Student ID</th>
                <th>Student Name</th>
                <th>Date</th>
                {/* Add more table headers as needed */}
              </tr>
            </thead>
            <tbody>
              {waitingListItems.map((waitingListItem, index) => (
                <tr
                  key={waitingListItem._id}
                  onClick={() => openWaitingListDetailsModal(waitingListItem)}
                  style={{ cursor: "pointer" }}
                >
                  <td>{index + 1}</td>
                  <td>{waitingListItem.student}</td>
                  <td>{waitingListItem.studentName}</td>
                  <td>{new Date(waitingListItem.date).toLocaleDateString()}</td>
                  {/* Add more table cells for other waiting list item data */}
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
      <ToastContainer position="top-right" autoClose={3000} />
      {/* Modal for waiting list details */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Waiting List Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedWaitingListItem && (
            <div>
              <p>Student ID: {selectedWaitingListItem.student}</p>
              <p>Student Name: {selectedWaitingListItem.studentName}</p>
              <p>
                Date:{" "}
                {new Date(selectedWaitingListItem.date).toLocaleDateString()}
              </p>
              {/* Add other waiting list item details here */}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowModal(false)}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </AdminLayout>
  );
};

export default WaitingList;
