import React, { useState, useEffect, useContext } from 'react'
import api from '../api'
import { Link } from 'react-router-dom'
import { AppContext } from '../App'

const Dashboard = () => {
  const [gamesList, setGamesList] = useState([])
  const { token } = useContext(AppContext)

  useEffect(() => {
    fetchGamesList()
  }, [])

  const fetchGamesList = async () => {
    try {
      const response = await api.get('/admin/quiz', {
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      // ---
      console.log('Response data:', response.data)
      if (Array.isArray(response.data.quizzes)) {
        setGamesList(response.data.quizzes)
      } else {
        console.error('Error: response data is not an array')
        setGamesList([])
      }
    } catch (error) {
      console.error('Error fetching games list:', error)
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
      // console.log('New game data:', newGame.data)
      // setGamesList([...gamesList, newGame.data])
      fetchGamesList()
    } catch (error) {
      console.error('Error creating a new game:', error)
    }
  }

  const deleteGame = async (gameId) => {
    // ---
    console.log('Deleting game with ID:', gameId)
    try {
      await api.delete(`/admin/quiz/${gameId}`, {
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      setGamesList(gamesList.filter((g) => g.id !== gameId))
    } catch (error) {
      console.error(`Error deleting game with ID ${gameId}:`, error)
    }
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <button onClick={createGame}>Create New Game</button>
      <div>
        {gamesList.map((game) => (
          <div key={game.id}>
            <h2>Name: {game.name}</h2>
            <p>Number of questions: {game.questions?.length || 0}</p>
            <img src={game.thumbnail} alt={game.name} />
            <p>Total time to complete: {game.totalTime} seconds</p>
            <Link to={`/edit/${game.id}`}>Edit</Link>
            <button onClick={() => deleteGame(game.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Dashboard
