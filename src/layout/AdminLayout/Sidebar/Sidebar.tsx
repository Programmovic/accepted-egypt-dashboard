/* eslint-disable @next/next/no-img-element */
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import React, { useEffect, useState } from "react";
import classNames from "classnames";
import { Button } from "react-bootstrap";
import SidebarNav from "./SidebarNav";

export default function Sidebar(props: { isShow: boolean; isShowMd: boolean }) {
  const { isShow, isShowMd } = props;
  const [isNarrow, setIsNarrow] = useState(false);
  const logo = "/assets/img/Accepted logo trans.png"; // Adjust the import path according to your directory structure

  const toggleIsNarrow = () => {
    const newValue = !isNarrow;
    localStorage.setItem("isNarrow", newValue ? "true" : "false");
    setIsNarrow(newValue);
  };

  // On first time load only
  useEffect(() => {
    if (localStorage.getItem("isNarrow")) {
      setIsNarrow(localStorage.getItem("isNarrow") === "true");
    }
  }, [setIsNarrow]);

  return (
    <div
      className={classNames("sidebar d-flex flex-column position-fixed h-100", {
        "sidebar-narrow": isNarrow,
        show: isShow,
        "md-hide": !isShowMd,
      })}
      id="sidebar"
    >
      <div className="bg-transparent sidebar-brand d-none d-md-flex">
        <div className="d-flex justify-content-center align-items-center w-100 py-2">
          {!isNarrow ? (
            <img
              src={logo}
              alt="Logo"
              className="img-fluid"
              style={{ maxHeight: "100px" }}
            />
          ) : (
            <img
              src="/assets/img/Accepted (2).png"
              alt="Logo"
              className="img-fluid rounded-circle shadow-lg"
              style={{ maxHeight: "100px" }}
            />
          )}
        </div>
      </div>

      <div className="sidebar-nav flex-fill">
        <SidebarNav />
      </div>

      <Button
        variant="link"
        className="sidebar-toggler d-none d-md-inline-block rounded-0 text-end pe-4 fw-bold shadow-none"
        onClick={toggleIsNarrow}
        type="button"
        aria-label="sidebar toggler"
      >
        <FontAwesomeIcon
          className="sidebar-toggler-chevron"
          icon={faAngleLeft}
          fontSize={24}
        />
      </Button>
    </div>
  );
}

export const SidebarOverlay = (props: {
  isShowSidebar: boolean;
  toggleSidebar: () => void;
}) => {
  const { isShowSidebar, toggleSidebar } = props;

  return (
    <div
      tabIndex={-1}
      aria-hidden
      className={classNames(
        "sidebar-overlay position-fixed top-0 bg-dark w-100 h-100 opacity-50",
        {
          "d-none": !isShowSidebar,
        }
      )}
      onClick={toggleSidebar}
    />
  );
};
