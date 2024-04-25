import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/free-regular-svg-icons";
import {
  faChevronUp,
  faUser,
  faSchool,
  faPeopleGroup,
  faClock,
  faEdit,
  faChalkboardTeacher,
  faPerson,
  faDollar,
  faHome,
  faHandsHelping,
  faLevelUp,
  faStore,
  faCamera,
  faTable,
  faComputer,
  faSearch,
  faInstitution,
} from "@fortawesome/free-solid-svg-icons";
import React, {
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  Accordion,
  AccordionContext,
  Badge,
  Button,
  Nav,
  useAccordionButton,
} from "react-bootstrap";
import classNames from "classnames";
import Link from "next/link";
import Cookies from "js-cookie";

type SidebarNavItemProps = {
  href: string;
  icon?: IconDefinition;
} & PropsWithChildren;

const SidebarNavItem = (props: SidebarNavItemProps) => {
  const { icon, children, href } = props;

  return (
    <Nav.Item>
      <Link href={href} passHref legacyBehavior>
        <Nav.Link className="px-3 py-2 d-flex align-items-center">
          {icon ? (
            <FontAwesomeIcon className="nav-icon ms-n3" icon={icon} />
          ) : (
            <span className="nav-icon ms-n3" />
          )}
          {children}
        </Nav.Link>
      </Link>
    </Nav.Item>
  );
};

const SidebarNavTitle = (props: PropsWithChildren) => {
  const { children } = props;

  return (
    <li className="nav-title px-3 py-2 mt-3 text-uppercase fw-bold">
      {children}
    </li>
  );
};

type SidebarNavGroupToggleProps = {
  eventKey: string;
  icon: IconDefinition;
  setIsShow: (isShow: boolean) => void;
} & PropsWithChildren;

const SidebarNavGroupToggle = (props: SidebarNavGroupToggleProps) => {
  // https://react-bootstrap.github.io/components/accordion/#custom-toggle-with-expansion-awareness
  const { activeEventKey } = useContext(AccordionContext);
  const { eventKey, icon, children, setIsShow } = props;

  const decoratedOnClick = useAccordionButton(eventKey);

  const isCurrentEventKey = activeEventKey === eventKey;

  useEffect(() => {
    setIsShow(activeEventKey === eventKey);
  }, [activeEventKey, eventKey, setIsShow]);

  return (
    <Button
      variant="link"
      type="button"
      className={classNames(
        "rounded-0 nav-link px-3 py-2 d-flex align-items-center flex-fill w-100 shadow-none",
        {
          collapsed: !isCurrentEventKey,
        }
      )}
      onClick={decoratedOnClick}
    >
      <FontAwesomeIcon className="nav-icon ms-n3" icon={icon} />
      {children}
      <div className="nav-chevron ms-auto text-end">
        <FontAwesomeIcon size="xs" icon={faChevronUp} />
      </div>
    </Button>
  );
};

type SidebarNavGroupProps = {
  toggleIcon: IconDefinition;
  toggleText: string;
} & PropsWithChildren;

const SidebarNavGroup = (props: SidebarNavGroupProps) => {
  const { toggleIcon, toggleText, children } = props;

  const [isShow, setIsShow] = useState(false);

  return (
    <Accordion
      as="li"
      bsPrefix="nav-group"
      className={classNames({ show: isShow })}
    >
      <SidebarNavGroupToggle
        icon={toggleIcon}
        eventKey="0"
        setIsShow={setIsShow}
      >
        {toggleText}
      </SidebarNavGroupToggle>
      <Accordion.Collapse eventKey="0">
        <ul className="nav-group-items list-unstyled">{children}</ul>
      </Accordion.Collapse>
    </Accordion>
  );
};

