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
          padding: 2,
          borderRadius: 2,
          border: "none",
          textAlign: 'center',
          flex: 1,
          boxShadow: "0 1rem 3rem rgba(0,0,0,.175)",
        }}
      >
        <div className="border-start border-4  border-end border-success px-3">
          <Typography variant="h6" component="div" sx={{ fontFamily: 'inherit' }}>
            Paid Amount
          </Typography>
          <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', fontFamily: 'inherit' }}>
            {formatCurrency(paid)}
          </Typography>
        </div>
      </Box>

      {/* Due Amount Box */}
      <Box
        sx={{
          padding: 2,
          borderRadius: 2,
          textAlign: 'center',
          border: "none",
          textAlign: 'center',
          flex: 1,
          boxShadow: "0 1rem 3rem rgba(0,0,0,.175)",
        }}
      >
        <div className="border-start border-end border-4 border-danger px-3">
        <Typography variant="h6" component="div" sx={{ fontFamily: 'inherit' }}>
          Due Amount
        </Typography>
        <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', fontFamily: 'inherit' }}>
          {formatCurrency(due)}
        </Typography>
        </div>
      </Box>
    </Box>
  );
};

export default StudentFinance;
