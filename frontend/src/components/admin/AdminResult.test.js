import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { AppContext } from '../../App'
import AdminResult from './AdminResult'
import api from '../../api'

jest.mock('../../api')

const customRender = (ui, { providerProps, ...renderOptions }) => {
  return render(
    <AppContext.Provider {...providerProps}>
      <MemoryRouter initialEntries={['/admin/gameId/sessionId']}>
        <Routes>
          <Route path="/admin/:gameId/:sessionId" element={ui} />
        </Routes>
      </MemoryRouter>
    </AppContext.Provider>,
    renderOptions
  )
}

describe('AdminResult', () => {
  const mockToken = 'fake_token'
  const providerProps = {
    value: {
      token: mockToken,
    },
  }

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('Display loading information until the game state data is successfully obtained', async () => {
    api.get.mockResolvedValueOnce({ data: { results: { active: true } } })

    customRender(<AdminResult />, { providerProps })

    expect(screen.getByText(/Loading.../i)).toBeInTheDocument()

    await waitFor(() => {
      expect(api.get).toHaveBeenCalledTimes(1)
    })
  })

  test('Display loading information while loading result data', async () => {
    api.get.mockResolvedValueOnce({ data: { results: { active: false } } })

    customRender(<AdminResult />, { providerProps })

    await waitFor(() => {
      expect(api.get).toHaveBeenCalledTimes(1)
    })

    expect(screen.getByText(/Loading results.../i)).toBeInTheDocument()
  })
  test('When the game is over, display the game result', async () => {
    const mockResultsData = {
      data: {
        results: [
          {
            name: 'Player 1',
            answers: [
              {
                correct: true,
                answeredAt: new Date(),
                questionStartedAt: new Date(),
              },
              {
                correct: false,
                answeredAt: new Date(),
                questionStartedAt: new Date(),
              },
            ],
          },
        ],
      },
    }

    api.get
      .mockResolvedValueOnce({ data: { results: { active: false } } })
      .mockResolvedValueOnce(mockResultsData)

    customRender(<AdminResult />, { providerProps })

    await waitFor(() => {
      expect(api.get).toHaveBeenCalledTimes(2)
    })

    expect(screen.getByText(/Game Results/i)).toBeInTheDocument()
    expect(screen.getByText(/Top 5 Users/i)).toBeInTheDocument()
    expect(
      screen.getByText(/Percentage of Correct Answers by Question/i)
    ).toBeInTheDocument()
    expect(
      screen.getByText(/Average Response Time by Question/i)
    ).toBeInTheDocument()
  })

  test('Show "Next Question" and "Stop Game" buttons when the game is in progress', async () => {
    api.get.mockResolvedValueOnce({ data: { results: { active: true } } })

    customRender(<AdminResult />, { providerProps })

    await waitFor(() => {
      expect(api.get).toHaveBeenCalledTimes(1)
    })

    expect(screen.getByText(/Next Question/i)).toBeInTheDocument()
    expect(screen.getByText(/Stop Game/i)).toBeInTheDocument()
  })

  test('Click the "Next Question" button to move the request to the next question', async () => {
    api.get.mockResolvedValueOnce({ data: { results: { active: true } } })
    api.post.mockResolvedValueOnce({})

    customRender(<AdminResult />, { providerProps })

    await waitFor(() => {
      expect(api.get).toHaveBeenCalledTimes(1)
    })

    const nextQuestionButton = screen.getByText(/Next Question/i)
    userEvent.click(nextQuestionButton)

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith(
        '/admin/quiz/gameId/advance',
        {},
        {
          headers: {
            'Content-type': 'application/json',
            Authorization: `Bearer ${mockToken}`,
          },
        }
      )
    })
  })
})
