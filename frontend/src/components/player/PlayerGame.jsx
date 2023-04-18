import React, { useState, useEffect } from 'react';
import api from '../../api';
import { useParams } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  CircularProgress,
} from '@mui/material';

const PlayerGame = () => {
  const { sessionId } = useParams();
  const [playerName, setPlayerName] = useState('');
  const [playerId, setPlayerId] = useState('');
  const [hasJoined, setHasJoined] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  //const [previousQuestions, setPreviousQuestions] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [timer, setTimer] = useState(null);
  const [userAnswers, setUserAnswers] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);


  // Replace with actual API calls
  const joinSession = async () => {
    // Join session API call
    try {
      const joinResponse = await api.post(`/play/join/${sessionId}`,
        { 'name': playerName }
        , {
          headers: {
            'Content-type': 'application/json',
          },
        }
      )
      if (joinResponse.status === 200) {
        setPlayerId(joinResponse.data.playerId);
        setHasJoined(true);
      }
      else {
        alert('Error joining session');
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Check if the game has started
  const fetchGameStatus = async () => {
    // Fetch game status API call
    console.log('Fetching game status');
    try {
      const statusResponse = await api.get(`/play/${playerId}/status`)
      if (statusResponse.status === 200) {
        if (statusResponse.data.started) {
          setGameStarted(true);
        }
      }
      else {
        alert('Error fetching game status');
      }
    }
    catch (error) {
      console.log(error);
    }
  };

  // Hook to check if the game has started every 2 seconds
  useEffect(() => {
    if (!gameStarted && hasJoined) {
      const statusInterval = setInterval(() => {
        fetchGameStatus();
      }, 1000); // Call fetchGameStatus every 2 seconds

      return () => {
        clearInterval(statusInterval); // Clear the interval when the component is unmounted or the game has started
      };
    }
  }, [gameStarted, hasJoined]);

  const fetchQuestion = async () => {
    // Fetch question API call
    console.log('Fetching question');
    try {
      const questionResponse = await api.get(`/play/${playerId}/question`, {
        headers: {
          'Content-type': 'application/json',
          playerid: `${playerId}`,
        },
      })
      if (questionResponse.status === 200) {
        setCurrentQuestion(questionResponse.data.question);
      }
      else {
        alert('Error fetching question');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const submitAnswer = async (answer) => {
    // Submit answer API call
    console.log('Submitting answer', answer);
  };

  // Hook to fetch a question when the game starts or when the current question is answered or timed out
  useEffect(() => {
    if (gameStarted && currentQuestion) {
      // Set the initial time remaining
      setTimeRemaining(currentQuestion.time);

      // Update the time remaining every second
      const countdownTimer = setInterval(() => {
        setTimeRemaining((prevTimeRemaining) => prevTimeRemaining - 1);
      }, 1000);

      // Set the timer to show results after the time limit
      const timerId = setTimeout(() => {
        setShowResults(true);
      }, currentQuestion.time * 1000);

      setTimer(timerId);

      // Clear the countdown and result timers when the component is unmounted or a new question is fetched
      return () => {
        clearInterval(countdownTimer);
        clearTimeout(timerId);
      };
    }
  }, [gameStarted, timer]);

  useEffect(() => {
    if (gameStarted) {
      fetchQuestion();
    }
  }, [gameStarted, showResults]);

  if (!hasJoined) {
    return (
      <Container>
        <Box sx={{ my: 4 }}>
          <Typography variant="h4" component="h1">
            Enter your name
          </Typography>
          <Box sx={{ mt: 2 }}>
            <TextField
              label="Name"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              variant="outlined"
              fullWidth
            />
          </Box>
          <Box sx={{ mt: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={joinSession}
              disabled={!playerName}
            >
              Join
            </Button>
          </Box>
        </Box>
      </Container>
    );
  }

  if (!currentQuestion) {
    return (
      <Container>
        <Box sx={{ my: 4 }}>
          <Typography variant="h4" component="h1">
            Please wait...
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container>
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1">
          {currentQuestion.text}
        </Typography>
        {currentQuestion.mediaUrl && (<Box sx={{ my: 2 }}>
          <img
            src={currentQuestion.mediaUrl}
            alt="question"
            style={{ maxWidth: '100%' }}
          />
        </Box>
        )}
        <Box sx={{ mt: 2 }}>
          <Typography variant="h6" component="h2">
            Time remaining: {timeRemaining} seconds
          </Typography>
        </Box>
        {showResults ? (
          <Box sx={{ mt: 2 }}>
            {/* Render results here */}
            <Typography variant="h5" component="h2">
              Results
            </Typography>
          </Box>
        ) : (
          <Box sx={{ mt: 2 }}>
            {currentQuestion.answers.map((option, id) => (
              <Box key={id} sx={{ mb: 1 }}>
                <Button
                  variant={
                    userAnswers.includes(id) ? 'contained' : 'outlined'
                  }
                  color="primary"
                  onClick={() => {
                    if (!userAnswers.includes(id)) {
                      setUserAnswers([...userAnswers, id]);
                      submitAnswer(id);
                    }
                  }}
                  fullWidth
                >
                  {option.text}
                </Button>
              </Box>
            ))}
          </Box>
        )
        }
      </Box>
    </Container>
  );
};

export default PlayerGame;
