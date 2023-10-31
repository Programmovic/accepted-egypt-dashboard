import { Card, Form, Button, Row, Col, Table, Badge } from "react-bootstrap";
import { useEffect, useState } from "react";
import { AdminLayout } from "@layout";
import axios from "axios";
import { ClassCard } from "@components/Classes";
import { Modal } from "react-bootstrap";
import Select from "react-select";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Classes = () => {
  const [classResource, setClassResource] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterTitle, setFilterTitle] = useState("");
  const [newClassTitle, setNewClassTitle] = useState("");
  const [price, setPrice] = useState("");
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [hours, setHours] = useState(null);
  const [instructors, setInstructors] = useState([]);
  const [instructorsData, setInstructorsData] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [showModal, setShowModal] = useState(false);
  const [filterCode, setFilterCode] = useState("");
  const [filterCost, setFilterCost] = useState("");
  const [filterInstructors, setFilterInstructors] = useState("");
  const [filterDescription, setFilterDescription] = useState("");
  
  const fetchClassData = async () => {
    try {
      const response = await axios.get("/api/class");
      if (response.status === 200) {
        const classData = response.data;
        setClassResource(classData);
        setFilteredData(classData);
      }
    } catch (error) {
      console.error("Error fetching class data:", error);
      setError("Failed to fetch class data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchClassData();
  }, []);

  useEffect(() => {
    // Automatically apply filters when filter inputs change
    handleFilter();
  }, [filterTitle, filterCode, filterCost, filterDescription, filterInstructors, startDate, endDate, sortBy, sortOrder, classResource]);

  const handleFilter = () => {
    let filteredClasses = [...classResource];

    if (filterTitle) {
      filteredClasses = filteredClasses.filter((cls) =>
        cls.name.toLowerCase().includes(filterTitle.toLowerCase())
      );
    }

    if (startDate || endDate) {
      filteredClasses = filteredClasses.filter((cls) => {
        const clsDate = new Date(cls.createdDate);
        return (
          (!startDate || new Date(startDate) <= clsDate) &&
          (!endDate || new Date(endDate) >= clsDate)
        );
      });
    }
    if (filterCode) {
      filteredClasses = filteredClasses.filter((cls) =>
        cls.code.toLowerCase().includes(filterCode.toLowerCase())
      );
    }

    if (filterCost) {
      filteredClasses = filteredClasses.filter(
        (cls) => cls.cost.toString().includes(filterCost)
      );
    }

    if (filterDescription) {
      filteredClasses = filteredClasses.filter((cls) =>
        cls.description.toLowerCase().includes(filterDescription.toLowerCase())
      );
    }

    if (filterInstructors.length > 0) {
      // Filter based on selected instructors
      filteredClasses = filteredClasses.filter((cls) =>
        filterInstructors.some((selectedInstructor) =>
          cls.instructors.some((instructor) => instructor.value === selectedInstructor.value)
        )
      );
    }

    setFilteredData(filteredClasses);
  };

  const handleSort = (criteria) => {
    if (criteria === sortBy) {
      // Toggle the sorting order if the same criteria is clicked again
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      // Change the sorting criteria
      setSortBy(criteria);
      setSortOrder("asc"); // Reset order to ascending when changing criteria
    }
  };
  const sortedCourses = [...filteredData].sort((a, b) => {
    const aValue = a[sortBy];
    const bValue = b[sortBy];

    if (sortOrder === "asc") {
      if (aValue < bValue) return -1;
      if (aValue > bValue) return 1;
      return 0;
    } else {
      if (aValue < bValue) return 1;
      if (aValue > bValue) return -1;
      return 0;
    }
  });
  const instructorIds = instructors.map((instructor) => instructor.value);
  const handleAddClass = async () => {
    try {
      await axios.post("/api/class", {
        name: newClassTitle,
        cost: price,
        code: code,
        description: description,
        hours: hours,
        instructors: instructorIds,
      });
      closeModal();
      fetchClassData();
      toast.success("Class added successfully!"); // Success toast
    } catch (error) {
      console.log("Error adding class:", error.message);
      setError("Failed to add the class. Please try again.");
      toast.error(error.message); // Error toast
    }
  };

  const clearFilters = () => {
    setFilterTitle("");
    setStartDate("");
    setEndDate("");
    setSortBy("");
    setSortOrder(1);
    setFilteredData(classResource);
  };
  const cheapestClass =
    filteredData.length > 0
      ? filteredData.reduce(
          (min, cls) => (cls.cost < min.cost ? cls : min),
          filteredData[0]
        )
      : null;
  const newestClass =
    filteredData.length > 0
      ? filteredData.reduce(
          (max, cls) =>
            new Date(cls.createdDate) > new Date(max.createdDate) ? cls : max,
          filteredData[0]
        )
      : null;
  const oldestClass =
    filteredData.length > 0
      ? filteredData.reduce(
          (min, cls) =>
            new Date(cls.createdDate) < new Date(min.createdDate) ? cls : min,
          filteredData[0]
        )
      : null;
  const highestPriceClass =
    filteredData.length > 0
      ? filteredData.reduce(
          (max, cls) => (cls.cost > max.cost ? cls : max),
          filteredData[0]
        )
      : null;
  const totalClassPrice = filteredData.reduce(
    (total, cls) => total + cls.cost,
    0
  );
  const openModal = () => setShowModal(true);
  const closeModal = () => {
    setShowModal(false);
    setNewClassTitle("");
    setPrice("");
  };
  const fetchInstructors = async () => {
    try {
      const response = await axios.get("/api/instructor");
      if (response.status === 200) {
        const instructorData = response.data;
        
        setInstructorsData(instructorData); // Set the fetched instructors in state
      }
    } catch (error) {
      console.error("Error fetching instructors:", error);
      // Handle the error here
    }
  };
  useEffect(() => {
    

    fetchInstructors();
  }, []);
  const getInstructorName = (instructorId) => {
    console.log(instructorId)
    const selectedInstructor = instructorsData.find(
      (instructor) => instructor._id === instructorId[0]
    );
    console.log(instructorId)
    return selectedInstructor ? selectedInstructor.name : 'Unknown'; // You can provide a default value like 'Unknown'
  };
  return (
    <AdminLayout>
      <ToastContainer />
      <Modal show={showModal} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>Create New Course</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Course Title</Form.Label>
              <Form.Control
                type="text"
                value={newClassTitle}
                onChange={(e) => setNewClassTitle(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Course Code</Form.Label>
              <Form.Control
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Course Cost</Form.Label>
              <Form.Control
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Course Description</Form.Label>
              <Form.Control
                as="textarea"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Course Hours</Form.Label>
              <Form.Control
                type="number"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
              />
            </Form.Group>
            
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Close
          </Button>
          <Button variant="success" onClick={handleAddClass}>
            Add Course
          </Button>
        </Modal.Footer>
      </Modal>

      <div className="row">
      <ClassCard
        data={filteredData.length}
        title="Courses"
        enableOptions={false}
        isLoading={loading}
      />
      <ClassCard
        data={cheapestClass?.name}
        title="Cheapest Course"
        enableOptions={false}
        isLoading={loading}
      />
      <ClassCard
        data={newestClass?.name}
        title="Newest Course"
        enableOptions={false}
        isLoading={loading}
      />
      <ClassCard
        data={oldestClass?.name}
        title="Oldest Course"
        enableOptions={false}
        isLoading={loading}
      />
      <ClassCard
        data={highestPriceClass?.name}
        title="Highest Price Course"
        enableOptions={false}
        isLoading={loading}
      />
      <ClassCard
        data={`${totalClassPrice} EGP`}
        title="Total Course Price"
        enableOptions={false}
        isLoading={loading}
      />
    </div>
      <Card>
        <Card.Header>Classes</Card.Header>
        <Card.Body>
          <Form className="mb-3">
            <Row>
              <Col xs={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Filter by Title</Form.Label>
                  <Form.Control
                    type="text"
                    value={filterTitle}
                    onChange={(e) => setFilterTitle(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col xs={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Filter by Start Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col xs={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Filter by End Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col xs={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Filter by Code</Form.Label>
                  <Form.Control
                    type="text"
                    value={filterCode}
                    onChange={(e) => setFilterCode(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col xs={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Filter by Cost</Form.Label>
                  <Form.Control
                    type="text"
                    value={filterCost}
                    onChange={(e) => setFilterCost(e.target.value)}
                  />
                </Form.Group>
              </Col>
              
              <Col xs={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Filter by Description</Form.Label>
                  <Form.Control
                    type="text"
                    value={filterDescription}
                    onChange={(e) => setFilterDescription(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col xs={6}>
                <Button variant="secondary" onClick={clearFilters}>
                  Clear Filters
                </Button>
              </Col>
              <Col xs={6}>
                <Button variant="success" onClick={openModal}>
                  Add New Class
                </Button>
                
              </Col>
            </Row>
          </Form>

          {loading ? (
            <p>Loading classes...</p>
          ) : error ? (
            <p>{error}</p>
          ) : (
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>#</th>
                  <th onClick={() => handleSort("name")}>Title</th>
                  <th>Cost (EGP)</th>
                  <th>Created Date</th>
                  <th>Code</th> {/* Add new column for "Code" */}
                  <th>Description</th> {/* Add new column for "Description" */}
                  <th>Hours</th> {/* Add new column for "Hours" */}
                  <th>Instructors</th> {/* Add new column for "Instructors" */}
                </tr>
              </thead>
              <tbody>
                {sortedCourses.map((cls, index) => (
                  <tr key={cls._id}>
                    <td>{index + 1}</td>
                    <td>{cls.name}</td>
                    <td>{cls.cost} EGP</td>
                    <td>{new Date(cls.createdDate).toLocaleDateString()}</td>
                    <td>{cls.code}</td> {/* Display "Code" */}
                    <td>{cls.description}</td> {/* Display "Description" */}
                    <td>{cls.hours}</td> {/* Display "Hours" */}
                    <td>
                      {cls.instructors.map((instructor, i) => (
                        <Badge
                            key={i}
                            pill
                            variant="primary"
                            className="me-2"
                          >
                            {getInstructorName(instructor)}
                          </Badge>
                      ))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>
    </AdminLayout>
  );
};

export default Classes;
