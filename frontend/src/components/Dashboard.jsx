import React, { useState, useEffect, useContext } from 'react'
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import api from '../api';
import { AppContext } from '../App';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Container,
  Grid,
  IconButton,
  Typography,

  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import { startGame, stopGame, viewResults } from './others/GameActions';
import CsvUploadModal from './others/CsvUploadModal';
import AdminResultButton from './others/AdminResultButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

const Dashboard = () => {
  const { token } = useContext(AppContext)
  const [gamesList, setGamesList] = useState([])

  const [showModal, setShowModal] = useState(false)
  const [sessionId, setSessionId] = useState(null)
  const [copyLink, setCopyLink] = useState('')
  // const defaultThumbnailUrl = `${process.env.PUBLIC_URL}/assets/kahoot.png`
  const [gameStatus, setGameStatus] = useState({})
  // State for upload csv file
  const [showCsvUploadModal, setShowCsvUploadModal] = useState(false);
  const [newGameId, setNewGameId] = useState(null);
  const [newGameName, setNewGameName] = useState('');
  // const [selectedSession, setSelectedSession] = useState(null);
  const [openSessionList, setOpenSessionList] = useState({});

  const navigate = useNavigate()

  useEffect(() => {
    if (token) {
      fetchGamesList()
    }
  }, [token])

  const fetchGamesList = async () => {
    try {
      const response = await api.get('/admin/quiz', {
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      // Check if the response data contains an array of quizzes
      if (Array.isArray(response.data.quizzes)) {
        // Create an array of promises to fetch the full data for each game
        const gamePromises = response.data.quizzes.map(async (game) => {
          const gameResponse = await api.get(`/admin/quiz/${game.id}`, {
            headers: {
              'Content-type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          })

          // Add the game ID from the original response data
          gameResponse.data.id = game.id

          // Check game status
          if (gameResponse.data.active) {
            setGameStatus((prevGameStatus) => ({
              ...prevGameStatus,
              [game.id]: gameResponse.data.active,
            }));
          }
          return gameResponse.data
        })

        // Wait for all promises to resolve and set the games list
        const gamesWithQuestions = await Promise.all(gamePromises)
        setGamesList(gamesWithQuestions)
      } else {
        console.error('Error: response data is not an array')
        setGamesList([])
      }
    } catch (error) {
      if (error.response) {
        switch (error.response.status) {
          case 403:
            window.alert(
              `Error: Forbidden (403) ${JSON.stringify(error.response.data)}`
            )
            break
          default:
            window.alert(`Error: ${error.response.status}`)
        }
      } else if (error.request) {
        // The request was made, but no response was received
        window.alert('Error: No response received')
      } else {
        // Something happened in setting up the request that triggered an error
        window.alert(`Error: ${error.message}`)
      }
    }
  }

  const createGame = async () => {
    const name = prompt('Enter a name for the new game:');
    if (name === null) {
      return;
    }
    try {
      const response = await api.post(
        '/admin/quiz/new',
        { name },
        {
          headers: {
            'Content-type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // ---
      // setGamesList([...gamesList, newGame.data])
      fetchGamesList();
      setNewGameId(response.data.quizId); // Save the new game id
      setNewGameName(name); // Save the new game name
      setShowCsvUploadModal(true); // Show the CSV upload modal
    } catch (error) {
      if (error.response) {
        switch (error.response.status) {
          case 400:
            window.alert(
              `Error: Bad Input (400) ${JSON.stringify(error.response.data)}`
            )
            break
          case 403:
            window.alert(
              `Error: Forbidden (403) ${JSON.stringify(error.response.data)}`
            )
            break
          default:
            window.alert(`Error: ${error.response.status}`)
        }
      } else if (error.request) {
        // The request was made, but no response was received
        window.alert('Error: No response received')
      } else {
        // Something happened in setting up the request that triggered an error
        window.alert(`Error: ${error.message}`)
      }
    }
  }

  const handleCsvUpload = async (gameId, data) => {
    if (!data) return;
    console.log('data: ', data);
    const validatedData = validateCsvData(data);
    if (!validatedData) {
      window.alert('Invalid CSV data. Please check the file format and content.');
      return;
    }

    // Store the questions data
    const updatedQuestions = [];
    data.forEach(async (row) => {
      console.log('row: ', row);
      const answersArray = Object.entries(row)
        .filter(([key, value]) => key.startsWith('answer') && key.includes('_text') && value !== null)
        .map(([key, value]) => ({
          text: value,
          correct: row[`${key.slice(0, -4)}correct`],
        }));
      console.log('answer: ', answersArray);
      const updatedQuestion = {
        id: Date.now() + Math.floor(Math.random() * 100000),
        type: row.type,
        text: row.question,
        time: row.time,
        points: row.points,
        media: {
          type: row.media_type,
          url: row.media_url,
        },
        answers: answersArray,
      }
      updatedQuestions.push(updatedQuestion);
    })

    // Upload the CSV data to the server
    try {
      const gameData = { questions: updatedQuestions, name: newGameName, thumbnail: '' }

      await api.put(`/admin/quiz/${gameId}`, gameData, {
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      window.alert('Quiz created successfully.');
    } catch (error) {
      console.log(error);
    }
    fetchGamesList();
  }

  const validateCsvData = (data) => {
    const requiredFields = [
      'type',
      'question',
      'time',
      'points',
      'media_type',
      'media_url',
    ];

    const validQuestionTypes = ['single', 'multiple'];
    const validMediaTypes = ['video', 'image', 'none'];

    for (const row of data) {
      // Check if all required fields are present
      for (const field of requiredFields) {
        if (!Object.prototype.hasOwnProperty.call(row, field)) {
          return false
        }
      }

      // Validate question type
      if (!validQuestionTypes.includes(row.type)) {
        return false;
      }

      // Validate time and points
      if (row.time <= 0 || row.points <= 0) {
        return false;
      }

      // Validate media type
      if (!validMediaTypes.includes(row.media_type)) {
        return false;
      }

      // Validate answers
      let hasCorrectAnswer = false;
      for (let i = 1; i <= 6; i++) {
        const answerText = row[`answer${i}_text`];
        const answerCorrect = row[`answer${i}_correct`];

        if (answerText && (answerCorrect === true || answerCorrect === false)) {
          if (answerCorrect) {
            hasCorrectAnswer = true;
          }
        } else if (answerText || answerCorrect) {
          return false;
        }
      }

      // Check if at least one correct answer is present
      if (!hasCorrectAnswer) {
        return false;
      }
    }

    return true;
  };

  const handleFileError = (err) => {
    window.alert('Error reading the CSV file: ' + err.message);
  }

  // Close the CSV upload modal
  const handleCloseCsvUploadModal = () => {
    setShowCsvUploadModal(false);
    setNewGameId(null);
  };

  const deleteGame = async (gameId) => {
    // ---
    // console.log('Deleting game with ID:', gameId)
    try {
      await api.delete(`/admin/quiz/${gameId}`, {
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      setGamesList(gamesList.filter((g) => g.id !== gameId))
    } catch (error) {
      if (error.response) {
        switch (error.response.status) {
          case 400:
            window.alert(
              `Error: Bad Input (400) ${JSON.stringify(error.response.data)}`
            )
            break
          case 403:
            window.alert(
              `Error: Forbidden (403) ${JSON.stringify(error.response.data)}`
            )
            break
          default:
            window.alert(`Error: ${error.response.status}`)
        }
      } else if (error.request) {
        // The request was made, but no response was received
        window.alert('Error: No response received')
      } else {
        // Something happened in setting up the request that triggered an error
        window.alert(`Error: ${error.message}`)
      }
    }
  }

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text)
      alert('Link copied to clipboard!')
    } catch (err) {
      alert('Failed to copy link to clipboard.')
    }
  }

  // Show session ID modal
  const GameLinkModal = ({ open, onClose, sessionId, copyLink, copyToClipboard }) => {
    return (
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Game Session ID</DialogTitle>
        <DialogContent>
          <Typography variant="body1">Session ID: {sessionId}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => copyToClipboard(copyLink)}>Copy Link</Button>
          <Button onClick={onClose}>Close</Button>
        </DialogActions>
      </Dialog>
    );
  };

  const toggleSessionList = (gameId) => {
    setOpenSessionList((prevState) => ({
      ...prevState,
      [gameId]: !prevState[gameId],
    }));
  };

  return (
    <Container>
      {console.log('gamesList: ', gamesList)}
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1">
          Dashboard
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={createGame}
          >
            Create New Game
          </Button>
        </Box>
        <Grid container spacing={3} sx={{ mt: 3 }}>
          {gamesList.map((game) => {
            const totalTime =
              game.questions?.reduce(
                (sum, question) => sum + question.time,
                0
              ) || 0;

            return (
              <Grid key={game.id} item xs={12} sm={6} md={4}>
                <Card>
                  <CardContent>
                    <Typography variant="h5" component="h2">
                      {game.name}
                    </Typography>
                    <Typography sx={{ mb: 1.5 }} color="text.secondary">
                      {game.questions?.length || 0} questions
                    </Typography>
                    <Typography variant="body2">
                      Total time: {totalTime} seconds
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <IconButton
                      aria-label="edit"
                      component={RouterLink}
                      to={`/edit/game/${game.id}`}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      aria-label="delete"
                      onClick={() => deleteGame(game.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                    {!gameStatus[game.id] && (
                      <IconButton
                        aria-label="start"
                        onClick={() =>
                          startGame(
                            game.id,
                            token,
                            setCopyLink,
                            setSessionId,
                            setShowModal,
                            setGameStatus
                          )
                        }
                      >
                        <PlayArrowIcon />
                      </IconButton>
                    )}
                    {gameStatus[game.id] && (
                      <IconButton
                        aria-label="stop"
                        onClick={() =>
                          stopGame(
                            game.id,
                            token,
                            setGameStatus,
                            sessionId,
                            navigate
                          )
                        }
                      >
                        <StopIcon />
                      </IconButton>
                    )}
                    {gameStatus[game.id] && (
                      <AdminResultButton gameId={game.id} sessionId={sessionId} />
                    )}
                    <IconButton onClick={() => toggleSessionList(game.id)}>
                      {openSessionList[game.id] ? <ExpandLess /> : <ExpandMore />}
                    </IconButton>
                  </CardActions>
                  <Collapse in={openSessionList[game.id]} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                      {game.oldSessions.map((session) => (
                        <ListItem
                          key={session}
                          onClick={() => viewResults(game.id, session, navigate)}
                        >
                          <ListItemText primary={`Session ${session}`} />
                        </ListItem>
                      ))}
                    </List>
                  </Collapse>
                </Card>
              </Grid>
            )
          })}
        </Grid>
      </Box>
      <GameLinkModal
        open={showModal}
        onClose={() => setShowModal(false)}
        sessionId={sessionId}
        copyLink={copyLink}
        copyToClipboard={copyToClipboard}
      />
      {/* Add the CsvUploadModal component */}
      <CsvUploadModal
        open={showCsvUploadModal}
        gameId={newGameId}
        onClose={handleCloseCsvUploadModal}
        onUpload={handleCsvUpload}
        onError={handleFileError}
      />
    </Container>
  );
};

export default Dashboard;
