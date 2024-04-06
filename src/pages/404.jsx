import React from "react";
import { Container, Typography, Box, Button, useTheme, useMediaQuery } from "@mui/material";
import { AdminLayout } from "@layout";
import Link from 'next/link';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'; // Import an icon for visual appeal

const NotFoundPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <AdminLayout>
      <Container component="main" maxWidth="md" sx={{ mt: 8, mb: 4 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            backgroundColor: theme.palette.background.paper, // Use theme for background
            p: isMobile ? 3 : 6, // Adjust padding based on screen size
            boxShadow: theme.shadows[3], // Soft shadow around the box for depth
            borderRadius: theme.shape.borderRadius, // Slightly rounded corners
          }}
        >
          <ErrorOutlineIcon sx={{ fontSize: 60, color: theme.palette.secondary.main, mb: 2 }} />
          <Typography component="h1" variant="h4" gutterBottom>
            404
          </Typography>
          <Typography variant="h5" gutterBottom>
            Page Not Found
          </Typography>
          <Typography variant="body1" paragraph>
            The page you are looking for does not exist. It might have been moved or deleted.
          </Typography>
          <Link href="/" passHref>
            <Button variant="contained" color="primary" size="large">
              Go Home
            </Button>
          </Link>
        </Box>
      </Container>
    </AdminLayout>
  );
};

export default NotFoundPage;
