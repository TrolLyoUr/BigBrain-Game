import React from 'react'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { act } from 'react-dom/test-utils'
import { BrowserRouter as Router } from 'react-router-dom'
import Dashboard from '../Dashboard'
import { AppContext } from '../../App'
import api from '../../api'

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
  test('renders the Create New Game button', () => {
    renderDashboard('fake_token')
    expect(
      screen.getByRole('button', { name: /create new game/i })
    ).toBeInTheDocument()
  })

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

    expect(screen.getByText(/test game/i)).toBeInTheDocument()
    expect(screen.getByText(/1 questions/i)).toBeInTheDocument()
    expect(screen.getByText(/total time: 10 seconds/i)).toBeInTheDocument()
    mockApi.mockRestore()
  })

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

  // Add more test cases here
})
