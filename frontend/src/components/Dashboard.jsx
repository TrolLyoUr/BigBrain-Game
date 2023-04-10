import React from 'react'
import { Link } from 'react-router-dom'
import Button from './Button'

function Dashboard ({ token }) {
  const [newGameShow, setNewGameShow] = React.useState(false)
  const [quizzes, setQuizzes] = React.useState([])
  const [newQuizName, setNewQuizName] = React.useState('')

  async function fetchAllQuizzes () {
    const response = await fetch('http://localhost:5005/admin/quiz', {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
    const data = await response.json()
    if (Array.isArray(data.quizzes)) {
      setQuizzes(data.quizzes)
    } else {
      console.error('Unexpected data format:', data)
      setQuizzes([])
    }
  }

  React.useEffect(() => {
    (async () => {
      await fetchAllQuizzes()
    })()
  }, [newGameShow])

  async function createNewGame () {
    await fetch('http://localhost:5005/admin/quiz/new', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: newQuizName,
      }),
    })
    await fetchAllQuizzes()
  }

  async function deleteGame (id) {
    await fetch(`http://localhost:5005/admin/quiz/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
    await fetchAllQuizzes()
  }

  return (
    <>
      <h1>Dashboard</h1>
      <div>
        {quizzes.map((quiz) => (
          <div key={quiz.id} style={{ marginBottom: '1rem' }}>
            <h3>
              <Link to={`/edit/${quiz.id}`}>{quiz.name}</Link>
            </h3>
            <p>
              Questions: {quiz.questions ? quiz.questions.length : 0} | Total
              Time:{' '}
              {quiz.questions
                ? quiz.questions.reduce(
                  (acc, question) => acc + question.time,
                  0
                )
                : 0}{' '}
              seconds
            </p>
            <Button variant="contained" onClick={() => deleteGame(quiz.id)}>
              Delete
            </Button>
          </div>
        ))}
      </div>
      <hr />
      <Button variant="contained" onClick={() => setNewGameShow(!newGameShow)}>
        {newGameShow ? 'Hide' : 'Show'} Create New Game
      </Button>
      {newGameShow && (
        <>
          <br />
          Form here for new game!
          <br />
          Name:{' '}
          <input
            value={newQuizName}
            onChange={(e) => setNewQuizName(e.target.value)}
          />
          <br />
          <Button variant="contained" onClick={createNewGame}>
            Create new game
          </Button>
        </>
      )}
    </>
  )
}

export default Dashboard
