import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
} from '@mui/material';

const PlayerGameNoid = () => {
  const [sessionInput, setSessionInput] = useState('');
  const navigate = useNavigate()

  const handleSubmit = () => {
    if (sessionInput.trim() === '') {
      alert('Please enter a valid session ID.');
      return;
    }

    navigate(`/player/game/session/${sessionInput}`);
  };

  return (
    <Container>
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1">
          Join a Game
        </Typography>
        <Box sx={{ mt: 2 }}>
          <TextField
            label="Session ID"
            value={sessionInput}
            onChange={(e) => setSessionInput(e.target.value)}
            variant="outlined"
            fullWidth
          />
        </Box>
        <Box sx={{ mt: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
          >
            Join
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default PlayerGameNoid;
