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
import WaitingForGame from './Lobby';
import useStyles from './GameStyle';
import YouTube from 'react-youtube';


const PlayerGame = () => {
  const { sessionId } = useParams();
  const [playerName, setPlayerName] = useState('');
  const [playerId, setPlayerId] = useState('');
  const [hasJoined, setHasJoined] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [currentQuestionId, setCurrentQuestionId] = useState(0);
  const [timer, setTimer] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [results, setResults] = useState([]);
  const [loadingResults, setLoadingResults] = useState(true);
  const [questions, setQuestions] = useState([]);
  const [gameEnded, setGameEnded] = useState(false);

  const classes = useStyles();




  // Polling for game status and question
  useEffect(() => {
    if (hasJoined && !gameEnded) {
      const statusInterval = setInterval(() => {
        if (!gameStarted)
          fetchGameStatus();
        else {
          fetchGameStatus();
          fetchQuestion();
        }
      }, 1000);

      return () => {
        clearInterval(statusInterval); // Clear the interval when the component is unmounted or the game has started
      };
    }
  }, [gameStarted, hasJoined, showResults, gameEnded]);

  useEffect(() => {
    if (gameEnded && loadingResults) {
      fetchResults();
    }
  }, [gameEnded]);

  // Hook to set the timer for the current question
  useEffect(() => {
    if (gameStarted && currentQuestion && !showResults && !gameEnded) {
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
  }, [gameStarted, currentQuestionId, gameEnded]);

  // API set

  // Join session
  const joinSession = async () => {
    try {
      const joinResponse = await api.post(`/play/join/${sessionId}`,
        { name: playerName }
        , {
          headers: {
            'Content-type': 'application/json',
          },
        }
      )
      if (joinResponse.status === 200) {
        setPlayerId(joinResponse.data.playerId);
        setHasJoined(true);
      } else {
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
        if (!currentQuestion || (currentQuestionId !== questionResponse.data.question.id)) {
          setSubmitted(false);
          setShowResults(false);
          setQuestions((prevQuestions) => {
            if (!prevQuestions.find((q) => q.id === questionResponse.data.question.id)) {
              return [...prevQuestions, questionResponse.data.question];
            } else {
              return prevQuestions;
            }
          });
          setCurrentQuestion(questionResponse.data.question);
          setCurrentQuestionId(questionResponse.data.question.id);
        }
      } else {
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
        if (statusResponse.data.started && !gameStarted) {
          setGameStarted(true);
        }
      } else {
        alert('Error fetching game status');
      }
    }
    catch (error) {
      if (gameStarted) {
        console.log('Game ended');
        setGameEnded(true);
      }
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
      } else {
        alert('Error fetching answers');
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Submit answer
  const submitAnswer = async () => {
    try {
      const submitResponse = await api.put(`/play/${playerId}/answer`,
        { answerIds: selectedAnswers }
        , {
          headers: {
            'Content-type': 'application/json',
          },
        }
      )
      if (submitResponse.status === 200) {
        setSubmitted(true);
        setSelectedAnswers([]);
      } else {
        alert('Error submitting answer');
      }
    } catch (error) {
      console.log(error);
    }
    console.log('Submitting answer', selectedAnswers);
  };

  // Get results
  const fetchResults = async () => {
    setLoadingResults(true);
    try {
      const resultsResponse = await api.get(`/play/${playerId}/results`);
      if (resultsResponse.status === 200) {
        setResults(resultsResponse.data);
      } else {
        alert('Error fetching results');
      }
    } catch (error) {
      console.log(error);
    }
    setLoadingResults(false);
  };

  // Fuctions

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

  // Calculate the score for each question
  function calculateScores(results, questions) {
    return results.map((result, index) => {
      console.log('qs', questions);
      if (questions.length - 1 < index) {
        return 0;
      }
      const question = questions[index];
      console.log('q', question);
      console.log('qt', question.time);
      const timeLimit = question.time;
      const timeSpent = (new Date(result.answeredAt) - new Date(result.questionStartedAt)) / 1000;

      if (result.correct) {
        const timeRatio = 1 + (timeLimit - timeSpent) / timeLimit;
        const score = Math.round(question.points * Math.min(2, timeRatio));
        return score;
      } else {
        return 0;
      }
    });
  }

  // Extract the video id from the YouTube URL
  function extractVideoIdFromUrl(url) {
    const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    if (match && match[2].length === 11) {
      return match[2];
    } else {
      console.error('Invalid YouTube URL');
      return null;
    }
  }


  // Render functions
  const GameResults = ({ results, questions }) => {
    const [showCalculationDetails, setShowCalculationDetails] = useState(false);
    // Calculate the score
    const scores = calculateScores(results, questions);
    console.log(scores); // This will show the scores for each question
    const sum = scores.reduce((acc, cur) => acc + cur, 0);

    return (
      <Container>
        <Box sx={{ my: 4 }}>
          <Typography variant="h4" component="h1" align="center" gutterBottom>
            Game Results
          </Typography>
          <Box sx={{ mt: 2 }}>
            <Typography variant="h5" component="h2" align="center">
              Your score: {sum}
              <Button
                size="small"
                variant="outlined"
                onClick={() => setShowCalculationDetails(!showCalculationDetails)}
              >
                {showCalculationDetails ? 'Hide Details' : 'Show Details'}
              </Button>
              {showCalculationDetails && (
                <Typography variant="body1" component="span">
                  {' '}
                  (The total score is calculated by sun of each question.
                  The score for each question is calculated by scale up(1x to 2x) the basic score accoding to the time spent that player answered the question, and then round to integer.)
                </Typography>
              )}
            </Typography>
          </Box>
          <Box sx={{ mt: 2 }}>
            {results.map((result, index) => {
              if (questions.length - 1 >= index) {
                const question = questions[index];
                const isCorrect = result.correct;
                const playerScore = scores[index];
                return (
                  <Box key={index} sx={{ mb: 3 }}>
                    <Typography variant="h5" component="h2">
                      Question {index + 1}: {question.text}
                    </Typography>
                    <Typography variant="h6" component="h3">
                      Basic score: {question.points}
                    </Typography>
                    <Typography variant="h6" component="h3">
                      Your score: {playerScore}
                    </Typography>
                    <Typography
                      variant="h6"
                      component="h3"
                      color={isCorrect ? green[500] : red[500]}
                    >
                      {isCorrect ? 'Correct' : 'Incorrect'}
                    </Typography>
                  </Box>
                );
              }
            })}
          </Box>
        </Box>
      </Container>
    );
  };

  // Render page

  // Join session page
  if (!hasJoined) {
    return (
      <Container className={classes.root}>
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
      <WaitingForGame />
    );
  }

  // Game results page
  if (gameEnded) {
    if (loadingResults) {
      return (
        <Container>
          <Box sx={{ my: 4 }}>
            <CircularProgress />
          </Box>
        </Container>
      );
    } else {
      return (
        <GameResults
          results={results}
          questions={questions}
        />
      );
    }
  }

  // Game page
  return (
    <Container className={classes.root}>
      <Box>
        <Paper elevation={3} className={classes.questionContainer}>
          <Typography variant="h4" component="h1" align="center" gutterBottom className={classes.questionText}>
            {currentQuestion ? currentQuestion.text : 'Waiting for question'}
          </Typography>
          {currentQuestion && currentQuestion.mediaUrl && (
            <Box sx={{ my: 2, textAlign: 'center' }}>
              {currentQuestion.mediaType === 'video' ? (
                <YouTube videoId={extractVideoIdFromUrl(currentQuestion.mediaUrl)}
                  alt="question"
                  style={{ maxWidth: '100%', maxHeight: 300 }} />
              )
                : (
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
                : 'Time\'s up'}
            </Typography>
          </Box>
          <Box>
            <LinearProgress
              variant="determinate"
              value={100 - (timeRemaining / currentQuestion?.time) * 100}
              className={classes.timerProgress}
            />
          </Box>
          {showResults
            ? (
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
                      {answers.includes(id)
                        ? (
                          <CheckCircleIcon sx={{ color: green[500], marginRight: 1 }} />
                        )
                        : (
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
              <Box>
                <FormControl component="fieldset">
                  {currentQuestion.type === 'single'
                    ? (
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
                    )
                    : (
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
                <Box>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => submitAnswer(selectedAnswers)}
                    disabled={submitted || selectedAnswers.length === 0}
                    className={classes.answerButton}
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
