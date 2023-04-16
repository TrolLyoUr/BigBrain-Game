import React, { useState, useEffect, useContext } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../api'
import { AppContext } from '../App'

const EditQuestion = () => {
  const { gameId, questionId } = useParams()
  const { token } = useContext(AppContext)
  const [questionData, setQuestionData] = useState({
    id: '',
    type: 'single_choice',
    text: '',
    time: 0,
    points: 0,
    media: {
      type: '',
      url: '',
    },
    answers: [
      { text: '', correct: false },
      { text: '', correct: false },
    ],
  })
  const [answerCount, setAnswerCount] = useState(questionData.answers.length)

  useEffect(() => {
    if (token)
      fetchQuestion()
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    const updatedQuestion = {
      id: questionData.id,
      type: questionData.type,
      text: questionData.text,
      time: questionData.time,
      points: questionData.points,
      media: questionData.media,
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
      window.alert("Answer text cannot be empty.");
      return;
    }

    const newAnswers = [...questionData.answers];

    if (questionData.type === "single" && e.target.checked) {
      newAnswers.forEach((answer) => (answer.correct = false));
    }

    newAnswers[index].correct = e.target.checked;
    setQuestionData({ ...questionData, answers: newAnswers });
  };


  return (
    <div>
      <h1>Edit Question</h1>
      <form onSubmit={handleSubmit}>
        {/* Question type */}
        <div>
          <label htmlFor="questionType">Question Type:</label>
          <select
            id="questionType"
            value={questionData.type || ''}
            onChange={(e) =>
              setQuestionData({ ...questionData, type: e.target.value })
            }
          >
            <option value="single">Single Choice</option>
            <option value="multiple">Multiple Choice</option>
          </select>
        </div>
        {/* Question text */}
        <div>
          <label htmlFor="questionText">Question Text:</label>
          <input
            type="text"
            id="questionText"
            value={questionData.text || ''}
            onChange={(e) =>
              setQuestionData({ ...questionData, text: e.target.value })
            }
          />
        </div>
        {/* Time limit */}
        <div>
          <label htmlFor="timeLimit">Time Limit:</label>
          <input
            type="number"
            id="timeLimit"
            value={questionData.time ? questionData.time.toString() : ''}
            onChange={(e) =>
              setQuestionData({
                ...questionData,
                time: parseInt(e.target.value, 10),
              })
            }
          />
        </div>
        {/* Points */}
        <div>
          <label htmlFor="points">Points:</label>
          <input
            type="number"
            id="points"
            value={questionData.points ? questionData.points.toString() : ''}
            onChange={(e) =>
              setQuestionData({
                ...questionData,
                points: parseInt(e.target.value, 10),
              })
            }
          />
        </div>
        {/* YouTube video URL or photo upload */}
        <div>
          <label htmlFor="media">Media (YouTube URL or Photo):</label>
          <input
            type="text"
            id="media"
            value={questionData.media ? questionData.media.url : ''}
            onChange={(e) =>
              setQuestionData({
                ...questionData,
                media: { ...questionData.media, url: e.target.value },
              })
            }
          />
        </div>

        {/* Answer count */}
        <div>
          <label htmlFor="answerCount">Answer Count:</label>
          <select
            id="answerCount"
            value={answerCount}
            onChange={(e) => {
              const newAnswerCount = parseInt(e.target.value, 10);
              setAnswerCount(newAnswerCount);
              updateAnswerList(newAnswerCount);
            }}
          >
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
          </select>
        </div>

        {/* Answers */}
        <div>
          <label>Answers:</label>
          {questionData.answers
            ? questionData.answers.map((answer, index) => (
              <div key={index}>
                <input
                  type="text"
                  value={answer.text || ""}
                  onChange={(e) => {
                    const newAnswers = [...questionData.answers];
                    newAnswers[index].text = e.target.value;
                    setQuestionData({ ...questionData, answers: newAnswers });
                  }}
                />
                <label>
                  <input
                    type="checkbox"
                    checked={answer.correct || false}
                    onChange={(e) => handleCheckboxChange(e, index)}
                  />
                  Correct
                </label>
              </div>
            ))
            : <p>Loading answers...</p>}
        </div>
        <button type="submit">Save Changes</button>
        &nbsp;&nbsp;
        <Link to={`/edit/game/${gameId}`}>Back to game page</Link>
      </form>
    </div>
  )
}

export default EditQuestion
