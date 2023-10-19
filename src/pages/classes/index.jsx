import { Card, Form, Button, Row, Col, Table } from "react-bootstrap";
import { useEffect, useState } from "react";
import { AdminLayout } from "@layout";
import axios from "axios";
import { ClassCard } from "@components/Classes";

const Classes = () => {
  const [classResource, setClassResource] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterTitle, setFilterTitle] = useState("");
  const [newClassTitle, setNewClassTitle] = useState("");
  const [price, setPrice] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [sortOrder, setSortOrder] = useState(1);

  useEffect(() => {
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

    fetchClassData();
  }, []);

  useEffect(() => {
    // Automatically apply filters when filter inputs change
    handleFilter();
  }, [filterTitle, startDate, endDate, sortBy, sortOrder, classResource]);

  const handleFilter = () => {
    let filteredClasses = [...classResource];

    if (filterTitle) {
      filteredClasses = filteredClasses.filter((cls) =>
        cls.title.toLowerCase().includes(filterTitle.toLowerCase())
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

    if (sortBy === "price") {
      filteredClasses.sort((a, b) => (a.price - b.price) * sortOrder);
    } else if (sortBy === "createdDate") {
      filteredClasses.sort(
        (a, b) =>
          (new Date(a.createdDate) - new Date(b.createdDate)) * sortOrder
      );
    }

    setFilteredData(filteredClasses);
  };

  const handleSort = (field) => {
    if (field === sortBy) {
      setSortOrder(-sortOrder);
    } else {
      setSortBy(field);
      setSortOrder(1);
    }
  };

  const handleAddClass = async () => {
    try {
      await axios.post("/api/class", { title: newClassTitle, price });
      fetchClassData();
      setNewClassTitle("");
    } catch (error) {
      console.log("Error adding class:", error);
      setError("Failed to add the class. Please try again.");
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
          (min, cls) => (cls.price < min.price ? cls : min),
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
          (max, cls) => (cls.price > max.price ? cls : max),
          filteredData[0]
        )
      : null;
  const totalClassPrice = filteredData.reduce(
    (total, cls) => total + cls.price,
    0
  );

  return (
    <AdminLayout>
      <div className="row">
        <ClassCard
          data={filteredData.length}
          title="Classes"
          enableOptions={false}
          isLoading={loading}
        />
        <ClassCard
          data={cheapestClass?.title}
          title="Cheapest Class"
          enableOptions={false}
          isLoading={loading}
        />
        <ClassCard
          data={newestClass?.title}
          title="Newest Class"
          enableOptions={false}
          isLoading={loading}
        />
        <ClassCard
          data={oldestClass?.title}
          title="Oldest Class"
          enableOptions={false}
          isLoading={loading}
        />
        <ClassCard
          data={highestPriceClass?.title}
          title="Highest Price Class"
          enableOptions={false}
          isLoading={loading}
        />
        <ClassCard
          data={`${totalClassPrice} EGP`}
          title="Total Class Price"
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
                  <Form.Label>Sort by</Form.Label>
                  <Form.Control
                    as="select"
                    value={sortBy}
                    onChange={(e) => handleSort(e.target.value)}
                  >
                    <option value="">None</option>
                    <option value="price">Price</option>
                    <option value="createdDate">Created Date</option>
                  </Form.Control>
                </Form.Group>
              </Col>
            </Row>
            <Button variant="secondary" onClick={clearFilters}>
              Clear Filters
            </Button>
          </Form>

          <Form className="mb-3">
            <Row>
              <Col xs={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Class Title</Form.Label>
                  <Form.Control
                    type="text"
                    value={newClassTitle}
                    onChange={(e) => setNewClassTitle(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col xs={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Class Price</Form.Label>
                  <Form.Control
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Button variant="success" onClick={handleAddClass}>
              Add Class
            </Button>
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
                  <th>Title</th>
                  <th>Price</th>
                  <th>Created Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((cls, index) => (
                  <tr key={cls._id}>
                    <td>{index + 1}</td>
                    <td>{cls.title}</td>
                    <td>{cls.price}EGP</td>
                    <td>{new Date(cls.createdDate).toLocaleDateString()}</td>
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
