import { Button, Typography, Avatar, IconButton, Paper } from "@mui/material";
import { ExpandMore as ExpandMoreIcon } from "@mui/icons-material";
import { PropsWithChildren, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import axios from "axios";

type ItemWithIconProps = {
  icon: React.ReactNode;
} & PropsWithChildren;

const ItemWithIcon = (props: ItemWithIconProps) => {
  const { icon, children } = props;

  return (
    <>
      {icon}
      {children}
    </>
  );
};

export default function HeaderProfileNav() {
  const [username, setUsername] = useState("");
  const [userRole, setUserRole] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [showPopover, setShowPopover] = useState(false);

  const logout = async () => {
    try {
      const res = await axios.post("/api/user/logout");
      if (res.status === 200) {
        router.push("/login");
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    // Retrieve the token from cookies
    const token = Cookies.get("client_token");

    if (!token) {
      // If the user is not signed in, redirect to the login page
      router.push("/login");
      return;
    }

    try {
      // Decode the token to access the username and user role
      const decodedToken = JSON.parse(atob(token.split(".")[1]));
      setUsername(decodedToken.username);
      setUserRole(decodedToken.role);
    } catch (error) {
      console.error("Error decoding token:", error);
    } finally {
      // Set loading to false after retrieving the username and user role
      setLoading(false);
    }
  }, []);

  const handleLogout = () => {
    logout();
    setShowPopover(false); // Close the popover after logout
  };

  return (
    <div style={{ position: "relative" }}>
      <Button
        onClick={() => setShowPopover(!showPopover)}
        startIcon={<Avatar>{username && username[0].toUpperCase()}</Avatar>}
        endIcon={<ExpandMoreIcon />}
        color="inherit"
        size="large"
      >
        {username} - {userRole}
      </Button>
      {showPopover && (
        <Paper
          style={{
            position: "absolute",
            top: "calc(100% + 8px)", // Adjust the distance from the button
            right: 0,
            zIndex: 1, // Ensure it's above other elements
            width: "200px", // Adjust the width as needed
            backgroundColor: "#fff", // Background color
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)", // Add shadow for depth
            borderRadius: "8px", // Rounded corners
            textAlign: "center",
            padding: "16px", // Padding
          }}
        >
          <Button
            variant="outlined"
            color="primary"
            style={{
              padding: "12px 16px", // Padding for menu items
              cursor: "pointer",
              transition: "background-color 0.3s ease", // Smooth transition
            }}
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Paper>
      )}
    </div>
  );
}
