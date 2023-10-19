import { Table } from "react-bootstrap";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";
import { Dropdown } from "react-bootstrap";

export default function UserList(props) {
  const { users } = props;
  const admins = users;

  const formatDateTime = (dateTimeString) => {
    const options = { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" };
    return new Date(dateTimeString).toLocaleString(undefined, options);
  };

  return (
    <Table responsive bordered hover>
      <thead className="bg-light">
        <tr>
          <th>#</th>
          <th>Username</th>
          <th className="text-center">Role</th>
          <th className="text-center">Date of Join</th>
          <th aria-label="Action" />
        </tr>
      </thead>
      <tbody>
        {admins?.map((user, index) => (
          <tr key={user._id}>
            <td>{index + 1}</td>
            <td>{user.username}</td>
            <td className="text-center">{user.role}</td>
            <td className="text-center">{formatDateTime(user.dateOfJoin)}</td>
            <td>
              <Dropdown align="center">
                <Dropdown.Toggle
                  as="button"
                  bsPrefix="btn"
                  className="btn-link rounded-0 text-black-50 shadow-none p-0"
                  id={`action-${user._id}`}
                >
                  <FontAwesomeIcon fixedWidth icon={faEllipsisVertical} />
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item href={`#/user-info-${user._id}`}>
                    Info
                  </Dropdown.Item>
                  <Dropdown.Item href={`#/user-edit-${user._id}`}>
                    Edit
                  </Dropdown.Item>
                  <Dropdown.Item
                    className="text-danger"
                    href={`#/user-delete-${user._id}`}
                  >
                    Delete
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
