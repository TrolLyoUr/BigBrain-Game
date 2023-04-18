import React, { useState, useEffect, useContext } from 'react'
import api from '../../api'
import { AppContext } from '../../App'
import { useParams, Link } from 'react-router-dom'
// import { Chart } from 'chart.js'
import { Bar, Line } from 'react-chartjs-2'
import {
  Button,
  Typography,
} from '@mui/material';

const AdminResult = () => {
  const { token } = useContext(AppContext)
  const { gameId, sessionId } = useParams()
  const [gameStatus, setGameStatus] = useState(null)
  const [results, setResults] = useState(null)
  const [showCalculationDetails, setShowCalculationDetails] = useState(false);
  const defaultPlayer = {
    name: 'Default Player',
    answers: [],
  }
  // Chart.register(Bar, Line)

  useEffect(() => {
    // valid token check
    if (token) {
      fetchStatus()
    }
  }, [token, sessionId])

  // check finished
  useEffect(() => {
    if (gameStatus && !gameStatus.results.active) {
      fetchResults()
    }
  }, [gameStatus])

  // fetch game status
  const fetchStatus = async () => {
    try {
      const gameStatusData = await api.get(
        `/admin/session/${sessionId}/status`,
        {
          headers: {
            'Content-type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      )
      // status data
      console.log('gameStatusData', gameStatusData.data)
      setGameStatus(gameStatusData.data)
    } catch (error) {
      console.log(error)
    }
  }

  // fetch game results
  const fetchResults = async () => {
    try {
      const resultsData = await api.get(`/admin/session/${sessionId}/results`, {
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      // Log the resultsData object to inspect the API response
      console.log('resultsData:', resultsData.data.results)

      // Check if resultsData.data.results is an array
      if (Array.isArray(resultsData.data.results)) {
        if (resultsData.data.results.length === 0) {
          setResults([defaultPlayer])
        } else {
          setResults(resultsData.data.results)
        }
      } else {
        console.error(
          'resultsData.data.results is not an array:',
          resultsData.data.results
        )
      }
    } catch (error) {
      console.log(error)
    }
  }

  // advancing to the next question.
  const advanceToNextQuestion = async () => {
    try {
      await api.post(
        `/admin/quiz/${gameId}/advance`,
        {},
        {
          headers: {
            'Content-type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      )
      fetchStatus()
    } catch (error) {
      console.log(error)
    }
  }

  if (!gameStatus) {
    return (
      <>
        <div>Loading...</div>
      </>
    )
  }

  // Calculate the score for each question
  function calculateScores(results, questions) {
    return results.map((result, index) => {
      const question = questions[index];
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

  const renderResults = () => {
    if (!results) {
      return <div>Loading results...</div>
    }
    const calculatePercentageCorrect = (results) => {
      // Calculate the total number of questions
      const numQuestions = results[0]?.answers.length || 0

      // Initialize an array to store the number of correct answers for each question
      const correctCounts = Array(numQuestions).fill(0)

      // Iterate through the results to count the correct answers for each question
      results.forEach(({ answers }) => {
        answers.forEach((answer, index) => {
          if (answer.correct) {
            correctCounts[index]++
          }
        })
      })

      // Calculate the percentage of correct answers for each question
      const percentages = correctCounts.map(
        (count) => (count / results.length) * 100
      )

      return percentages
    }

    const calculateAverageResponseTime = (results) => {
      // Calculate the total number of questions
      const numQuestions = results[0]?.answers.length || 0

      // Initialize an array to store the total response time for each question
      const responseTimes = Array(numQuestions).fill(0)

      // Iterate through the results to calculate the response time for each question
      results.forEach(({ answers }) => {
        answers.forEach((answer, index) => {
          const answeredAt = new Date(answer.answeredAt)
          const questionStartedAt = new Date(answer.questionStartedAt)
          const responseTime = (answeredAt - questionStartedAt) / 1000
          responseTimes[index] += responseTime
        })
      })

      // Calculate the average response time for each question
      const averageResponseTimes = responseTimes.map(
        (totalTime) => totalTime / results.length
      )

      return averageResponseTimes
    }

    // Top 5 users and their scores

    // Scale the scores
    const topUsers = results.slice(0, 5).map((player, index) => {
      const scores = calculateScores(player.answers, gameStatus.results.questions);
      const totalScore = scores.reduce((acc, cur) => acc + cur, 0);
      return (
        <tr key={index}>
          <td>{player.name}</td>
          <td>{totalScore}</td>
        </tr>
      );
    });


    // Chart: Percentage of people (Y axis) got certain questions (X axis) correct
    const questionsCorrectData = {
      labels: results.map((_, index) => `Question ${index + 1}`),
      datasets: [
        {
          label: '% Correct',
          data: calculatePercentageCorrect(results),
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        },
      ],
    }

    // Chart: Average response/answer time for each question
    const averageResponseTimeData = {
      labels: results.map((_, index) => `Question ${index + 1}`),
      datasets: [
        {
          label: 'Avg Response Time (s)',
          data: calculateAverageResponseTime(results),
          backgroundColor: 'rgba(255, 206, 86, 0.2)',
          borderColor: 'rgba(255, 206, 86, 1)',
          borderWidth: 1,
        },
      ],
    }

    return (
      <>
        <h2>Game Results</h2>
        <Button
          size="small"
          variant="outlined"
          onClick={() => setShowCalculationDetails(!showCalculationDetails)}
        >
          {showCalculationDetails ? "Hide Details" : "Show Details"}
        </Button>
        {showCalculationDetails && (
          <Typography variant="body1" component="span">
            {" "}
            (The total score is calculated by sun of each question.
            The score for each question is calculated by scale up(1x to 2x) the basic score accoding to the time spent that player answered the question, and then round to integer.)
          </Typography>
        )}
        <h3>Top 5 Users</h3>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>{topUsers}</tbody>
        </table>
        <h3>Percentage of Correct Answers by Question</h3>
        <Bar data={questionsCorrectData} />
        <h3>Average Response Time by Question</h3>
        <Line data={averageResponseTimeData} />
        {/* Render any other interesting information you see fit */}
      </>
    )
  }

  return (
    <div>
      {gameStatus.results.active
        ? (
          <>
            <button onClick={advanceToNextQuestion}>Next Question</button>
            <Link to={'/Dashboard'}> Stop Game </Link>
          </>
        )
        : (
          renderResults()
        )}
    </div>
  )
}
export default AdminResult
