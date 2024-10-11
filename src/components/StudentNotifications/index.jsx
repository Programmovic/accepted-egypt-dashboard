import React, { useEffect, useState } from 'react';
import { Box, Typography, IconButton, Popover, Badge } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications'; // Importing the notification icon
import axios from 'axios';

const StudentNotifications = ({ studentId }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null); // State for the popover anchor element

  // Function to fetch notifications from the API
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/notification/student_payment`, {
        params: { studentId }, // Pass studentId as a query parameter
      });
      setNotifications(response.data.notifications);
    } catch (err) {
      setError(err.message || 'Error fetching notifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (studentId) fetchNotifications();
  }, [studentId]);

  // Handle button click to open/close the notification menu
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget); // Set the anchor element
  };

  // Handle closing the notification menu
  const handleClose = () => {
    setAnchorEl(null);
  };

  // Determine if the popover is open
  const open = Boolean(anchorEl);

  return (
    <Box sx={{ position: 'relative', marginBottom: 2 }}>
      {/* Notification Icon with Badge */}
      <IconButton onClick={handleClick} color="primary">
        <Badge
          badgeContent={notifications.length} // Show the number of notifications
          color="error" // Badge color
        >
          <NotificationsIcon />
        </Badge>
      </IconButton>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom', // Start from the bottom of the icon
          horizontal: 'left', // Center horizontally
        }}
        transformOrigin={{
          vertical: 'top', // Align top of the popover with bottom of the icon
          horizontal: 'center', // Center the popover horizontally
        }}
      >
        <Box
          sx={{
            padding: 1,
            minWidth: 100, // Maintain minimum width
            maxHeight: 300, // Set max height for scrollability
            overflowY: 'auto', // Allow vertical scrolling
            overflowX: 'hidden', // Prevent horizontal overflow
            borderRadius: 1, // Rounded corners
            boxShadow: '0 2px 10px rgba(0,0,0,0.2)', // Soft shadow
          }}
        >
          {loading && <Typography>Loading...</Typography>}
          {error && <Typography color="error">{error}</Typography>}

          {notifications.map((notification) => (
            <Box
              key={notification.studentId}
              sx={{
                padding: 1, // Padding for each notification
                borderRadius: 1,
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                backgroundColor: '#fff',
                border: '1px solid #e0e0e0',
                marginBottom: 1,
              }}
            >
              <Typography
                variant="body1" // Keep the font size unchanged
                component="div"
                sx={{
                  fontFamily: 'inherit',
                  whiteSpace: 'pre-wrap',
                  color: '#333',
                }}
              >
                {notification.message}
              </Typography>
            </Box>
          ))}
        </Box>
      </Popover>
    </Box>
  );
};

export default StudentNotifications;
