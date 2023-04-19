// Logout.jsx
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';
import { AppContext } from '../../App';
import { Button } from '@mui/material';

const Logout = () => {
  const { token, setToken } = useContext(AppContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.post(
        '/admin/auth/logout',
        {},
        {
          headers: {
            'Content-type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      navigate('/');
      setToken(null);
      localStorage.removeItem('token');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Button color="inherit" onClick={handleLogout}>
      Logout
    </Button>
  );
};

export default Logout;
