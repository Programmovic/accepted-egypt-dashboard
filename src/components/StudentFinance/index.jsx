import React from 'react';
import { Box, Typography } from '@mui/material';

const StudentFinance = ({ paid, due }) => {
    // Function to format numbers in EGP
    const formatCurrency = (amount) => {
      return new Intl.NumberFormat('en-EG', {
        style: 'currency',
        currency: 'EGP',
      }).format(amount);
    };
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: 2,
        gap: 2,
      }}
    >
      {/* Paid Amount Box */}
      <Box
        sx={{
          backgroundColor: '#e0f7fa',
          padding: 2,
          borderRadius: 2,
          textAlign: 'center',
          flex: 1,
          boxShadow: 1,
        }}
      >
        <Typography variant="h6" component="div">
          Paid Amount
        </Typography>
        <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
          {formatCurrency(paid)}
        </Typography>
      </Box>

      {/* Due Amount Box */}
      <Box
        sx={{
          backgroundColor: '#ffebee',
          padding: 2,
          borderRadius: 2,
          textAlign: 'center',
          flex: 1,
          boxShadow: 1,
        }}
      >
        <Typography variant="h6" component="div">
          Due Amount
        </Typography>
        <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
          {formatCurrency(due)}
        </Typography>
      </Box>
    </Box>
  );
};

export default StudentFinance;
