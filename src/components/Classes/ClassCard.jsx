import { Table } from "react-bootstrap";
import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";
import {
  Button,
  ButtonGroup,
  Card,
  Dropdown,
  ProgressBar,
} from "react-bootstrap";
import Link from "next/link";

export default function ClassCard(props) {
  const { title, data, enableOptions = true, isLoading } = props;


  return (
    <div className="col-sm-6 col-lg-4">
      <Card text="white" className="mb-4 border shadow-sm">
        <Card.Body
          className="pb-0 d-flex justify-content-between align-items-start text-dark"
        >
          
          <div className="col-12">
            <div className="border-start border-4 border-info px-3 mb-3">
              <small className="text-black-100">{title}</small>
              <div className="fs-5 fw-semibold">{data}</div>
            </div>
          </div>
          {enableOptions && (
            <Dropdown align="end">
              <Dropdown.Toggle
                as="button"
                bsPrefix="btn"
                className="btn-link rounded-0 text-dark shadow-none p-0"
                id="dropdown-chart1"
              >
                <FontAwesomeIcon fixedWidth icon={faEllipsisVertical} />
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item>
                  <Link href={`/${title.toLowerCase()}`}>See them</Link>
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          )}
        </Card.Body>
      </Card>
    </div>
  );
}
