import React from 'react'
import {
  waitForElementToBeRemoved, render,
  fireEvent,
  waitFor,
  screen,
} from '@testing-library/react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { rest } from 'msw'
import { setupServer } from 'msw/node'

import SignIn from './SignIn'
import SignUp from './SignUp'
import Dashboard from './Dashboard'

const server = setupServer(
  rest.post('http://localhost:5005/admin/auth/login', (req, res, ctx) => {
    return res(ctx.json({ token: 'fake_token' }))
  })
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

function renderSignIn (onSuccess) {
  return render(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SignIn onSuccess={onSuccess} />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  )
}

test('renders the SignIn form', () => {
  renderSignIn()
  expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
  expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
  expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument()
})

test('handles failed login', async () => {
  jest.spyOn(window, 'alert').mockImplementation((message) => {
    console.log(message)
  })

  server.use(
    rest.post('http://localhost:5005/admin/auth/login', (res, ctx) => {
      return res(ctx.status(400))
    })
  )

  const onSuccess = jest.fn()
  renderSignIn(onSuccess)

  fireEvent.change(screen.getByLabelText(/email/i), {
    target: { value: 'test@example.com' },
  })
  fireEvent.change(screen.getByLabelText(/password/i), {
    target: { value: 'wrongpassword' },
  })
  fireEvent.click(screen.getByRole('button', { name: /login/i }))

  await waitFor(() => expect(window.alert).toHaveBeenCalled())
  expect(onSuccess).not.toHaveBeenCalled()

  // restore the original alert function
  jest.restoreAllMocks()
})

test('handles successful login', async () => {
  const onSuccess = jest.fn()
  renderSignIn(onSuccess)

  fireEvent.change(screen.getByLabelText(/email/i), {
    target: { value: 'test@example.com' },
  })
  fireEvent.change(screen.getByLabelText(/password/i), {
    target: { value: 'password123' },
  })
  const loginButton = screen.getByRole('button', { name: /login/i })
  fireEvent.click(loginButton)

  await waitForElementToBeRemoved(loginButton)
  //
})
