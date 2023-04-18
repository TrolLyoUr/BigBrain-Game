import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import api from '../../api';
import { AppContext } from '../../App';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Container from '@mui/material/Container';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

const EditQuestion = () => {
  const { gameId, questionId } = useParams()
  const { token } = useContext(AppContext)
  const [questionData, setQuestionData] = useState({
    id: '',
    type: 'single',
    text: '',
    time: 0,
    points: 0,
    mediaUrl: '',
    answers: [
      { text: '', correct: false },
      { text: '', correct: false },
    ],
  })
  const [answerCount, setAnswerCount] = useState(questionData.answers.length)

  useEffect(() => {
    if (token) fetchQuestion()
  }, [token, gameId, questionId])

  useEffect(() => {
    setAnswerCount(questionData.answers.length)
  }, [questionData])

  const fetchQuestion = async () => {
    try {
      const response = await api.get(`/admin/quiz/${gameId}`, {
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      console.log('questions: ', response.data.questions)

      const fetchedQuestions = response.data.questions
      const fetchedQuestion = fetchedQuestions.find(
        (question) => question.id && question.id.toString() === questionId
      )

      setQuestionData(fetchedQuestion)
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

  // Make sure all fields are filled out
  const validateForm = () => {
    if (!questionData.text.trim()) {
      window.alert('Question text cannot be empty.');
      return false;
    }

    if (!questionData.time) {
      window.alert('Time limit cannot be empty or zero.');
      return false;
    }

    if (!questionData.points) {
      window.alert('Points cannot be empty or zero.');
      return false;
    }

    let correctAnswerSelected = false;
    for (let i = 0; i < questionData.answers.length; i++) {
      if (!questionData.answers[i].text.trim()) {
        window.alert('All answers must have text.');
        return false;
      }
      if (questionData.answers[i].correct) {
        correctAnswerSelected = true;
      }
    }

    if (!correctAnswerSelected) {
      window.alert('At least one correct answer must be selected.');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return;
    }
    const updatedQuestion = {
      id: questionData.id,
      type: questionData.type,
      text: questionData.text,
      time: questionData.time,
      points: questionData.points,
      mediaUrl: questionData.mediaUrl,
      answers: questionData.answers,
    }
    //
    console.log(questionData)

    try {
      const response = await api.get(`/admin/quiz/${gameId}`, {
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })

      const gameData = response.data
      const questionIndex = gameData.questions.findIndex(
        (question) => question.id && question.id.toString() === questionId
      )

      gameData.questions[questionIndex] = updatedQuestion

      await api.put(`/admin/quiz/${gameId}`, gameData, {
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      window.alert('Changes saved successfully.');

      fetchQuestion()
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

  const updateAnswerList = (newAnswerCount) => {
    const currentAnswerCount = questionData.answers.length
    let newAnswers = [...questionData.answers]

    if (newAnswerCount > currentAnswerCount) {
      for (let i = currentAnswerCount; i < newAnswerCount; i++) {
        newAnswers.push({ text: '', correct: false })
      }
    } else if (newAnswerCount < currentAnswerCount) {
      newAnswers = newAnswers.slice(0, newAnswerCount)
    }

    setQuestionData({ ...questionData, answers: newAnswers })
  }

  if (!questionData) {
    return <div>Loading...</div>
  }

  // Make sure only one answer is correct for single choice questions and the answer text is not empty
  const handleCheckboxChange = (e, index) => {
    if (!questionData.answers[index].text.trim()) {
      e.preventDefault();
      window.alert('Answer text cannot be empty.');
      return;
    }

    const newAnswers = [...questionData.answers];

    if (questionData.type === 'single' && e.target.checked) {
      newAnswers.forEach((answer) => (answer.correct = false));
    }

    newAnswers[index].correct = e.target.checked;
    setQuestionData({ ...questionData, answers: newAnswers });
  };

  return (
    <Container>
      <Box mt={4}>
        <Typography variant="h4">Edit Question</Typography>
      </Box>
      <Box mt={2}>
        <form onSubmit={handleSubmit}>
          {/* Question type */}
          <Box mt={2}>
            <FormControl fullWidth variant="outlined">
              <InputLabel id="questionType-label">Question Type</InputLabel>
              <Select
                labelId="questionType-label"
                id="questionType"
                value={questionData.type || ''}
                onChange={(e) =>
                  setQuestionData({ ...questionData, type: e.target.value })
                }
                label="Question Type"
              >
                <MenuItem value="single">Single Choice</MenuItem>
                <MenuItem value="multiple">Multiple Choice</MenuItem>
              </Select>
            </FormControl>
          </Box>
          {/* Question text */}
          <Box mt={2}>
            <TextField
              label="Question Text"
              variant="outlined"
              fullWidth
              value={questionData.text || ''}
              onChange={(e) =>
                setQuestionData({ ...questionData, text: e.target.value })
              }
            />
          </Box>
          {/* Time limit */}
          <Box mt={2}>
            <TextField
              label="Time Limit"
              variant="outlined"
              type="number"
              fullWidth
              value={questionData.time ? questionData.time.toString() : ''}
              onChange={(e) =>
                setQuestionData({
                  ...questionData,
                  time: parseInt(e.target.value, 10),
                })
              }
            />
          </Box>
          {/* Points */}
          <Box mt={2}>
            <TextField
              label="Points"
              variant="outlined"
              type="number"
              fullWidth
              value={questionData.points ? questionData.points.toString() : ''}
              onChange={(e) =>
                setQuestionData({
                  ...questionData,
                  points: parseInt(e.target.value, 10),
                })
              }
            />
          </Box>
          {/* Media */}
          <Box mt={2}>
            <TextField
              label="Media (YouTube URL or Photo)"
              variant="outlined"
              fullWidth
              value={questionData.mediaUrl ? questionData.mediaUrl : ''}
              onChange={(e) =>
                setQuestionData({
                  ...questionData,
                  mediaUrl: { ...questionData.mediaUrl, url: e.target.value },
                })
              }
            />
          </Box>
          {/* Answer count */}
          <Box mt={2}>
            <FormControl fullWidth variant="outlined">
              <InputLabel id="answerCount-label">Answer Count</InputLabel>
              <Select
                labelId="answerCount-label"
                id="answerCount"
                value={answerCount}
                onChange={(e) => {
                  const newAnswerCount = parseInt(e.target.value, 10);
                  setAnswerCount(newAnswerCount);
                  updateAnswerList(newAnswerCount);
                }}
                label="Answer Count"
              >
                <MenuItem value="2">2</MenuItem>
                <MenuItem value="3">3</MenuItem>
                <MenuItem value="4">4</MenuItem>
                <MenuItem value="5">5</MenuItem>
                <MenuItem value="6">6</MenuItem>
              </Select>
            </FormControl>
          </Box>
          {/* Answers */}
          <Box mt={2}>
            <Typography variant="h6">Answers:</Typography>
            {questionData.answers
              ? questionData.answers.map((answer, index) => (
                <Grid container spacing={2} key={index}>
                  <Grid item xs={10}>
                    <TextField
                      label={`Answer ${index + 1}`}
                      variant="outlined"
                      fullWidth
                      value={answer.text || ''}
                      onChange={(e) => {
                        const newAnswers = [...questionData.answers];
                        newAnswers[index].text = e.target.value;
                        setQuestionData({ ...questionData, answers: newAnswers });
                      }}
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={answer.correct || false}
                          onChange={(e) => handleCheckboxChange(e, index)}
                        />
                      }
                      label="Correct"
                    />
                  </Grid>
                </Grid>
              ))
              : <p>Loading answers...</p>}
          </Box>
          <Box mt={4}>
            <Button type="submit" variant="contained" color="primary">
              Save Changes
            </Button>
            &nbsp;&nbsp;
            <Button
              component={RouterLink}
              to={`/edit/game/${gameId}`}
              variant="contained"
            >
              Back to game page
            </Button>
          </Box>
        </form>
      </Box>
    </Container>
  );
};

export default EditQuestion;
