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
import LinkIcon from '@mui/icons-material/Link'
import StopIcon from '@mui/icons-material/Stop';
// import FileCopyIcon from '@mui/icons-material/FileCopy';
import { startGame, stopGame } from './others/GameActions';

const Dashboard = () => {
  const { token } = useContext(AppContext)
  const [gamesList, setGamesList] = useState([])

  const [showModal, setShowModal] = useState(false)
  const [sessionId, setSessionId] = useState(null)
  const [copyLink, setCopyLink] = useState('')
  // const defaultThumbnailUrl = `${process.env.PUBLIC_URL}/assets/kahoot.png`
  const [gameStatus, setGameStatus] = useState({})
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
      // console.log('res: ', response.data)
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

          // console.log(gameResponse.data)
          // Add the game ID from the original response data
          gameResponse.data.id = game.id

          // Check game status
          if (gameResponse.data.active) {
            console.log('game is active')
            setGameStatus((prevGameStatus) => ({
              ...prevGameStatus,
              [game.id]: gameResponse.data.active,
            }));
          }
          return gameResponse.data
        })

        // Wait for all promises to resolve and set the games list
        const gamesWithQuestions = await Promise.all(gamePromises)
        console.log('dashboard: ', gamesWithQuestions)
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
    const name = prompt('Enter a name for the new game:')
    if (name === null) {
      return
    }
    try {
      await api.post(
        '/admin/quiz/new',
        { name },
        {
          headers: {
            'Content-type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      )
      // ---
      // setGamesList([...gamesList, newGame.data])
      fetchGamesList()
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

  return (
    <Container>
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
            console.log('game: ', game)

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
                        <LinkIcon />
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
                      <IconButton
                        aria-label="Admin"
                        component={RouterLink}
                        to={`/admin/result/game/${game.id}/session/${sessionId}`}
                      >
                        <PlayArrowIcon />
                      </IconButton>
                    )}
                  </CardActions>
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
    </Container>
  );
};

export default Dashboard;
