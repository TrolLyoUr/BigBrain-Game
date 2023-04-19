import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import SignUp from './SignUp'

describe('SignUp', () => {
  beforeEach(() => {
    jest.spyOn(window, 'fetch')
    jest.spyOn(window, 'alert').mockImplementation(() => {})
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  test('should render form correctly', () => {
    render(<SignUp onSuccess={() => {}} />)

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument()
  })

  test('should submit form successfully', async () => {
    window.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ token: 'fake_token' }),
    })

    const onSuccessMock = jest.fn()

    render(<SignUp onSuccess={onSuccessMock} />)

    userEvent.type(screen.getByLabelText(/email/i), 'test@email.com')
    userEvent.type(screen.getByLabelText(/password/i), 'password123')
    userEvent.type(screen.getByLabelText(/name/i), 'Test User')
    userEvent.click(screen.getByRole('button', { name: /sign up/i }))

    await waitFor(() =>
      expect(onSuccessMock).toHaveBeenCalledWith('fake_token')
    )

    expect(window.fetch).toHaveBeenCalledWith(
      'http://localhost:5005/admin/auth/register',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify({
          email: 'test@email.com',
          password: 'password123',
          name: 'Test User',
        }),
      })
    )
  })
})
