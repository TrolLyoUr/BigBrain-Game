import React, { useState, useEffect, useContext } from 'react'
import api from '../api'
import { AppContext } from '../App'

import { Link } from 'react-router-dom'

const Dashboard = () => {
  const { token } = useContext(AppContext)
  const [gamesList, setGamesList] = useState([])
  //
  const [showModal, setShowModal] = useState(false)
  const [sessionId, setSessionId] = useState(null)
  const [copyLink, setCopyLink] = useState('')

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

  const startGame = async (gameId) => {
    try {
      await api.post(
        `/admin/quiz/${gameId}/start`,
        {},
        {
          headers: {
            'Content-type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const gameResponse = await api.get(`/admin/quiz/${gameId}`, {
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })

      const ActiveSessionId = gameResponse.data.active
      const newCopyLink = `${window.location.origin}/play/${ActiveSessionId}`
      setCopyLink(newCopyLink)
      setSessionId(ActiveSessionId)
      setShowModal(true)
    } catch (error) {
      console.log(error)
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
              {/* thumbnail */}
              <p>Total time to complete: {totalTime} seconds</p>
              <button onClick={() => deleteGame(game.id)}>Delete</button>
              &nbsp;&nbsp;
              <Link to={`/edit/game/${game.id}`}>Edit</Link>
              &nbsp;&nbsp;
              <button onClick={() => startGame(game.id)}>Start</button>
              {/* modal */}
              <div
                id="modal"
                style={{
                  display: showModal ? 'block' : 'none',
                  position: 'fixed',
                  zIndex: 1,
                  left: 0,
                  top: 0,
                  width: '100%',
                  height: '100%',
                  overflow: 'auto',
                  backgroundColor: 'rgba(0,0,0,0.4)',
                }}
              >
                <div
                  style={{
                    backgroundColor: '#fefefe',
                    margin: '15% auto',
                    padding: '20px',
                    border: '1px solid #888',
                    width: '80%',
                  }}
                >
                  <p id="modal-text">Session ID: {sessionId}</p>
                  <button
                    data-clipboard-text={copyLink}
                    onClick={(e) =>
                      copyToClipboard(
                        e.target.getAttribute('data-clipboard-text')
                      )
                    }
                  >
                    Copy Link
                  </button>
                  <button onClick={() => setShowModal(false)}>Close</button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Dashboard
