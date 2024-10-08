import React, { useState } from 'react';
import { Form, Button, Alert, Row, Col } from 'react-bootstrap';

const ExcelUploadDownload = ({ handleDownloadTemplate, handleDataUpload, openModal }) => {
  return (
    <>
      <Form className="my-3 px-4 pt-3 pb-1" style={{ backgroundColor: "rgb(245, 245, 245)", borderRadius: "8px" }}>
        <Row className="mb-3">

          
          <Col className="d-flex align-items-end flex-column">
            <Button variant="dark" onClick={openModal} className="w-100 mb-2">
              Create Lead Manually
            </Button>
            <Button variant="dark" onClick={handleDownloadTemplate} className="w-100">
              Download Excel Template
            </Button>
          </Col>
          <Col xs={9} className='d-flex align-items-end '>
            <Form.Group controlId="fileUpload" className='w-100'>
              <Form.Label>Upload Excel File</Form.Label>
              <Form.Control type="file" accept=".xlsx, .xls" onChange={handleDataUpload} />
            </Form.Group>
          </Col>
        </Row>
      </Form>
    </>
  );
};

export default ExcelUploadDownload;
