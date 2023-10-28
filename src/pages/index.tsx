import type { NextPage } from "next";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowDown,
  faArrowUp,
  faDownload,
  faEllipsisVertical,
  faMars,
  faSearch,
  faUsers,
  faVenus,
} from "@fortawesome/free-solid-svg-icons";
import {
  Button,
  ButtonGroup,
  Card,
  Dropdown,
  ProgressBar,
} from "react-bootstrap";
import { Bar, Line } from "react-chartjs-2";
import {
  BarElement,
  CategoryScale,
  Chart,
  Filler,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
} from "chart.js";
import {
  faCcAmex,
  faCcApplePay,
  faCcPaypal,
  faCcStripe,
  faCcVisa,
  faFacebookF,
  faLinkedinIn,
  faTwitter,
} from "@fortawesome/free-brands-svg-icons";
import React from "react";
import { AdminLayout } from "@layout";
import axios from "axios";
import { useEffect, useState } from "react";
import { ClassCard } from "@components/Classes";
import { format, startOfWeek, endOfWeek, isWithinInterval } from "date-fns"; // Import date-fns functions

Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Filler
);

const random = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1) + min);

const Home: NextPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [users, setUsers] = useState(null);
  const [classes, setClasses] = useState(null);
  const [groups, setGroups] = useState(null);
  const [instructors, setInstructors] = useState(null);
  const [lectures, setLectures] = useState([]);
  const fetchData = async () => {
    try {
      const users_response = await axios.get("/api/user");
      setUsers(users_response.data.length);
      const classes_response = await axios.get("/api/class");
      setClasses(classes_response.data.length);
      const batches_response = await axios.get("/api/batch");
      setGroups(batches_response.data);
      const instructors_response = await axios.get("/api/instructor");
      setInstructors(instructors_response.data.length);
      const lectures_response = await axios.get("/api/lecture");
      setLectures(lectures_response.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
      setError("Failed to fetch user data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  const currentDate = new Date();
  const currentWeekStart = startOfWeek(currentDate, { weekStartsOn: 1 }); // Adjust week start as needed
  const currentWeekEnd = endOfWeek(currentDate, { weekStartsOn: 1 }); // Adjust week start as needed

  // Filter lectures that fall within the current week
  const upcomingLectures = lectures.filter((lecture) => {
    const lectureDate = new Date(lecture.weeklyHours.day); // Assuming lecture.weeklyHours.day is a date string

    // Check if the lecture date is within the current week
    return isWithinInterval(lectureDate, {
      start: currentWeekStart,
      end: currentWeekEnd,
    });
  });
  return (
    <AdminLayout>
      <div className="row">
        <ClassCard data={users} title={"Admins"} isLoading={loading} />
        <ClassCard data={classes} title={"Classes"} isLoading={loading} />
        {/* <ClassCard data={groups.length} title={"Batches"} isLoading={loading} /> */}
        <ClassCard
          data={instructors}
          title={"Instructors"}
          isLoading={loading}
        />
      </div>

      <div className="row">
        <div className="col-md-12">
          <h2>Upcoming Lectures for the Current Week</h2>
          <div className="table-responsive">
            <table className="table border mb-0">
              <thead className="table-light fw-semibold">
                <tr className="align-middle">
                  <th className="text-center">
                    <FontAwesomeIcon icon={faUsers} fixedWidth />
                  </th>
                  <th>Lecture Title</th>
                  <th>Batch</th>
                  <th>Hours</th>
                  <th>Cost</th>
                  <th>Day and Time</th>
                  <th>Lab</th>
                  <th>Description</th>
                  <th>Created Date</th>
                  <th aria-label="Action" />
                </tr>
              </thead>
              <tbody>
                {upcomingLectures.map((lecture: any, index) => (
                  <tr key={index} className="align-middle">
                    <td className="text-center">
                      {/* You can display lecture-specific icons or images here */}
                    </td>
                    <td>{lecture.name}</td>
                    <td>{lecture.batch ? lecture.batch.name : "N/A"}</td>
                    <td>{lecture.hours}</td>
                    <td>{lecture.cost}</td>
                    <td>
                      {`${format(lectureDate, "EEEE")}: From ${format(
                        lectureDate,
                        "HH:mm a"
                      )}`}
                    </td>
                    <td>{lecture.lab}</td>
                    <td>{lecture.description}</td>
                    <td>{lecture.createdDate}</td>
                    <td>
                      <Dropdown align="end">
                        {/* Dropdown actions for each lecture */}
                      </Dropdown>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className="row mt-5">
        <ClassCard data={users} title={"Admins"} isLoading={loading} />
        <ClassCard data={classes} title={"Classes"} isLoading={loading} />
        {/* <ClassCard data={groups.length} title={"Batches"} isLoading={loading} /> */}
        <ClassCard
          data={instructors}
          title={"Instructors"}
          isLoading={loading}
        />
      </div>

      <div className="row">
        {/* Your lecture table */}
        <div className="col-md-12">
          <div className="table-responsive">
            <table className="table border mb-0">
              <thead className="table-light fw-semibold">
                <tr className="align-middle">
                  <th className="text-center">
                    <FontAwesomeIcon icon={faUsers} fixedWidth />
                  </th>
                  <th>Lecture Title</th>
                  <th>Batch</th>
                  <th>Hours</th>
                  <th>Cost</th>
                  <th>Day and Time</th>
                  <th>Lab</th>
                  <th>Description</th>
                  <th>Created Date</th>
                  <th aria-label="Action" />
                </tr>
              </thead>
              <tbody>
                {lectures &&
                  lectures.map((lecture: any, index) => (
                    <tr key={index} className="align-middle">
                      <td className="text-center">
                        {/* You can display lecture-specific icons or images here */}
                      </td>
                      <td>{lecture.name}</td>
                      <td>{lecture.batch ? lecture.batch.name : "N/A"}</td>
                      <td>{lecture.hours}</td>
                      <td>{lecture.cost}</td>
                      <td>
                        {`${lecture.weeklyHours.day}: From ${lecture.weeklyHours.from} to ${lecture.weeklyHours.to}`}
                      </td>
                      <td>{lecture.lab}</td>
                      <td>{lecture.description}</td>
                      <td>{lecture.createdDate}</td>
                      <td>
                        <Dropdown align="end">
                          {/* Dropdown actions for each lecture */}
                        </Dropdown>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Home;
