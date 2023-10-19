import {
  Badge,
  Card,
  Form,
  Button,
  Row,
  Col,
  Table,
  ListGroup,
} from "react-bootstrap";
import { useEffect, useState } from "react";
import { AdminLayout } from "@layout";
import axios from "axios";
import TimePicker from "react-time-picker";
import { ClassCard } from "@components/Classes";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Select from "react-select";

const Groups = () => {
  const [groupResource, setGroupResource] = useState([]);
  const [classList, setClassList] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterName, setFilterName] = useState("");
  const [newGroupName, setNewGroupName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedDays, setSelectedDays] = useState([]);
  const [newGroupSelectedDays, setNewGroupSelectedDays] = useState([]);
  const [weeklyTime, setWeeklyTime] = useState("");
  const [newGroupWeeklyTime, setNewGroupWeeklyTime] = useState("");
  const [capacity, setCapacity] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [sortOrder, setSortOrder] = useState(1);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  
  const fetchGroupData = async () => {
    try {
      const response = await axios.get("/api/group");
      if (response.status === 200) {
        const groupData = response.data;
        setGroupResource(groupData);
        setFilteredData(groupData);
      }
    } catch (error) {
      console.error("Error fetching group data:", error);
      setError("Failed to fetch group data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };
  const fetchClassesData = async () => {
    try {
      const class_response = await axios.get("/api/class");
      console.log(class_response);
      if (class_response.status === 200) {
        const classData = class_response.data;
        setClassList(classData);
      }
    } catch (error) {
      console.error("Error fetching group data:", error);
      setError("Failed to fetch group data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchGroupData();
    fetchClassesData();
  }, []);
  useEffect(() => {
    // Automatically apply filters when filter inputs change
    handleFilter();
  }, [filterName, selectedDays, weeklyTime, sortBy, sortOrder, groupResource]);

  const handleFilter = () => {
    let filteredGroups = [...groupResource];

    if (filterName) {
      filteredGroups = filteredGroups.filter((group) =>
        group.name.toLowerCase().includes(filterName.toLowerCase())
      );
    }

    if (selectedDays.length > 0) {
      filteredGroups = filteredGroups.filter((group) =>
        selectedDays.every((day) => group.weeklyDay.includes(day))
      );
    }

    if (weeklyTime) {
      filteredGroups = filteredGroups.filter((group) =>
        group.weeklyTime.toLowerCase().includes(weeklyTime.toLowerCase())
      );
    }

    if (sortBy === "capacity") {
      filteredGroups.sort((a, b) => (a.capacity - b.capacity) * sortOrder);
    } else if (sortBy === "createdDate") {
      filteredGroups.sort(
        (a, b) =>
          (new Date(a.createdDate) - new Date(b.createdDate)) * sortOrder
      );
    }

    setFilteredData(filteredGroups);
  };

  const handleSort = (field) => {
    if (field === sortBy) {
      setSortOrder(-sortOrder);
    } else {
      setSortBy(field);
      setSortOrder(1);
    }
  };
  const handleAddGroup = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/group", {
        name: newGroupName,
        description,
        weeklyDay: newGroupSelectedDays,
        weeklyTime: newGroupWeeklyTime,
        capacity,
        classId: selectedClass.value,
        startDate: startDate,
        endDate: endDate,
      });
      if (response.status === 201) {
        // Data added successfully
        fetchGroupData();
        fetchClassesData();
        setNewGroupName("");
        setDescription("");
        setSelectedDays([]);
        setNewGroupSelectedDays([]);
        setWeeklyTime("");
        setCapacity("");
        setSelectedClass("");
        toast.success("Group added successfully!", {
          position: "top-right",
          autoClose: 3000,
        });
      } else {
        // Handle other possible response status codes here
        console.error("Unexpected status code:", response.status);
      }
    } catch (error) {
      console.error("Error adding group:", error);
      setError("Failed to add the group. Please try again.");
      toast.error(error.message, {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };
  console.log(newGroupSelectedDays);
  const clearFilters = () => {
    setFilterName("");
    setSelectedDays([]);
    setWeeklyTime("");
    setSortBy("");
    setSortOrder(1);
    setFilteredData(groupResource);
  };
  const [editGroup, setEditGroup] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // ... existing code

  // Function to handle the "Edit" button click
  const handleEditClick = (group) => {
    setEditGroup(group);
    setIsEditing(true);

    // Fill the form fields with the group data
    setStartDate(group.startDate);
    setEndDate(group.endDate);
    setNewGroupName(group.name);
    setDescription(group.description);
    setNewGroupSelectedDays(group.weeklyDay);
    setNewGroupWeeklyTime(group.weeklyTime);
    setCapacity(group.capacity);
    setSelectedClass(group.classId);
  };

  // Function to handle the "Delete" button click
  const handleDeleteClick = async (group) => {
    try {
      // Send a request to delete the group by its ID
      await axios.delete(`/api/group/delete?id=${group._id}`);

      // Remove the deleted group from the filtered data
      setFilteredData((prevData) =>
        prevData.filter((item) => item._id !== group._id)
      );

      // Clear the edit form and reset edit state
      setIsEditing(false);
      setEditGroup(null);

      toast.success("Group deleted successfully!", {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (error) {
      console.error("Error deleting group:", error);
      toast.error("Failed to delete the group. Please try again.", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };
  const lowestCapacity =
    filteredData.length > 0
      ? filteredData.reduce(
          (min, cls) => (cls.capacity < min.capacity ? cls : min),
          filteredData[0]
        )
      : null;
  const highestCapacity =
    filteredData.length > 0
      ? filteredData.reduce(
          (min, cls) => (cls.capacity > min.capacity ? cls : min),
          filteredData[0]
        )
      : null;

  return (
    <AdminLayout>
      <div className="row">
        <ClassCard
          data={filteredData.length}
          title="Groups"
          enableOptions={false}
        />
        <ClassCard
          data={lowestCapacity?.name}
          title="Lowest Capacity"
          enableOptions={false}
        />
        <ClassCard
          data={highestCapacity?.name}
          title="Highest Capacity"
          enableOptions={false}
        />
        {/* Additional statistics or cards here if needed */}
      </div>
      <Card>
        <Card.Header>Groups</Card.Header>
        <Card.Body>
          <Form className="mb-3">
            <Row>
              <Col xs={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Filter by Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={filterName}
                    onChange={(e) => setFilterName(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col xs={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Weekly Day</Form.Label>
                  <Select
                    value={selectedDays.map((day) => ({
                      value: day,
                      label: day,
                    }))}
                    isMulti={true} // Enable multiple selection
                    options={[
                      "Monday",
                      "Tuesday",
                      "Wednesday",
                      "Thursday",
                      "Friday",
                      "Saturday",
                      "Sunday",
                    ].map((day) => ({
                      value: day,
                      label: day,
                    }))}
                    onChange={(selectedOptions) => {
                      const selectedDays = selectedOptions.map(
                        (option) => option.value
                      );
                      setSelectedDays(selectedDays);
                    }}
                    placeholder="Select one or more days"
                  />
                </Form.Group>
              </Col>

              <Col xs={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Filter by Weekly Time</Form.Label>
                  <Form.Control
                    type="text"
                    value={weeklyTime}
                    onChange={(e) => setWeeklyTime(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col xs={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Sort by</Form.Label>
                  <Form.Control
                    as="select"
                    value={sortBy}
                    onChange={(e) => handleSort(e.target.value)}
                  >
                    <option value="">None</option>
                    <option value="capacity">Capacity</option>
                    <option value="createdDate">Created Date</option>
                  </Form.Control>
                </Form.Group>
              </Col>
            </Row>
            <Button variant="secondary" onClick={clearFilters}>
              Clear Filters
            </Button>
          </Form>

          <Form className="mb-3" onSubmit={handleAddGroup}>
            <Row>
              <Col xs={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Start Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required // Add the required attribute
                  />
                </Form.Group>
              </Col>
              <Col xs={6}>
                <Form.Group className="mb-3">
                  <Form.Label>End Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    required // Add the required attribute
                  />
                </Form.Group>
              </Col>
              <Col xs={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Group Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={newGroupName}
                    onChange={(e) => setNewGroupName(e.target.value)}
                    required // Add the required attribute
                  />
                </Form.Group>
              </Col>
              <Col xs={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Weekly Day</Form.Label>
                  <Select
                    value={newGroupSelectedDays.map((day) => ({
                      value: day,
                      label: day,
                    }))}
                    isMulti={true} // Enable multiple selection
                    options={[
                      "Monday",
                      "Tuesday",
                      "Wednesday",
                      "Thursday",
                      "Friday",
                      "Saturday",
                      "Sunday",
                    ].map((day) => ({
                      value: day,
                      label: day,
                    }))}
                    onChange={(selectedOptions) => {
                      const selectedDays = selectedOptions.map(
                        (option) => option.value
                      );
                      setNewGroupSelectedDays(selectedDays);
                    }}
                    placeholder="Select one or more days"
                  />
                </Form.Group>
              </Col>

              <Col xs={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Weekly Time</Form.Label>
                  <Form.Control
                    type="text"
                    value={newGroupWeeklyTime}
                    onChange={(e) => setNewGroupWeeklyTime(e.target.value)}
                    required // Add the required attribute
                  />
                </Form.Group>
              </Col>
              <Col xs={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Capacity</Form.Label>
                  <Form.Control
                    type="number"
                    value={capacity}
                    onChange={(e) => setCapacity(e.target.value)}
                    required // Add the required attribute
                  />
                </Form.Group>
              </Col>
              <Col xs={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Class</Form.Label>
                  <Select
                    value={selectedClass}
                    onChange={(selectedOption) =>
                      setSelectedClass(selectedOption)
                    }
                    options={classList.map((cls) => ({
                      value: cls._id,
                      label: cls.title,
                    }))}
                    isClearable={true}
                    isSearchable={true}
                    placeholder="Select a Class"
                  />
                </Form.Group>
              </Col>
              <Col xs={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Group Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Button variant="success" type="submit">
              Add Group
            </Button>
          </Form>

          <Table striped bordered hover>
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Capacity</th>
                <th>Weekly Days</th>
                <th>Weekly Time</th>
                <th>Class</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Duration</th>
                <th>Days Remaining</th>
                <th>Created Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((group, index) => {
                const startDate = new Date(group.startDate);
                const endDate = new Date(group.endDate);
                const createdDate = new Date(group.createdDate);
                const currentDate = new Date();
                const duration = Math.ceil(
                  (endDate - startDate) / (1000 * 60 * 60 * 24)
                ); // Calculate duration in days
                const daysRemaining = Math.max(
                  0,
                  Math.ceil((endDate - currentDate) / (1000 * 60 * 60 * 24))
                ); // Calculate days remaining, ensure it's not negative

                return (
                  <tr key={group._id}>
                    <td>{index + 1}</td>
                    <td>{group.name}</td>
                    <td>{group.capacity}</td>
                    <td>
                      {group.weeklyDay.map((day) => (
                        <Badge
                          key={day}
                          pill
                          variant="primary"
                          className="me-2"
                        >
                          {day}
                        </Badge>
                      ))}
                    </td>
                    <td>{group.weeklyTime}</td>
                    <td>{group.className}</td>
                    <td>{startDate.toLocaleDateString()}</td>
                    <td>{endDate.toLocaleDateString()}</td>
                    <td>{duration} days</td>
                    <td>{daysRemaining} days</td>
                    <td>{createdDate.toLocaleDateString()}</td>
                    <td>
                      <Button
                        variant="info"
                        className="me-2"
                        onClick={() => handleEditClick(group)}
                      >
                        <faEdit />
                      </Button>
                      <Button
                        variant="danger"
                        onClick={() => handleDeleteClick(group)}
                      >
                        <faRecycle />
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
      <ToastContainer position="top-right" autoClose={3000} />
    </AdminLayout>
  );
};

export default Groups;
