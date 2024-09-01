import React, { useState } from 'react';
import { Form, Button, Alert, Row, Col } from 'react-bootstrap';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

const ExcelUploadDownload = ({ handleDownloadTemplate, handleDataUpload }) => {
  return (
    <>
      <Form className="my-3 px-4 pt-3 pb-1" style={{ backgroundColor: "rgb(245, 245, 245)", borderRadius: "8px" }}>
        <Row className="mb-3">

          <Col xs={9}>
            <Form.Group controlId="fileUpload">
              <Form.Label>Upload Excel File</Form.Label>
              <Form.Control type="file" accept=".xlsx, .xls" onChange={handleDataUpload} />
            </Form.Group>
          </Col>
          <Col className='d-flex align-items-end'>
            <Button variant="dark" onClick={handleDownloadTemplate} className="w-100">
              Download Excel Template
            </Button>
          </Col>
        </Row>
      </Form>
    </>
  );
};

export default ExcelUploadDownload;
