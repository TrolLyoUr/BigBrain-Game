import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import { AppContext } from '../../App'
import Logout from './Logout'

const customRender = (ui, { providerProps, ...renderOptions }) => {
  return render(
    <AppContext.Provider {...providerProps}>{ui}</AppContext.Provider>,
    { wrapper: BrowserRouter, ...renderOptions }
  )
}

describe('Logout', () => {
  const originalRemoveItem = localStorage.removeItem
  const removeItemSpy = jest.fn()

  beforeEach(() => {
    localStorage.removeItem = removeItemSpy
  })

  afterEach(() => {
    localStorage.removeItem = originalRemoveItem
  })

  test('clean the token', () => {
    const setToken = jest.fn()
    const providerProps = {
      value: {
        token: 'fake_token',
        setToken,
      },
    }

    customRender(<Logout />, { providerProps })

    const logoutButton = screen.getByRole('button', { name: /logout/i })
    userEvent.click(logoutButton)

    expect(setToken).toHaveBeenCalledWith(null)
    expect(removeItemSpy).toHaveBeenCalledWith('token')
  })
})