export default function SidebarNav() {
  const [username, setUsername] = useState("");
  const [userRole, setUserRole] = useState("");
  useEffect(() => {
    // Retrieve the token from cookies
    const token = Cookies.get("client_token");
  
    if (token) {
      try {
        // Decode the token to access the username and user role
        const decodedToken = JSON.parse(atob(token.split(".")[1]));
        setUsername(decodedToken.username);
        setUserRole(decodedToken.role);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    } else {
      console.log("No token found, using default values for username and user role.");
      setUsername("Guest");
      setUserRole("guest");
    }
  }, []);
  
  return (
    <ul className="list-unstyled">
      {/* Administration Category */}
      {userRole === "admin" && (
        <SidebarNavGroup toggleIcon={faUser} toggleText="Administration">
          <SidebarNavItem icon={faUser} href="/admins">
            Admins
          </SidebarNavItem>
          <SidebarNavItem icon={faInstitution} href="/branches">
            Branches
          </SidebarNavItem>
          <SidebarNavItem icon={faLevelUp} href="/levels">
            Levels
          </SidebarNavItem>
          <SidebarNavItem icon={faHome} href="/rooms">
            Rooms
          </SidebarNavItem>
          <SidebarNavItem icon={faTable} href="/schedule">
            Schedule
          </SidebarNavItem>
          <SidebarNavItem icon={faTable} href="/rooms_utilization">
            Rooms Utilization
          </SidebarNavItem>
          <SidebarNavItem icon={faSchool} href="/courses">
            Courses
          </SidebarNavItem>
          <SidebarNavItem icon={faStore} href="/sales_members">
            Sales Members
          </SidebarNavItem>
        </SidebarNavGroup>
      )}

      {/* Academic Category */}
      <SidebarNavGroup toggleIcon={faSchool} toggleText="Academic">
        <SidebarNavItem icon={faEdit} href="/placement_tests">
          Placement Test (EWF2 Test)
        </SidebarNavItem>
        <SidebarNavItem icon={faEdit} href="/progress_exit_tests">
          Progress / Exit Tests
        </SidebarNavItem>
        <SidebarNavItem icon={faPerson} href="/students">
          Students
        </SidebarNavItem>
        <SidebarNavItem icon={faClock} href="/waiting_list">
          Waiting List
        </SidebarNavItem>

        <SidebarNavItem icon={faCamera} href="/qr_code_attendance">
          Attendance Scanner
        </SidebarNavItem>

        <SidebarNavGroup toggleIcon={faPeopleGroup} toggleText="Batches">
          <SidebarNavItem icon={faPeopleGroup} href="/batches">
            All Batches
          </SidebarNavItem>
          <SidebarNavItem icon={faPeopleGroup} href="/ongoing_batches">
            Ongoing Batches
          </SidebarNavItem>
          <SidebarNavItem icon={faPeopleGroup} href="/finalized_batches">
            Finalized Batches
          </SidebarNavItem>
        </SidebarNavGroup>
        <SidebarNavItem icon={faChalkboardTeacher} href="/instructors">
          Instructors
        </SidebarNavItem>
        <SidebarNavItem icon={faPeopleGroup} href="/lectures">
          Lectures
        </SidebarNavItem>
      </SidebarNavGroup>
      {/* Inventory Category */}
      <SidebarNavGroup toggleIcon={faStore} toggleText="Inventory">
        <SidebarNavItem icon={faSearch} href="/inventory/laptops/scan">
          Scan
        </SidebarNavItem>
        <SidebarNavItem icon={faComputer} href="/inventory/laptops">
          Laptops
        </SidebarNavItem>
      </SidebarNavGroup>
      {/* Finance Category */}
      <SidebarNavGroup toggleIcon={faDollar} toggleText="Finance">
        <SidebarNavItem icon={faDollar} href="/payment_method">
          Payment Methods
        </SidebarNavItem>
        <SidebarNavItem icon={faDollar} href="/transactions">
          Transactions
        </SidebarNavItem>
        <SidebarNavItem icon={faDollar} href="/students_with_due">
          Students With Due
        </SidebarNavItem>
      </SidebarNavGroup>
      <SidebarNavGroup toggleIcon={faInstitution} toggleText="Human Resources">
        <SidebarNavItem icon={faPerson} href="/employees">
          Employees
        </SidebarNavItem>
      </SidebarNavGroup>
      <SidebarNavGroup toggleIcon={faHandsHelping} toggleText="Help">
        <SidebarNavItem icon={faHandsHelping} href="/">
          How to Use?
        </SidebarNavItem>
      </SidebarNavGroup>
    </ul>
  );
}
