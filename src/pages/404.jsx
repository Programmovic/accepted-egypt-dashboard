import React from "react";
import { Container, Typography, Box, Button } from "@mui/material";
import { AdminLayout } from "@layout";
import Link from 'next/link';

const NotFoundPage = () => {
  return (
    <AdminLayout>
      <Container component="main" maxWidth="sm" sx={{ mt: 8 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography component="h1" variant="h2" gutterBottom>
            404
          </Typography>
          <Typography variant="h5" gutterBottom>
            Page Not Found
          </Typography>
          <Typography variant="body1" paragraph>
            The page you are looking for does not exist. It might have been moved or deleted.
          </Typography>
          <Link href="/" passHref>
            <Button variant="contained" color="primary">
              Go to Home
            </Button>
          </Link>
        </Box>
      </Container>
    </AdminLayout>
  );
};

export default NotFoundPage;
