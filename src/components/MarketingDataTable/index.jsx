import React from 'react';
import { Table, Button, Form } from 'react-bootstrap';
import { Edit, Delete } from '@mui/icons-material';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { toast } from 'react-toastify';

const DataTable = ({ filteredData, salesModerators, handleUpdateMarketingData, handleEdit, handleDeleteMarketingData }) => {

  // Function to export the data to Excel
  const exportToExcel = () => {
    const worksheetData = filteredData.map((item, index) => ({
      '#': index + 1,
      'Name': item.name,
      'Phone No1': item.phoneNo1,
      'Phone No2': item.phoneNo2,
      'Candidate Signed Up For': item.candidateSignUpFor,
      'Source': item.source,
      'Assigned to Sales Supervisor': item.assignedToModeration,
      'Assignation Date': item.assignationDate ? new Date(item.assignationDate).toLocaleDateString() : '',
      'Created At': item.createdAt ? new Date(item.createdAt).toLocaleString() : '',
      'Last Updated': item.updatedAt ? new Date(item.updatedAt).toLocaleString() : '',
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Marketing Data');

    // Export to Excel
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, 'MarketingData.xlsx');
  };

  return (
    <div>
      <Button variant="success" className="mb-3" onClick={exportToExcel}>
        Export to Excel
      </Button>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Phone no1</th>
            <th>Phone no2</th>
            <th>Candidate Signed Up For</th>
            <th>Source</th>
            <th>Assigned to Sales Supervisor</th>
            <th>Assignation Date</th>
            <th>Created At</th>
            <th>Last Updated</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((item, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{item.name}</td>
              <td>{item.phoneNo1}</td>
              <td>{item.phoneNo2}</td>
              <td>{item.candidateSignUpFor}</td>
              <td>{item.source}</td>
              <td>
                <Form.Control
                  as="select"
                  value={item.assignedToModeration}
                  onChange={(e) => {
                    const threeDaysInMillis = 3 * 24 * 60 * 60 * 1000;
                    const timeSinceLastAssignation = new Date() - new Date(item.assignationDate);

                    if (item.assignedToModeration && timeSinceLastAssignation < threeDaysInMillis) {
                      toast.error("You cannot reassign within 3 days of the last assignation.");
                    } else {
                      handleUpdateMarketingData(item._id, {
                        assignedToModeration: e.target.value,
                        assignationDate: new Date(),
                      });
                    }
                  }}
                >
                  <option value="" hidden>Select a sales supervisor</option>
                  {salesModerators.map((moderator) => (
                    <option key={moderator._id} value={moderator.name}>
                      {moderator.name}
                    </option>
                  ))}
                </Form.Control>
              </td>

              <td>{item.assignationDate && new Date(item.assignationDate).toLocaleDateString()}</td>
              <td>{item.createdAt && new Date(item.createdAt).toLocaleString()}</td>
              <td>{item.updatedAt && new Date(item.updatedAt).toLocaleString()}</td>
              <td className="d-flex justify-content-between">
                <Button variant="warning" onClick={() => handleEdit(item)}><Edit style={{ color: 'white' }} /></Button>
                <Button variant="danger" className="ms-2" onClick={() => handleDeleteMarketingData(item._id)}><Delete style={{ color: 'white' }} /></Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default DataTable;
