// components/BackToDashboard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@mui/material';

const BackToDashboard = () => {
  return (
    <Link to="/dashboard" style={{ textDecoration: 'none', marginRight: 8 }}>
      <Button variant="outlined" color="inherit">
        Back to Dashboard
      </Button>
    </Link>
  );
};

export default BackToDashboard;
