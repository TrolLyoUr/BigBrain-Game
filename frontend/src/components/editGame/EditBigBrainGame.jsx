import React, { useState, useEffect, useContext } from 'react';
import api from '../../api'
import { AppContext } from '../../App'
import { useParams, Link as RouterLink } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

const EditBigBrainGame = () => {
  const { token } = useContext(AppContext)
  const { gameId } = useParams();
  const [game, setGame] = useState(null);

  useEffect(() => {
    if (token) fetchGame()
  }, [token, gameId]);

  const fetchGame = async () => {
    try {
      const response = await api.get(`/admin/quiz/${gameId}`, {
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      console.log('game: ', response.data)

      const fetchedGame = response.data

      // Provide default values if properties are null
      if (fetchedGame.name === null) {
        fetchedGame.name = ''
      }
      if (fetchedGame.thumbnail == null) {
        fetchedGame.thumbnail = ''
      }
      if (fetchedGame.questions === null) {
        fetchedGame.questions = []
      }

      setGame(fetchedGame)
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

  const updateGame = async (updatedGame) => {
    console.log('Updated game:', updatedGame)
    try {
      await api.put(`/admin/quiz/${gameId}`, updatedGame, {
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      fetchGame()
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

  const deleteQuestion = async (questionId) => {
    const updatedQuestions = game.questions.filter(
      (q) => q.id !== questionId
    );
    updateGame({ ...game, questions: updatedQuestions });
  }

  const addQuestion = async () => {
    const newQuestion = {
      id: Date.now(), // Generate a unique ID for simplicity
      type: 'single', // Default question type
      text: '',
      time: 0,
      points: 0,
      media: {
        type: '', // Either "youtube" or "image"
        url: '', // YouTube video URL or image URL
      },
      answers: [
        { text: '', correct: false },
        { text: '', correct: false },
      ], // Default 2 answers with empty text and not marked as correct
    }
    updateGame({ ...game, questions: [...game.questions, newQuestion] });
  }

  if (!game) {
    return <div>Loading...</div>;
  }

  return (
    <Container>
      <Box mt={4}>
        <Typography variant="h4">Edit BigBrain Game: {game.name}</Typography>
      </Box>
      <Box mt={2}>
        <TextField
          label="Game Name"
          variant="outlined"
          value={game.name}
          onChange={(e) => updateGame({ ...game, name: e.target.value })}
        />
      </Box>
      <Box mt={2}>
        <TextField
          label="Thumbnail URL"
          variant="outlined"
          value={game.thumbnail}
          onChange={(e) => updateGame({ ...game, thumbnail: e.target.value })}
        />
      </Box>
      <Box mt={4}>
        <Grid container spacing={2}>
          <Grid item>
            <Button variant="contained" color="primary" onClick={addQuestion}>
              Add New Question
            </Button>
          </Grid>
          <Grid item>
            <Link component={RouterLink} to="/Dashboard" variant="body1">
              Dashboard
            </Link>
          </Grid>
        </Grid>
      </Box>
      <Box mt={4}>
        <Typography variant="h5">Questions:</Typography>
        {game.questions.map((question, index) => (
          <Box key={question.id} mt={2}>
            <Typography variant="h6">Question {index + 1}</Typography>
            <Grid container spacing={2}>
              <Grid item>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => deleteQuestion(question.id)}
                >
                  Delete Question
                </Button>
              </Grid>
              <Grid item>
                <Link
                  component={RouterLink}
                  to={`/edit/game/${gameId}/question/${question.id}`}
                  variant="body1"
                >
                  Edit Question
                </Link>
              </Grid>
            </Grid>
          </Box>
        ))}
      </Box>
    </Container>
  )
};

export default EditBigBrainGame
