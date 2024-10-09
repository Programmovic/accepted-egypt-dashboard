import React, { useState } from "react";
import { Switch, Checkbox, Divider } from "@mui/material";
import { styled } from "@mui/system";
import { Container, Row, Col, Button } from "react-bootstrap";
import { AdminLayout } from "@layout";

const PermissionSettingsComponent = () => {
  const [permissions, setPermissions] = useState({
    manageAdmins: false,
    manageBranches: false,
    manageCourses: false,
    viewSales: false,
    manageInventory: false,
    manageFinance: false,
    manageHR: false,
    viewHelp: false,
  });

  const [checkboxes, setCheckboxes] = useState([
    { id: 1, label: "Admin Tab", checked: false },
    { id: 2, label: "Marketing Tab", checked: false },
    { id: 3, label: "Sales Tab", checked: false },
    { id: 4, label: "Academic Tab", checked: false },
    { id: 5, label: "Inventory Tab", checked: false },
    { id: 6, label: "Finance Tab", checked: false },
    { id: 7, label: "HR Tab", checked: false },
    { id: 8, label: "Help Tab", checked: false },
  ]);

  const [error, setError] = useState("");

  const handlePermissionChange = (permission) => {
    setPermissions((prev) => ({
      ...prev,
      [permission]: !prev[permission],
    }));
    setError("");
  };

  const handleCheckboxChange = (id) => {
    setCheckboxes((prev) =>
      prev.map((checkbox) =>
        checkbox.id === id
          ? { ...checkbox, checked: !checkbox.checked }
          : checkbox
      )
    );
    setError("");
  };

  const handleSelectAll = () => {
    setCheckboxes((prev) =>
      prev.map((checkbox) => ({ ...checkbox, checked: true }))
    );
    setError("");
  };

  const handleDeselectAll = () => {
    setCheckboxes((prev) =>
      prev.map((checkbox) => ({ ...checkbox, checked: false }))
    );
    setError("");
  };

  const validateSettings = () => {
    if (Object.values(permissions).every((p) => !p)) {
      setError("Please enable at least one permission.");
      return false;
    }
    if (checkboxes.every((c) => !c.checked)) {
      setError("Please select at least one checkbox.");
      return false;
    }
    setError("");
    return true;
  };

  const StyledSection = styled("section")(({ theme }) => ({
    backgroundColor: "#ffffff",
    borderRadius: "8px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    padding: "24px",
    marginBottom: "24px",
    [theme.breakpoints.down("sm")]: {
      padding: "16px",
    },
  }));

  const StyledSwitch = styled(Switch)(({ theme }) => ({
    "& .MuiSwitch-switchBase.Mui-checked": {
      color: "#4caf50",
      "&:hover": {
        backgroundColor: "rgba(76, 175, 80, 0.08)",
      },
    },
    "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
      backgroundColor: "#4caf50",
    },
  }));

  const StyledCheckbox = styled(Checkbox)(({ theme }) => ({
    color: "#757575",
    "&.Mui-checked": {
      color: "#4caf50",
    },
  }));

  const ErrorMessage = styled("div")(({ theme }) => ({
    color: "#f44336",
    marginTop: "16px",
    fontWeight: "bold",
    textAlign: "center",
  }));

  return (
    <AdminLayout>
      <Container>
        <h1 className="mb-4">Permission Settings</h1>

        <StyledSection>
          <h2 className="mb-4">Access Permissions</h2>
          {Object.entries(permissions).map(([key, value], index, array) => (
            <React.Fragment key={key}>
              <Row className="align-items-center mb-3">
                <Col>
                  <label htmlFor={key} className="text-capitalize">
                    {key.replace(/([A-Z])/g, " $1").trim()}
                  </label>
                </Col>
                <Col xs="auto">
                  <StyledSwitch
                    checked={value}
                    onChange={() => handlePermissionChange(key)}
                    inputProps={{ "aria-label": key }}
                    id={key}
                  />
                </Col>
              </Row>
              {index < array.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </StyledSection>

        <StyledSection>
          <h2 className="mb-4">Data Access</h2>
          <div className="mb-3 d-flex justify-content-between">
            <Button variant="primary" onClick={handleSelectAll}>
              Select All
            </Button>
            <Button variant="secondary" onClick={handleDeselectAll}>
              Deselect All
            </Button>
          </div>
          {checkboxes.map((checkbox) => (
            <Row key={checkbox.id} className="align-items-center mb-2">
              <Col xs="auto">
                <StyledCheckbox
                  checked={checkbox.checked}
                  onChange={() => handleCheckboxChange(checkbox.id)}
                  inputProps={{ "aria-label": checkbox.label }}
                />
              </Col>
              <Col>
                <label>{checkbox.label}</label>
              </Col>
            </Row>
          ))}
        </StyledSection>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <Button
          onClick={validateSettings}
          variant="success"
          className="w-100 mt-4"
        >
          Save Settings
        </Button>
      </Container>
    </AdminLayout>
  );
};

export default PermissionSettingsComponent;
