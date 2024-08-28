import React, { useState } from 'react';
import { TextField, Button, MenuItem, FormControl, InputLabel, Select, Box } from '@mui/material';

const RangeAssignment = ({ handleRangeAssign, salesMembers }) => {
  const [rangeStart, setRangeStart] = useState('');
  const [rangeEnd, setRangeEnd] = useState('');
  const [selectedSalesMember, setSelectedSalesMember] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    if (selectedSalesMember) {
      handleRangeAssign(rangeStart, rangeEnd, selectedSalesMember);
    } else {
      alert('Please select a sales member');
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
      />
      <TextField
        label="Range End"
        type="number"
        value={rangeEnd}
        onChange={(e) => setRangeEnd(e.target.value)}
        variant="outlined"
        fullWidth
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
      <Button variant="contained" color="primary" type="submit" fullWidth>
        Assign Leads
      </Button>
    </Box>
  );
};

export default RangeAssignment;
