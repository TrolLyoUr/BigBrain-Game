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
  Radio,
  RadioGroup,
  FormControl,
  FormControlLabel,
  Checkbox,
  Paper,
  LinearProgress,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import { green, red } from '@mui/material/colors';


const PlayerGame = () => {
  const { sessionId } = useParams();
  const [playerName, setPlayerName] = useState('');
  const [playerId, setPlayerId] = useState('');
  const [hasJoined, setHasJoined] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [timer, setTimer] = useState(null);
  const [userAnswers, setUserAnswers] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState([]);



  // Polling for game status and question
  useEffect(() => {
    if (hasJoined) {
      if (gameStarted && !showResults) {
        fetchQuestion();
      }

      const statusInterval = setInterval(() => {
        if (!gameStarted)
          fetchGameStatus();
        else if (gameStarted && showResults) {
          fetchQuestion();
        }
      }, 1000);

      return () => {
        clearInterval(statusInterval); // Clear the interval when the component is unmounted or the game has started
      };
    }
  }, [gameStarted, hasJoined, showResults]);

  // Hook to set the timer for the current question
  useEffect(() => {
    if (gameStarted && currentQuestion && !showResults) {
      // Set the initial time remaining
      setTimeRemaining(currentQuestion.time);
      console.log('Setting time remaining to', currentQuestion.time);
      console.log('time remain', timeRemaining);

      // Update the time remaining every second
      const countdownTimer = setInterval(() => {
        setTimeRemaining((prevTimeRemaining) => prevTimeRemaining - 1);
      }, 1000);

      // Set the timer to show results after the time limit
      const timerId = setTimeout(() => {
        getCorrectAnswer();
      }, currentQuestion.time * 1000);

      setTimer(timerId);

      // Clear the countdown and result timers when the component is unmounted or a new question is fetched
      return () => {
        clearInterval(countdownTimer);
        clearTimeout(timerId);
      };
    }
  }, [gameStarted, currentQuestion]);


  // API set

  // Join session
  const joinSession = async () => {

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

  // Fetch question if there is a new question
  const fetchQuestion = async () => {

    console.log('Fetching question');
    try {
      const questionResponse = await api.get(`/play/${playerId}/question`, {
        headers: {
          'Content-type': 'application/json',
          playerid: `${playerId}`,
        },
      })
      if (questionResponse.status === 200) {
        if (!currentQuestion || (currentQuestion.id !== questionResponse.data.question.id)) {
          setSubmitted(false);
          setShowResults(false);
          setCurrentQuestion(questionResponse.data.question);
        }
      }
      else {
        alert('Error fetching question');
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Check if the game has started
  const fetchGameStatus = async () => {
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

  // Get the correct answer for the current question
  const getCorrectAnswer = async () => {
    console.log('Fetching answer');
    try {
      const answersResponse = await api.get(`/play/${playerId}/answer`)
      if (answersResponse.status === 200) {
        setAnswers(answersResponse.data.answerIds);
        setShowResults(true);
      }
      else {
        alert('Error fetching answers');
      }
    }
    catch (error) {
      console.log(error);
    }
  };

  // Submit answer
  const submitAnswer = async () => {
    try {
      const submitResponse = await api.put(`/play/${playerId}/answer`,
        { 'answerIds': selectedAnswers }
        , {
          headers: {
            'Content-type': 'application/json',
          },
        }
      )
      if (submitResponse.status === 200) {
        setSubmitted(true);
        setSelectedAnswers([]);
      }
      else {
        alert('Error submitting answer');
      }
    }
    catch (error) {
      console.log(error);
    }
    console.log('Submitting answer', selectedAnswers);
  };

  // Handle radio button change
  const handleRadioChange = (event) => {
    const value = parseInt(event.target.value);
    setSelectedAnswers([value]);
  };

  // Handle checkbox change
  const handleCheckboxChange = (event) => {
    const value = parseInt(event.target.value);
    if (event.target.checked) {
      setSelectedAnswers((prev) => [...prev, value]);
    } else {
      setSelectedAnswers((prev) => prev.filter((answer) => answer !== value));
    }
  };


  // Render page

  // Join session page
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

  // Waiting for game to start page
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

  // Game page
  return (
    <Container>
      <Box sx={{ my: 4 }}>
        <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
          <Typography variant="h4" component="h1" align="center" gutterBottom>
            {currentQuestion ? currentQuestion.text : 'Waiting for question'}
          </Typography>
          {currentQuestion && currentQuestion.mediaUrl && (
            <Box sx={{ my: 2, textAlign: 'center' }}>
              {questionData.mediaType === 'video' ? (
                <video src={currentQuestion.mediaUrl}
                  alt="question"
                  style={{ maxWidth: '100%', maxHeight: 300 }} />
              ) : (
                <img src={currentQuestion.mediaUrl}
                  alt="question"
                  style={{ maxWidth: '100%', maxHeight: 300 }} />
              )}
            </Box>
          )}
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" component="h2" align="center">
              {!showResults
                ? `Time remaining: ${timeRemaining} seconds`
                : `Time's up`}
            </Typography>
          </Box>

          <Box sx={{ mt: 2 }}>
            <LinearProgress
              variant="determinate"
              value={100 - (timeRemaining / currentQuestion?.time) * 100}
            />
          </Box>
          {showResults ? (
            <Box sx={{ mt: 2 }}>
              <Typography variant="h5" component="h2">
                Correct answers:
              </Typography>
              <Box sx={{ mt: 1 }}>
                {currentQuestion.answers.map((option, id) => (
                  <Box
                    key={id}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      mb: 1,
                      fontWeight: answers.includes(id) ? 'bold' : 'normal',
                    }}
                  >
                    {answers.includes(id) ? (
                      <CheckCircleIcon sx={{ color: green[500], marginRight: 1 }} />
                    ) : (
                      <ErrorIcon sx={{ color: red[500], marginRight: 1 }} />
                    )}
                    <Typography variant="h6" component="h3">
                      {option.text}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          ) : (
            <Box sx={{ mt: 2 }}>
              <FormControl component="fieldset">
                {currentQuestion.type === 'single' ? (
                  <RadioGroup
                    aria-label="quiz"
                    value={selectedAnswers[0]?.toString() || ''}
                    onChange={handleRadioChange}
                  >
                    {currentQuestion.answers.map((option, id) => (
                      <FormControlLabel
                        key={id}
                        value={id.toString()}
                        control={<Radio />}
                        label={option.text}
                      />
                    ))}
                  </RadioGroup>
                ) : (
                  currentQuestion.answers.map((option, id) => (
                    <FormControlLabel
                      key={id}
                      control={
                        <Checkbox
                          checked={selectedAnswers.includes(id)}
                          onChange={handleCheckboxChange}
                          value={id.toString()}
                        />
                      }
                      label={option.text}
                    />
                  ))
                )}
              </FormControl>
              <Box sx={{ mt: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => submitAnswer(selectedAnswers)}
                  disabled={submitted || selectedAnswers.length === 0}
                >
                  Submit Answer
                </Button>
              </Box>
            </Box>
          )}
        </Paper>
      </Box>
    </Container>
  );
};

export default PlayerGame;
