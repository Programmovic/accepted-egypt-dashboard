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

  // Function to generate a random dark background color
  const getRandomDarkBackgroundColor = () => {
    const minBrightness = 30; // Adjust this to control darkness
    const randomColor = () => Math.floor(Math.random() * 256);
    const r = randomColor();
    const g = randomColor();
    const b = randomColor();

    // Ensure the color is dark by checking its brightness
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    if (brightness < minBrightness) {
      return `rgb(${r},${g},${b})`;
    }

    // If the color is too bright, recursively call the function to try again
    return getRandomDarkBackgroundColor();
  };

  const cardStyle = {
    backgroundColor: getRandomDarkBackgroundColor(),
    height: "150px",
  };

  return (
    <div className="col-sm-6 col-lg-3">
      <Card text="white" className="mb-4" style={cardStyle}>
        {isLoading || !data ? (
          <div className="d-flex justify-content-center align-items-center h-100">
            <div className="spinner-border text-light" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <Card.Body className="pb-0 d-flex justify-content-between align-items-start" style={{ height: "100%" }}>
            <div style={{ height: "80%" }}>
              <div className="fs-4 fw-semibold">{data}</div>
              <div>{title}</div>
            </div>
            {enableOptions && (
              <Dropdown align="end">
                <Dropdown.Toggle
                  as="button"
                  bsPrefix="btn"
                  className="btn-link rounded-0 text-white shadow-none p-0"
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
        )}
      </Card>
    </div>
  );
}
