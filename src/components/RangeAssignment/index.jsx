import React, { useState } from 'react';
import { TextField, Button, MenuItem, FormControl, InputLabel, Select, Box, Alert } from '@mui/material';

const RangeAssignment = ({ handleRangeAssign, salesMembers }) => {
  const [rangeStart, setRangeStart] = useState('');
  const [rangeEnd, setRangeEnd] = useState('');
  const [selectedSalesMember, setSelectedSalesMember] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    
    // Reset error
    setError('');

    // Validate range
    if (parseFloat(rangeStart) >= parseFloat(rangeEnd)) {
      setError('Range start must be less than range end.');
      return;
    }

    if (selectedSalesMember) {
      handleRangeAssign(rangeStart, rangeEnd, selectedSalesMember);
    } else {
      setError('Please select a sales member');
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ display: 'flex', flexDirection: 'row', gap: 2, py: 2 }}
    >
      <TextField
        label="Range Start"
        type="number"
        value={rangeStart}
        onChange={(e) => setRangeStart(e.target.value)}
        variant="outlined"
        fullWidth
        error={!!error && !rangeStart}
        helperText={!!error && !rangeStart ? error : ''}
      />
      <TextField
        label="Range End"
        type="number"
        value={rangeEnd}
        onChange={(e) => setRangeEnd(e.target.value)}
        variant="outlined"
        fullWidth
        error={!!error && !rangeEnd}
        helperText={!!error && !rangeEnd ? error : ''}
      />
      <FormControl fullWidth>
        <InputLabel>Select Sales Member</InputLabel>
        <Select
          value={selectedSalesMember}
          onChange={(e) => setSelectedSalesMember(e.target.value)}
          label="Select Sales Member"
        >
          <MenuItem value="">
            <em>Select</em>
          </MenuItem>
          {salesMembers.map((member) => (
            <MenuItem key={member._id} value={member.name}>
              {member.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Button variant="contained" sx={{ background: "#2c3d38" }} type="submit" fullWidth>
        Assign Leads
      </Button>
      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
    </Box>
  );
};

export default RangeAssignment;
