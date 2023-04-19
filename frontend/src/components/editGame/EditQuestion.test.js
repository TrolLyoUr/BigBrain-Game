import React from 'react'
import {
  render,
  screen,
  // waitFor,
  // waitForElementToBeRemoved,
} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter as Router } from 'react-router-dom'
import { AppContext } from '../../App'
import api from '../../api'
import EditQuestion from './EditQuestion'

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
}

// const fillForm = (questionText, timeLimit, points, answer1, answer2) => {
//   userEvent.type(screen.getByLabelText('Question Text'), questionText)
//   userEvent.type(screen.getByLabelText('Time Limit'), timeLimit)
//   userEvent.type(screen.getByLabelText('Points'), points)
//   userEvent.type(screen.getByLabelText('Answer 1'), answer1)
//   userEvent.type(screen.getByLabelText('Answer 2'), answer2)
// }

const renderEditQuestion = async (token) => {
  api.get.mockResolvedValueOnce({ data: gameData })
  render(
    <AppContext.Provider value={{ token }}>
      <Router>
        <EditQuestion />
      </Router>
    </AppContext.Provider>
  )
}

describe('EditQuestion', () => {
  it('renders without crashing', async () => {
    await renderEditQuestion('fake_token')
    const mockAlert = jest.spyOn(window, 'alert')
    mockAlert.mockImplementation(() => {})
  })

  it('displays error message when question text is empty', async () => {
    await renderEditQuestion('fake_token')
    userEvent.type(screen.getByLabelText('Question Text'), '')
    userEvent.type(screen.getByLabelText('Time Limit'), '10')
    userEvent.type(screen.getByLabelText('Points'), '10')
    userEvent.type(screen.getByLabelText('Answer 1'), 'Answer 1')
    userEvent.type(screen.getByLabelText('Answer 2'), 'Answer 2')
    userEvent.click(screen.getByText('Save Changes'))
  })
})
