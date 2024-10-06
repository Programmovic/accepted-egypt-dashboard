import React from 'react';
import { Table, Button, Form } from 'react-bootstrap';
import * as XLSX from 'xlsx';  // Import XLSX
import { saveAs } from 'file-saver';
import { toast } from 'react-toastify';

const DataTable = ({ filteredData, currentItems, salesMembers, paginationEnabled, handleUpdateMarketingData }) => {
  
  // Function to export the data to Excel
  const exportToExcel = () => {
    const worksheetData = (paginationEnabled ? currentItems : filteredData).map((item, index) => ({
      '#': index + 1,
      'Name': item.name,
      'Phone No1': item.phoneNo1,
      'Phone No2': item.phoneNo2,
      'Assign to': item.assignTo,
      'Chat Summary': item.chatSummary,
      'Source': item.Source,
      'Language Issues': item.languageIssues,
      'Assigned to Sales Member': item.assignedToSales,
      'Assignation Date': item.salesMemberAssignationDate
        ? new Date(item.salesMemberAssignationDate).toLocaleDateString()
        : '',
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Marketing Data');

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
            <th>Assign to</th>
            <th>Chat Summary</th>
            <th>Source</th>
            <th>Language Issues</th>
            <th>Assigned to Member</th>
            <th>Assignation Date</th>
          </tr>
        </thead>
        <tbody>
          {(paginationEnabled ? currentItems : filteredData)?.map((item, index) => (
            <tr key={index}>
              <td className={(index + 1 >= rangeStart && index + 1 <= rangeEnd) ? "bg-success text-light" : ""}>
                {index + 1}
              </td>
              <td>{item.name}</td>
              <td>{item.phoneNo1}</td>
              <td>{item.phoneNo2}</td>
              <td>{item.candidateSignUpFor}</td>
              <td>{item.chatSummary}</td>
              <td>{item.source}</td>
              <td>{item.languageIssues}</td>
              <td>
                <Form.Control
                  as="select"
                  value={item.assignedToSales}
                  onChange={(e) => {
                    const threeDaysInMillis = 3 * 24 * 60 * 60 * 1000; // 3 days in milliseconds
                    const timeSinceLastAssignation = new Date() - new Date(item.salesMemberAssignationDate);

                    if (item.assignedToSales && timeSinceLastAssignation < threeDaysInMillis) {
                      toast.error("You cannot reassign within 3 days of the last assignation.");
                    } else {
                      handleUpdateMarketingData(item._id, {
                        assignedToSales: e.target.value,
                        salesMemberAssignationDate: new Date(),
                      });
                    }
                  }}
                >
                  <option value="" hidden>Select a sales member</option>
                  {salesMembers.map((moderator) => (
                    <option key={moderator._id} value={moderator.name}>
                      {moderator.name}
                    </option>
                  ))}
                </Form.Control>
              </td>
              <td>{item.salesMemberAssignationDate && new Date(item.salesMemberAssignationDate).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default DataTable;
