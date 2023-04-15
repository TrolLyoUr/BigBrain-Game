import React, { useState, useEffect, useContext } from 'react'
import api from '../api'
import { AppContext } from '../App'

import { Link } from 'react-router-dom'

const Dashboard = () => {
  const { token } = useContext(AppContext)
  const [gamesList, setGamesList] = useState([])

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
          return gameResponse.data
        })

        // Wait for all promises to resolve and set the games list
        const gamesWithQuestions = await Promise.all(gamePromises)
        // console.log(gamesWithQuestions)
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
      // console.log('New game data:', newGame.data)
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

  return (
    <div>
      <h1>Dashboard</h1>
      <button onClick={createGame}>Create New Game</button>
      <div>
        {/* <>{console.log(gamesList)}</> */}
        {gamesList.map((game) => {
          // console.log(game.questions)
          const totalTime =
            game.questions?.reduce((sum, question) => sum + question.time, 0) ||
            0
          return (
            <div key={game.id}>
              <h2>Name: {game.name}</h2>
              <p>Number of questions: {game.questions?.length || 0}</p>
              {/* 根据需要显示缩略图 */}
              <p>Total time to complete: {totalTime} seconds</p>
              <button onClick={() => deleteGame(game.id)}>Delete</button>
              &nbsp;
              <Link to={`/edit/game/${game.id}`}>Edit</Link>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Dashboard
