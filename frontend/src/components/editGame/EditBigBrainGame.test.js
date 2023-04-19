import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
// import { act } from 'react-dom/test-utils'
import { BrowserRouter as Router } from 'react-router-dom'
// import Dashboard from './Dashboard'
import { AppContext } from '../../App'
import api from '../../api'
import EditBigBrainGame from './EditBigBrainGame'

// Mock the API module
jest.mock('../../api', () => ({
  get: jest.fn(),
  put: jest.fn(),
}))

const gameData = {
  id: 1,
  name: 'Test Game',
  thumbnail: 'https://example.com/test-thumbnail.jpg',
  questions: [],
};

const renderEditBigBrainGame = async (token) => {
  api.get.mockResolvedValueOnce({ data: gameData })
  render(
    <AppContext.Provider value={{ token }}>
      <Router>
        <EditBigBrainGame />
      </Router>
    </AppContext.Provider>
  )
  await screen.findByText('Edit BigBrain Game: Test Game')
}

describe('EditBigBrainGame', () => {
  it('renders without crashing', async () => {
    await renderEditBigBrainGame('fake_token')
  })
  it('displays the correct heading', async () => {
    await renderEditBigBrainGame('fake_token')
    const heading = screen.getByRole('heading', { level: 4 })
    expect(heading).toHaveTextContent('Edit BigBrain Game: Test Game')
  })
  it('displays the game name and thumbnail URL input fields', async () => {
    await renderEditBigBrainGame('fake_token')
    const gameNameInput = screen.getByLabelText(/game name/i)
    const thumbnailUrlInput = screen.getByLabelText(/thumbnail url/i)
    expect(gameNameInput).toBeInTheDocument()
    expect(thumbnailUrlInput).toBeInTheDocument()
  })
  it('displays the Add New Question button', async () => {
    await renderEditBigBrainGame('fake_token')
    const button = screen.getByRole('button', { name: /add new question/i })
    expect(button).toBeInTheDocument()
  })
  it('adds a new question when the Add New Question button is clicked', async () => {
    const fakeId = 'fake_game_id'
    await renderEditBigBrainGame('fake_token', fakeId)
    const initialQuestions = screen.queryAllByText(/Question \d+/)
    const button = screen.getByRole('button', { name: /add new question/i })
    userEvent.click(button)

    // Since adding a new question will call api.put to update the game data, you need to mock the api.put call.
    api.put.mockResolvedValueOnce()

    // Mock the updated gameData with the new question and resolve it.
    const updatedGameData = { ...gameData, questions: [{ id: 1234567890 }] }
    api.get.mockResolvedValueOnce({ data: updatedGameData })

    // Find the element that contains the text "Question 1"
    await waitFor(() => {
      const updatedQuestions = screen.queryAllByText(/Question \d+/)
      expect(updatedQuestions.length).toBe(initialQuestions.length + 1)
    })

    // Verify if api.put was called with the correct data
    const newQuestion = {
      id: expect.any(Number),
      type: 'single',
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
    }

    expect(api.put).toHaveBeenCalledWith(
      `/admin/quiz/${undefined}`,
      { ...gameData, questions: [...gameData.questions, newQuestion] },
      {
        headers: {
          'Content-type': 'application/json',
          Authorization: 'Bearer fake_token',
        },
      }
    )
  })
})
