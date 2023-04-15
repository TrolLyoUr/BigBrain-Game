import React, { useState, useEffect, useContext } from 'react';
import api from '../api'
import { AppContext } from '../App'
import { useParams, Link } from 'react-router-dom';
const EditBigBrainGame = () => {
  const { token } = useContext(AppContext)
  const { gameId } = useParams();
  const [game, setGame] = useState(null);

  useEffect(() => {
    fetchGame();
  }, [gameId]);

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
      type: 'single_choice', // Default question type
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
    <div>
      <h1>Edit BigBrain Game: {game.name}</h1>
      <label>
        Game Name:
        <input
          type="text"
          value={game.name}
          onChange={(e) => updateGame({ ...game, name: e.target.value })}
        />
      </label>
      <br />
      <label>
        Thumbnail URL:
        <input
          type="text"
          value={game.thumbnail }
          onChange={(e) => updateGame({ ...game, thumbnail: e.target.value })}
        />
      </label>
      <br />
      <br />
      <hr />
      <div>
        <button onClick={addQuestion}>Add New Question</button>
        &nbsp;&nbsp;
        <Link to={'/Dashboard'}>Dashboard</Link>
      </div>
      <h2>Questions: </h2>
      {game.questions.map((question, index) => (
        <div key={question.id}>
          <h3>Question {index + 1}</h3>
          <button onClick={() => deleteQuestion(question.id)}>
            Delete Question
          </button>
          &nbsp;&nbsp;
          <Link to={`/edit/game/${gameId}/question/${question.id}`}>
            Edit Question
          </Link>
        </div>
      ))}
    </div>
  )
};

export default EditBigBrainGame;
