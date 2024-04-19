import { useEffect, useState } from "react";
import axios from "axios";
import { AdminLayout } from "@layout";
import { Table, Card, Form } from "react-bootstrap";

const StudentsWithDue = () => {
  const [studentsWithDue, setStudentsWithDue] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterValue, setFilterValue] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("");
  const [levelOptions, setLevelOptions] = useState([]);
  const [batchOptions, setBatchOptions] = useState([]);
  const [allBatches, setAllBatches] = useState([]);  // Stores all batches

  const fetchStudentsWithDue = async () => {
    try {
      const response = await axios.get("/api/student");
      if (response.status === 200) {
        const studentsData = response.data.students;
        const studentsWithDue = studentsData.filter((student) => student.due > 0);
        setStudentsWithDue(studentsWithDue);
        setFilteredStudents(studentsWithDue);
      }
    } catch (error) {
      console.error("Error fetching students with due amounts:", error);
      setError("Failed to fetch students with due amounts. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const fetchLevels = async () => {
    try {
      const response = await axios.get("/api/level");
      if (response.status === 200) {
        const levelsData = response.data;
        setLevelOptions(levelsData.map((level) => level.name));
      }
    } catch (error) {
      console.error("Error fetching levels:", error);
    }
  };

  const fetchBatches = async () => {
    try {
      const response = await axios.get("/api/batch");
      if (response.status === 200) {
        setAllBatches(response.data);
        setBatchOptions(response.data.map(batch => batch.name)); // Initialize with all batches
      }
    } catch (error) {
      console.error("Error fetching batches:", error);
    }
  };

  useEffect(() => {
    fetchStudentsWithDue();
    fetchLevels();
    fetchBatches();
  }, []);

  useEffect(() => {
    if (selectedLevel) {
      console.log(selectedLevel);
      setBatchOptions(allBatches.filter(batch => batch.levelName === selectedLevel).map(batch => batch.name));
    } else {
      setBatchOptions(allBatches.map(batch => batch.name)); // Show all batches if no level is selected
    }
  }, [selectedLevel]);

  useEffect(() => {
    let filtered = studentsWithDue;

    if (selectedLevel) {
      filtered = filtered.filter(student => student.level === selectedLevel);
    }

    if (selectedBatch) {
      filtered = filtered.filter(student => student.batch === selectedBatch);
    }

    if (filterValue) {
      filtered = filtered.filter(student => 
        student.name.toLowerCase().includes(filterValue.toLowerCase()) ||
        (student.email && student.email.toLowerCase().includes(filterValue.toLowerCase())) ||
        (student.phoneNumber && student.phoneNumber.includes(filterValue)) ||
        (student.nationalId && student.nationalId.includes(filterValue))
      );
    }

    setFilteredStudents(filtered);
  }, [filterValue, selectedLevel, selectedBatch, studentsWithDue]);

  const handleFilterChange = (e) => {
    setFilterValue(e.target.value);
  };

  const handleLevelChange = (e) => {
    setSelectedLevel(e.target.value);
    console.log(selectedLevel)
  };

  const handleBatchChange = (e) => {
    setSelectedBatch(e.target.value);
  };

  return (
    <AdminLayout>
      <Card>
        <Card.Header>Students With Due Amount</Card.Header>
        <Card.Body>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <div className="mb-3" style={{ width: '33%' }}>
              <Form.Control
                type="text"
                placeholder="Search by name, email, phone number, or national ID"
                value={filterValue}
                onChange={handleFilterChange}
              />
            </div>
            <div className="mb-3" style={{ width: '33%' }}>
              <Form.Select onChange={handleLevelChange} value={selectedLevel}>
                <option value="">Select Level</option>
                {levelOptions.map((level, index) => (
                  <option key={index} value={level}>
                    {level}
                  </option>
                ))}
              </Form.Select>
            </div>
            <div className="mb-3" style={{ width: '33%' }}>
              <Form.Select onChange={handleBatchChange} value={selectedBatch}>
                <option value="">Select Batch</option>
                {batchOptions.map((batch, index) => (
                  <option key={index} value={batch}>
                    {batch}
                  </option>
                ))}
              </Form.Select>
            </div>
          </div>
          {loading ? (
            <p>Loading students...</p>
          ) : error ? (
            <p>{error}</p>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Phone Number</th>
                    <th>Email</th>
                    <th>National ID</th>
                    <th>Interested In Course</th>
                    <th>Status</th>
                    <th>Paid</th>
                    <th>Level</th>
                    <th>Due</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((student, index) => (
                    <tr key={student._id}>
                      <td>{index + 1}</td>
                      <td>{student.name}</td>
                      <td>{student.phoneNumber}</td>
                      <td>{student.email || "N/A"}</td>
                      <td>{student.nationalId || "N/A"}</td>
                      <td>{student.interestedInCourse || "N/A"}</td>
                      <td>{student.status}</td>
                      <td>{student.paid} EGP</td>
                      <td>{student.level || "N/A"}</td>
                      <td>{student.due} EGP</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </Card.Body>
      </Card>
    </AdminLayout>
  );
};

export default StudentsWithDue;
