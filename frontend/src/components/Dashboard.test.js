import React from 'react'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { act } from 'react-dom/test-utils'
import { BrowserRouter as Router } from 'react-router-dom'
import Dashboard from './Dashboard'
import { AppContext } from '../App'
import api from '../api'

function renderDashboard (token) {
  return render(
    <AppContext.Provider value={{ token }}>
      <Router>
        <Dashboard />
      </Router>
    </AppContext.Provider>
  )
}

describe('Dashboard', () => {
  test('renders without crashing', () => {
    renderDashboard('fake_token')
  })
  test('displays an error message when API returns an error', async () => {
    const mockAlert = jest.spyOn(window, 'alert')
    mockAlert.mockImplementation(() => {})
    // api
    const mockApi = jest.spyOn(api, 'get')
    mockApi.mockRejectedValue(new Error('Network error'))

    renderDashboard('fake_token')
    await waitFor(() => {
      expect(mockApi).toHaveBeenCalledTimes(1)
      expect(mockApi).toHaveBeenCalledWith(
        '/admin/quiz',
        {
          headers: {
            'Content-type': 'application/json',
            Authorization: 'Bearer fake_token',
          },
        }
      )
      expect(mockAlert).toHaveBeenCalledWith('Error: Network error')
    })
    mockAlert.mockRestore()
  })
  test('renders the Create New Game button', () => {
    renderDashboard('fake_token')
    expect(
      screen.getByRole('button', { name: /create new game/i })
    ).toBeInTheDocument()
  })
  test('prompts for new game name when "Create New Game" button is clicked', async () => {
    const promptSpy = jest.spyOn(window, 'prompt')
    promptSpy.mockReturnValue('New Game Name')
    const alertSpy = jest.spyOn(window, 'alert')
    alertSpy.mockImplementation(() => {})
    // api
    const mockApi = jest.spyOn(api, 'post')
    mockApi.mockResolvedValue({})

    renderDashboard('fake_token')
    const createButton = screen.getByText(/Create New Game/i)
    fireEvent.click(createButton)
    expect(promptSpy).toHaveBeenCalledTimes(1)
    expect(promptSpy).toHaveBeenCalledWith('Enter a name for the new game:')
    await waitFor(() => {
      expect(mockApi).toHaveBeenCalledTimes(1)
      expect(mockApi).toHaveBeenCalledWith(
        '/admin/quiz/new',
        { name: 'New Game Name' },
        {
          headers: {
            'Content-type': 'application/json',
            Authorization: 'Bearer fake_token',
          },
        }
      )
    })
  })
  //
  test('renders an empty game list correctly', async () => {
    const mockApi = jest.spyOn(api, 'get')
    mockApi.mockResolvedValue({ data: { quizzes: [] } })
    renderDashboard('fake_token')
    await act(async () => {
      await waitFor(() => {
        expect(mockApi).toHaveBeenCalledTimes(1)
      })
    })
    expect(screen.queryByText(/total time/i)).not.toBeInTheDocument()
    mockApi.mockRestore()
  })
  test('renders a game list with one game correctly', async () => {
    const mockGame = {
      id: '1',
      name: 'Test Game',
      questions: [{ time: 10 }],
    }
    const mockApi = jest.spyOn(api, 'get')
    mockApi
      .mockResolvedValueOnce({ data: { quizzes: [{ id: '1' }] } })
      .mockResolvedValueOnce({ data: { ...mockGame, active: false } })
    renderDashboard('fake_token')
    await waitFor(() => {
      expect(mockApi).toHaveBeenCalledTimes(2)
    })
    const foundElement = await screen.findByText(/Test Game/i)
    expect(foundElement).toBeInTheDocument()
    expect(screen.getByText(/1 questions/i)).toBeInTheDocument()
    expect(screen.getByText(/total time: 10 seconds/i)).toBeInTheDocument()
    mockApi.mockRestore()
  })
  //
  test('deletes a game when delete button is clicked', async () => {
    const mockGame = {
      id: '1',
      name: 'Test Game',
      questions: [{ time: 10 }],
    }
    const mockApiGet = jest.spyOn(api, 'get')
    mockApiGet
      .mockResolvedValueOnce({ data: { quizzes: [{ id: '1' }] } })
      .mockResolvedValueOnce({ data: { ...mockGame, active: false } })
    const mockApiDelete = jest.spyOn(api, 'delete')
    mockApiDelete.mockResolvedValue({})
    renderDashboard('fake_token')
    await waitFor(() => {
      expect(mockApiGet).toHaveBeenCalledTimes(2)
    })
    fireEvent.click(screen.getByLabelText(/delete/i))
    await waitFor(() => {
      expect(mockApiDelete).toHaveBeenCalledTimes(1)
    })
    expect(screen.queryByText(/test game/i)).not.toBeInTheDocument()
    mockApiGet.mockRestore()
    mockApiDelete.mockRestore()
  })

  test('when edit button is clicked', async () => {
    // game
    const gameId = 123
    const gamesList = [
      {
        id: gameId,
        name: 'Test Game',
        // 其他遊戲屬性
      },
    ]
    // get
    const mockApi = jest.spyOn(api, 'get')
    mockApi.mockResolvedValue({ data: { quizzes: gamesList } })
    renderDashboard('fake_token')
    await waitFor(() => {
      expect(mockApi).toHaveBeenCalledTimes(2)
    })
    // click
    const editButton = screen.getByLabelText(/edit/i)
    userEvent.click(editButton)
    // check url
    expect(window.location.pathname).toBe(`/edit/game/${gameId}`)
    mockApi.mockRestore()
  })
//   test('when play button is clicked', async () => {
//   })
})
