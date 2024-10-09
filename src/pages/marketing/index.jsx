import { Card, Form, Button, Row, Col, Table, Overlay, Popover } from "react-bootstrap";
import { useEffect, useState, useRef } from "react";
import { AdminLayout } from "@layout";
import axios from "axios";
import { Modal } from "react-bootstrap";
import Select from "react-select";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { useRouter } from "next/navigation";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import RangeAssignment from "../../components/RangeAssignment";
import ExcelUploadDownload from "../../components/UploadExcel";
import TextField from "@mui/material/TextField";
import Papa from "papaparse";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import { Delete } from "@mui/icons-material";
import { Edit } from "@mui/icons-material";
import { ClassCard } from "@components/Classes";
import { Alert, Container } from 'react-bootstrap';
import DataTable from "../../components/MarketingDataTable";

const MarketingData = () => {
  const router = useRouter();
  const [marketingData, setMarketingData] = useState([]);
  const [candidateSignUpForData, setCandidateSignUpForData] = useState([]);
  const [salesModerators, setSalesModerators] = useState([]);
  const [salesMembers, setSalesMembers] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterName, setFilterName] = useState("");
  const [filterPhone, setFilterPhone] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [chatSummary, setChatSummary] = useState("");
  const [Source, setSource] = useState("");
  const [languageIssues, setLanguageIssues] = useState("");
  const [assignedToModeration, setAssignedToModeration] = useState("");
  const [assignationDate, setAssignationDate] = useState("");
  const [assignedToSales, setAssignedToSales] = useState("");
  const [searchTerm, setSearchTerm] = useState(""); // Added state for search term
  const [filterApplied, setFilterApplied] = useState(false); // Added state for filter applied
  const [showFilter, setShowFilter] = useState(false); // Added state for showing filter
  const filterRef = useRef(null); // Added ref for filter button
  const [editItem, setEditItem] = useState(null); // For managing the item being edited
  const [showModal, setShowModal] = useState(false); // To control the visibility of the modal
  const handleEdit = (item) => {
    // Set the item data to be edited
    setEditItem(item);
    // Set the form fields with existing data
    setNewName(item.name);
    setNewPhoneNo1(item.phoneNo1);
    setNewPhoneNo2(item.phoneNo2);
    setNewAssignTo(item.candidateSignUpFor);
    setNewSource(item.source);
    // Open the modal
    setShowModal(true);
  };

  const [newName, setNewName] = useState("");
  const [newPhoneNo1, setNewPhoneNo1] = useState("");
  const [newPhoneNo2, setNewPhoneNo2] = useState("");
  const [newAssignTo, setNewAssignTo] = useState("");
  const [newChatSummary, setNewChatSummary] = useState("");
  const [newSource, setNewSource] = useState("");
  const [newLanguageIssues, setNewLanguageIssues] = useState("");
  const [newAssignedToModeration, setNewAssignedToModeration] = useState("");
  const [newAssignationDate, setNewAssignationDate] = useState("");
  const [newAssignedToSales, setNewAssignedToSales] = useState("");
  const fetchMarketingData = async () => {
    toast.loading("Fetching marketing data...", { autoClose: false, toastId: "fetch-toast" }); // Show loading toast with a unique ID
    setLoading(true); // Set loading state to true

    try {
      const response = await axios.get("/api/marketing");
      console.log(response)
      if (response.status === 200) {
        const data = response.data;
        setMarketingData(data.marketingData);
        setSalesModerators(data.salesModerators.filter(s => s?.department?.name === "Sales"));
        setSalesMembers(data.salesMembers);
        setFilteredData(data.marketingData);
        toast.dismiss("fetch-toast"); // Dismiss loading toast
        toast.success("Marketing data fetched successfully!");
      }
    } catch (error) {
      toast.dismiss("fetch-toast"); // Dismiss loading toast
      toast.error("Failed to fetch marketing data. Please try again later.");
      console.error("Error fetching marketing data:", error);
      setError("Failed to fetch marketing data. Please try again later.");
    } finally {
      setLoading(false); // Set loading state to false
    }
  };

  const fetchCandidateSignUpForStatus = async () => {
    try {
      const response = await axios.get('/api/candidate_signup_for');
      if (response.status === 200) {
        setCandidateSignUpForData(response.data);
      }
    } catch (error) {
      console.error("Error fetching sales statuses:", error);
    }
  };

  useEffect(() => {
    fetchMarketingData();
    fetchCandidateSignUpForStatus()
  }, []);

  useEffect(() => {
    // Apply filters when filter inputs change
    handleFilter();
    setFilterApplied(true)
  }, [searchTerm, filterName, filterPhone, filterDate, assignedTo, Source, languageIssues, assignedToModeration, assignationDate, assignedToSales, marketingData]);

  const handleFilter = () => {
    let filteredMarketingData = [...marketingData];
    if (searchTerm) {
      filteredMarketingData = filteredMarketingData.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.phoneNo1.includes(searchTerm) ||
        item.phoneNo2.includes(searchTerm)
      );
    } else {
      setFilterApplied(false)
    }
    if (filterName) {
      filteredMarketingData = filteredMarketingData.filter((item) =>
        item.name.toLowerCase().includes(filterName.toLowerCase())
      );
    }

    if (filterDate) {
      filteredMarketingData = filteredMarketingData.filter((item) =>
        item.createdAt.includes(filterDate)
      );
    }

    if (assignedTo) {
      filteredMarketingData = filteredMarketingData.filter((item) =>
        item.candidateSignUpFor.toLowerCase().includes(assignedTo.toLowerCase())
      );
    }

    if (Source) {
      filteredMarketingData = filteredMarketingData.filter((item) =>
        item.source.toLowerCase().includes(Source.toLowerCase())
      );
    }

    if (languageIssues) {
      filteredMarketingData = filteredMarketingData.filter((item) =>
        item.languageIssues.toLowerCase().includes(languageIssues.toLowerCase())
      );
    }

    if (assignedToModeration) {
      filteredMarketingData = filteredMarketingData.filter((item) =>
        item?.assignedToModeration?.toLowerCase().includes(assignedToModeration.toLowerCase())
      );
    }

    if (assignationDate) {
      filteredMarketingData = filteredMarketingData.filter((item) =>
        item?.assignationDate?.includes(assignationDate)
      );
    }

    if (assignedToSales) {
      filteredMarketingData = filteredMarketingData.filter((item) =>
        item?.assignedToSales?.toLowerCase().includes(assignedToSales.toLowerCase())
      );
    }

    setFilteredData(filteredMarketingData);
  };

  const clearFilters = () => {
    setFilterName("");
    setFilterDate("");
    setFilterPhone("");
    setAssignedTo("");
    setSource("");
    setLanguageIssues("");
    setAssignedToModeration("");
    setAssignationDate("");
    setAssignedToSales("");
    setFilteredData(marketingData);
    setSearchTerm("");
    setFilterApplied(false);
  };

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);
  useEffect(() => {
    const keyPressEvent = (e) => {
      if (e.keyCode === 13 && showModal) {
        handleAddMarketingData()
      }
    };
    document.addEventListener('keydown', keyPressEvent, true);

    return () => {
      document.removeEventListener('keydown', keyPressEvent);
    };

  }, []);
  const handleAddMarketingData = async () => {

    try {
      if (!newName || !newPhoneNo1) {
        toast.error("Please fill all required fields.");
        return;
      }
      if (newPhoneNo1.length > 11 || newPhoneNo1.length < 11) {
        toast.error("Phone must be at least 11 digits.");
        return;
      }
      await axios.post("/api/marketing", {
        name: newName,
        phoneNo1: newPhoneNo1,
        phoneNo2: newPhoneNo2,
        candidateSignUpFor: newAssignTo,
        chatSummary: newChatSummary,
        source: newSource,
        languageIssues: newLanguageIssues,
        assignedToModeration: newAssignedToModeration,
        assignationDate: newAssignationDate,
        assignedToSales: newAssignedToSales,
      });
      closeModal();
      fetchMarketingData();
      toast.success("Marketing data added successfully!");
    } catch (error) {
      console.error("Error adding marketing data:", error.message);
      setError("Failed to add marketing data. Please try again.");
      toast.error(error.message);
    }
  };
  const handleUpdateMarketingData = async (item, updatedData) => {
    // Display a loading toast
    const toastId = toast.loading("Updating marketing data...");

    try {
      const response = await axios.put(`/api/marketing?id=${item}`, updatedData); // Send the PUT request with ID and updated data
      closeModal();
      fetchMarketingData(); // Refetch the data to reflect changes

      // Update the toast to success
      toast.update(toastId, {
        render: "Marketing data updated successfully!",
        type: "success",
        isLoading: false,
        autoClose: 3000, // Automatically close the toast after 3 seconds

      });
    } catch (error) {
      closeModal();
      fetchMarketingData();

      // Handle and display specific error messages
      if (error.response && error.response.status === 400) {
        const errorData = error.response.data;

        if (errorData.error === "Phone number already exists in another record") {
          // Update the toast to show an error
          toast.update(toastId, {
            render: errorData.error,
            type: "error",
            isLoading: false,
            autoClose: 3000,

          });
        } else {
          // General error message for failure
          toast.update(toastId, {
            render: "Failed to update marketing data. Please try again.",
            type: "error",
            isLoading: false,
            autoClose: 3000,

          });
        }
      } else {
        // Handle other types of errors (e.g., server errors)
        toast.update(toastId, {
          render: "An unexpected error occurred. Please try again.",
          type: "error",
          isLoading: false,
          autoClose: 3000,

        });
      }
    }
  };



  const handleDeleteMarketingData = async (id) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this marketing data?");

    if (!isConfirmed) return; // Do nothing if the user cancels

    try {
      await axios.delete(`/api/marketing?id=${id}`);
      closeModal();
      fetchMarketingData(); // Refresh the data after deletion
      toast.success("Marketing data deleted successfully!");
    } catch (error) {
      console.error("Error deleting marketing data:", error.message);
      setError("Failed to delete marketing data. Please try again.");
      toast.error(error.message);
    }
  };



  const [messages, setMessages] = useState({ errors: [], successes: [] }); // State for storing messages

  const handleFileUpload = async (event) => {
    const fileInput = event.target;
    const file = fileInput.files[0];

    if (!file) {
      setMessages((prev) => ({
        ...prev,
        errors: [...prev.errors, "Error: No file selected."],
      }));
      return;
    }

    const reader = new FileReader();

    reader.onload = async (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        console.log("Parsed JSON data:", jsonData);

        // Function to normalize Arabic numbers to Western digits
        const normalizeNumber = (number) => {
          const arabicToWesternMap = {
            '٠': '0', '١': '1', '٢': '2', '٣': '3', '٤': '4',
            '٥': '5', '٦': '6', '٧': '7', '٨': '8', '٩': '9',
          };
          return number.replace(/[٠-٩]/g, (digit) => arabicToWesternMap[digit]);
        };

        // Function to check if the phone number contains only digits
        const isValidPhoneNumber = (number) => /^[0-9]+$/.test(number);

        for (const dataItem of jsonData) {
          console.log("Processing item:", dataItem);

          // Normalize and ensure phone numbers are strings for manipulation
          let phoneNo1 = dataItem.phoneNo1 ? normalizeNumber(dataItem.phoneNo1.toString()) : "";
          let phoneNo2 = dataItem.phoneNo2 ? normalizeNumber(dataItem.phoneNo2.toString()) : "";

          // Validate that phone numbers contain only digits
          if (!isValidPhoneNumber(phoneNo1) || (phoneNo2 && !isValidPhoneNumber(phoneNo2))) {
            setMessages((prev) => ({
              ...prev,
              errors: [
                ...prev.errors,
                `Error: Phone number for ${dataItem.name} contains invalid characters. It must contain only digits.`,
              ],
            }));
            continue;
          }

          // Add leading zero if the phone number is less than 11 digits and does not start with zero
          if (phoneNo1.length < 11 && !phoneNo1.startsWith("0")) {
            phoneNo1 = "0" + phoneNo1;
          }
          if (phoneNo2 && phoneNo2.length < 11 && !phoneNo2.startsWith("0")) {
            phoneNo2 = "0" + phoneNo2;
          }

          // Update dataItem with formatted phone numbers
          dataItem.phoneNo1 = phoneNo1;
          dataItem.phoneNo2 = phoneNo2;
          // Function to check if a value is a serial number date from Excel
          const isExcelDate = (value) => {
            return typeof value === "number";
          };

          // Function to convert Excel serial date to JavaScript Date
          const excelDateToJSDate = (serial) => {
            const excelBaseDate = new Date(1899, 11, 30); // Excel base date is December 30, 1899
            const date = new Date(excelBaseDate.getTime() + serial * 24 * 60 * 60 * 1000);
            return date;
          };
          // Check and process 'createdAt' date
          if (dataItem.createdAt) {
            if (isExcelDate(dataItem.createdAt)) {
              // If it's an Excel serial number, convert it to a JS Date object
              dataItem.createdAt = excelDateToJSDate(dataItem.createdAt);
            } else {
              // If it's already in a date format (like MM/DD/YYYY), parse it directly
              dataItem.createdAt = new Date(dataItem.createdAt);
            }
          } else {
            // Handle missing date case if needed
            setMessages((prev) => ({
              ...prev,
              errors: [
                ...prev.errors,
                `Error: Missing 'createdAt' value for ${dataItem.name || "unknown name"}.`,
              ],
            }));
            continue;
          }
          if (!dataItem.name || !dataItem.phoneNo1) {
            setMessages((prev) => ({
              ...prev,
              errors: [
                ...prev.errors,
                `Error: Missing required fields in item for ${dataItem.name || "unknown name"}.`,
              ],
            }));
            continue;
          }

          // Validate phone numbers
          if (dataItem.phoneNo1.length !== 11) {
            setMessages((prev) => ({
              ...prev,
              errors: [
                ...prev.errors,
                `Error: Phone number for ${dataItem.name} must be exactly 11 digits.`,
              ],
            }));
            continue;
          }

          if (dataItem.phoneNo2 && dataItem.phoneNo2.length !== 11) {
            setMessages((prev) => ({
              ...prev,
              errors: [
                ...prev.errors,
                `Error: Secondary phone number for ${dataItem.name} must be exactly 11 digits if provided.`,
              ],
            }));
            continue;
          }

          if (dataItem.phoneNo2 && dataItem.phoneNo1 === dataItem.phoneNo2) {
            setMessages((prev) => ({
              ...prev,
              errors: [
                ...prev.errors,
                `Error: Phone numbers for ${dataItem.name} must be different.`,
              ],
            }));
            continue;
          }

          try {
            const existingItem = await axios.post(
              "/api/marketing/check-duplicates",
              {
                phoneNo1: dataItem.phoneNo1,
                phoneNo2: dataItem.phoneNo2,
              }
            );

            console.log("Check duplicate response:", existingItem.data);

            if (existingItem.data.exists) {
              setMessages((prev) => ({
                ...prev,
                errors: [
                  ...prev.errors,
                  `Error: An item with phone number ${dataItem.phoneNo1} or ${dataItem.phoneNo2} already exists.`,
                ],
              }));
              continue;
            }

            await axios.post("/api/marketing", dataItem);
            setMessages((prev) => ({
              ...prev,
              successes: [
                ...prev.successes,
                `${dataItem.name} has been added successfully.`,
              ],
            }));
          } catch (error) {
            setMessages((prev) => ({
              ...prev,
              errors: [
                ...prev.errors,
                `Error adding data for ${dataItem.name}: ${error.message}`,
              ],
            }));
          }
        }

        try {
          await fetchMarketingData();
          toast.success("Marketing data upload process completed!");
        } catch (fetchError) {
          setMessages((prev) => ({
            ...prev,
            errors: [
              ...prev.errors,
              `Error fetching marketing data: ${fetchError.message}`,
            ],
          }));
        }
      } catch (error) {
        setMessages((prev) => ({
          ...prev,
          errors: [
            ...prev.errors,
            `Error processing the uploaded file: ${error.message}`,
          ],
        }));
      } finally {
        fileInput.value = "";
      }
    };

    reader.onerror = (error) => {
      setMessages((prev) => ({
        ...prev,
        errors: [
          ...prev.errors,
          `Error reading the file: ${error.message}`,
        ],
      }));
    };

    reader.readAsArrayBuffer(file);
  };






  const downloadTemplate = () => {
    const templateData = [
      {
        createdAt: "",
        name: "",
        phoneNo1: "",
        phoneNo2: "",
        candidateSignUptFor: "",
        source: "",
      },
    ];

    const worksheet = XLSX.utils.json_to_sheet(templateData);
    const workbook = { Sheets: { data: worksheet }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "MarketingDataTemplate.xlsx");
  };
  const handleRangeAssign = async (rangeStart, rangeEnd, selectedSalesMember) => {
    if (!rangeStart || !rangeEnd || !selectedSalesMember) {
      toast.error("Please fill in all range fields and select a sales member.");
      return;
    }

    const start = parseInt(rangeStart) - 1;
    const end = parseInt(rangeEnd);

    if (start >= 0 && end <= filteredData.length && start < end) {
      const updates = filteredData.slice(start, end).map((item) =>
        handleUpdateMarketingData(item._id, {
          assignedToModeration: selectedSalesMember,
          assignationDate: new Date(),
        })
      );
      await Promise.all(updates);
      toast.success("Assigned sales member to specified range successfully!");
    } else {
      toast.error("Invalid range.");
    }
  };
  const exportToExcel = () => {
    const headers = [
      "Name", "Phone No. 1", "Phone No. 2", "Assign To", "Source", "Language Issues", "Assigned To Moderation", "Assignation Date", "Assigned To Sales"
    ];
    const data = filteredData.map(item => [
      item.name, item.phoneNo1, item.phoneNo2, item.candidateSignUpFor, item.source, item.languageIssues, item.assignedToModeration, item.assignationDate, item.assignedToSales
    ]);

    const worksheet = XLSX.utils.aoa_to_sheet([headers, ...data]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Marketing Data");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const dataBlob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(dataBlob, "marketing_data.xlsx");
  };
  const closeAllToasts = () => {
    toast.dismiss();

  };
  return (
    <AdminLayout>
      <Button variant="outline-secondary" className="mb-3" onClick={() => {
        closeAllToasts();
        setMessages({ errors: [], successes: [] })
      }}>
        Clear
      </Button>


      <Row>
        <ClassCard
          data={marketingData.length}
          title="Total Leads"
          enableOptions={false}
          isLoading={loading}
        />
        <ClassCard
          data={marketingData.filter(lead => lead.assignedToModeration).length}
          title="Total Assigned Leads"
          enableOptions={false}
          isLoading={loading}
        />
        <ClassCard
          data={marketingData.filter(lead => lead.candidateSignUpFor === "E3WFS").length}
          title="Total Leads For EWFS"
          enableOptions={false}
          isLoading={loading}
        />
        <ClassCard
          data={marketingData.filter(lead => lead.candidateSignUpFor === "Recruitment").length}
          title="Total Leads For Recruitment"
          enableOptions={false}
          isLoading={loading}
        />
      </Row>

      <Modal show={showModal} onHide={closeModal} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>{editItem ? "Edit Lead" : "Add Lead"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form style={{ maxHeight: "500px", overflowY: 'auto', padding: "5px 5px" }}>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Phone no1</Form.Label>
              <Form.Control
                type="text"
                value={newPhoneNo1}
                onChange={(e) => setNewPhoneNo1(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Phone no2</Form.Label>
              <Form.Control
                type="text"
                value={newPhoneNo2}
                onChange={(e) => setNewPhoneNo2(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="me-2">Candidate Signed Up For</Form.Label>
              <div className="d-flex flex-grow-1">
                <Form.Control
                  as="select"
                  value={newAssignTo}
                  onChange={(e) => setNewAssignTo(e.target.value)}
                  className="me-2"
                >
                  <option value="" hidden>Select an option</option>
                  {candidateSignUpForData.map((status) => (
                    <option key={status._id} value={status.status}>
                      {status.status}
                    </option>
                  ))}
                </Form.Control>
                <Link href={`/sales_status?selected=candidate_signup_for`} target="_blank">
                  <Button variant="outline-primary"><AddOutlinedIcon /></Button>
                </Link>
              </div>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Source</Form.Label>
              <Form.Control
                as="select"
                value={newSource}
                onChange={(e) => setNewSource(e.target.value)}
              >
                <option value="" hidden>Select a source</option>
                <option value="Facebook">Facebook</option>
                <option value="Linkedin">LinkedIn</option>
                <option value="Instagram">Instagram</option>
                <option value="TikTok">TikTok</option>
                <option value="Organic">Organic</option>
                <option value="Other">Other</option>
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Close
          </Button>
          <Button
            variant="success"
            onClick={() => {
              if (editItem) {
                handleUpdateMarketingData(editItem._id, {
                  name: newName,
                  phoneNo1: newPhoneNo1,
                  phoneNo2: newPhoneNo2,
                  candidateSignUpFor: newAssignTo,
                  source: newSource,
                });
              } else {
                handleAddMarketingData();
              }
            }}
          >
            {editItem ? "Update Lead" : "Add Lead"}
          </Button>
        </Modal.Footer>

      </Modal>
      <div className="d-flex justify-content-between " style={{ backgroundColor: '#f5f5f5', padding: '10px', borderRadius: '8px' }}>

        <TextField
          id="outlined-basic"
          label="Search"
          variant="outlined"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          fullWidth // Adjust based on your layout needs

        />
        <Button
          variant={filterApplied ? "warning" : "primary"}
          onClick={() => setShowFilter(!showFilter)}
          ref={filterRef}
          className="ms-2 "
        >
          <FilterAltIcon style={{ color: filterApplied ? 'yellow' : 'white' }} />
        </Button>

        <Overlay
          show={showFilter}
          target={filterRef.current}
          placement="bottom"
          className="popover-arrow"
        >
          <Popover id="popover-contained" style={{ maxHeight: '400px', overflowY: "auto", minWidth: '800px' }}>
            <Popover.Header as="h3">Customize Filters</Popover.Header>
            <Popover.Body>
              <Form>
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
                      <Form.Label>Filter by Date</Form.Label>
                      <Form.Control
                        type="date"
                        value={filterDate}
                        onChange={(e) => setFilterDate(e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                  <Col xs={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Filter by Phone Number</Form.Label>
                      <Form.Control
                        type="text"
                        value={filterPhone}
                        onChange={(e) => setFilterPhone(e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                  <Col xs={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Filter by Assigned To</Form.Label>
                      <Form.Control
                        type="text"
                        value={assignedTo}
                        onChange={(e) => setAssignedTo(e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                  <Col xs={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Filter by Source</Form.Label>
                      <Form.Control
                        type="text"
                        value={Source}
                        onChange={(e) => setSource(e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                  <Col xs={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Filter by Language Issues</Form.Label>
                      <Form.Control
                        type="text"
                        value={languageIssues}
                        onChange={(e) => setLanguageIssues(e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col xs={12} className="d-flex justify-content-between">
                    <Button variant="secondary" onClick={clearFilters}>
                      Clear Filters
                    </Button>
                    <Button
                      variant="primary"
                      onClick={() => {
                        handleFilter();
                        setShowFilter(false);
                      }}
                    >
                      Apply Filters
                    </Button>
                  </Col>
                </Row>
              </Form>
            </Popover.Body>
          </Popover>
        </Overlay>

      </div>
      <RangeAssignment salesMembers={salesModerators} handleRangeAssign={handleRangeAssign} />
      <ExcelUploadDownload openModal={openModal} handleDownloadTemplate={downloadTemplate} handleDataUpload={handleFileUpload} />
      <Container>
        {/* Scrollable Error Container */}
        <div className="px-5 py-3" style={{ maxHeight: '200px', overflowY: 'auto', marginBottom: '1rem', backgroundColor: "rgb(245, 245, 245)", borderRadius: "8px" }}>
          {messages.errors.length > 0 && messages.errors.map((msg, index) => (
            <Alert key={index} variant="danger">
              {msg}
            </Alert>
          ))}
        </div>

        {/* Success Messages */}
        {messages.successes.length > 0 && (
          <div className="px-5 py-3" style={{ maxHeight: '200px', overflowY: 'auto', marginBottom: '1rem', backgroundColor: "rgb(245, 245, 245)", borderRadius: "8px" }}>
            {messages.successes.map((msg, index) => (
              <Alert key={index} variant="success">
                {msg}
              </Alert>
            ))}
          </div>
        )}
      </Container>
      <Card>
        <Card.Header className="d-flex align-items-center">
          <div className="w-50">Marketing Leads</div>

        </Card.Header>
        <Card.Body>

          {loading ? (
            <p>Loading marketing data...</p>
          ) : error ? (
            <p>{error}</p>
          ) : (
            <div style={{ overflowX: "auto", overflowY: 'auto', maxHeight: "900px" }}>
              <DataTable
                filteredData={filteredData}
                salesModerators={salesModerators}
                handleUpdateMarketingData={handleUpdateMarketingData}
                handleEdit={handleEdit}
                handleDeleteMarketingData={handleDeleteMarketingData}
              />
            </div>
          )}
        </Card.Body>
      </Card>
    </AdminLayout>
  );
};

export default MarketingData;
