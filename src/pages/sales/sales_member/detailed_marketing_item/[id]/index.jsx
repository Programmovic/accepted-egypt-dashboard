import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Table, Form, Button } from "react-bootstrap";
import { AdminLayout } from "@layout";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MarketingDataDetail = () => {
  const [marketingData, setMarketingData] = useState(null);
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const router = useRouter();
  const { id } = router.query;
  const apiUrl = `/api/marketing?id=${id}`; // Define the API route to fetch marketing data by ID
  const editing = true;

  useEffect(() => {
    const fetchMarketingData = async () => {
      try {
        const response = await axios.get(apiUrl);
        if (response.status === 200) {
          setMarketingData(response.data);
        }
      } catch (error) {
        console.error("Error fetching marketing data:", error);
      }
    };

    if (id) {
      fetchMarketingData();
    }
  }, [id, apiUrl]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMarketingData({ ...marketingData, [name]: value });
    setUnsavedChanges(true);
  };

  const handleSave = async () => {
    try {
      await axios.put(`/api/marketing?id=${id}`, marketingData);
      setUnsavedChanges(false);
      toast.success("Marketing data saved successfully!");
    } catch (error) {
      console.error("Error saving marketing data:", error.message);
      toast.error(error.message);
    }
  };

  if (!marketingData) {
    return <p>Loading...</p>;
  }

  return (
    <AdminLayout>
      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <span>Marketing Data Details</span>{" "}
          <span>
            Last Updated: {new Date(marketingData.updatedAt).toLocaleString()}
          </span>
          <Button variant="primary" onClick={handleSave} disabled={!unsavedChanges}>
            Save
          </Button>
        </Card.Header>
        <Card.Body>
          <Table striped bordered hover>
            <tbody>
              <tr>
                <td>Name</td>
                <td>
                  {editing ? (
                    <Form.Control
                      type="text"
                      name="name"
                      value={marketingData.name}
                      onChange={handleChange}
                    />
                  ) : (
                    marketingData.name
                  )}
                </td>
              </tr>
              <tr>
                <td>Phone no1</td>
                <td>
                  {editing ? (
                    <Form.Control
                      type="text"
                      name="phoneNo1"
                      value={marketingData.phoneNo1}
                      onChange={handleChange}
                    />
                  ) : (
                    marketingData.phoneNo1
                  )}
                </td>
              </tr>
              <tr>
                <td>Phone no2</td>
                <td>
                  {editing ? (
                    <Form.Control
                      type="text"
                      name="phoneNo2"
                      value={marketingData.phoneNo2}
                      onChange={handleChange}
                    />
                  ) : (
                    marketingData.phoneNo2
                  )}
                </td>
              </tr>
              {/* <tr>
                <td>Assign to</td>
                <td>
                  {editing ? (
                    <Form.Control
                      type="text"
                      name="assignTo"
                      value={marketingData.assignTo}
                      onChange={handleChange}
                    />
                  ) : (
                    marketingData.assignTo
                  )}
                </td>
              </tr> */}
              <tr>
                <td>Chat Summary</td>
                <td>
                  {editing ? (
                    <Form.Control
                      as="textarea"
                      name="chatSummary"
                      value={marketingData.chatSummary}
                      onChange={handleChange}
                    />
                  ) : (
                    marketingData.chatSummary
                  )}
                </td>
              </tr>
              <tr>
                <td>Language Issues</td>
                <td>
                  {editing ? (
                    <Form.Control
                      as="textarea"
                      name="languageIssues"
                      value={marketingData.languageIssues}
                      onChange={handleChange}
                    />
                  ) : (
                    marketingData.languageIssues
                  )}
                </td>
              </tr>
              <tr>
                <td>Assigned to Sales Moderator</td>
                <td>
                  {marketingData.assignedToModeration} at{" "}
                  {new Date(marketingData.assignationDate).toLocaleString()}
                </td>
              </tr>
              <tr>
                <td>Assigned to Sales Member</td>
                <td>
                  {marketingData.assignedToSales} at{" "}
                  {new Date(
                    marketingData.salesMemberAssignationDate
                  ).toLocaleString()}
                </td>
              </tr>
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </AdminLayout>
  );
};

export default MarketingDataDetail;
