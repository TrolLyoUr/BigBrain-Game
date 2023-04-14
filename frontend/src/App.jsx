import React, { createContext, useContext, useEffect, useState } from 'react'
import {
  createBrowserRouter,
  Outlet,
  Link,
  useNavigate,
  RouterProvider,
} from 'react-router-dom'

import SignIn from './components/SignIn'
import SignUp from './components/SignUp'
import Dashboard from './components/Dashboard'
import EditBigBrainGame from './components/EditBigBrainGame'

export const AppContext = createContext()

function App () {
  const [token, setToken] = useState(null)

  const manageTokenSet = (token) => {
    setToken(token)
    localStorage.setItem('token', token)
  }

  useEffect(() => {
    if (localStorage.getItem('token')) {
      setToken(localStorage.getItem('token'))
    }
  }, [])

  const Routers = createBrowserRouter([
    {
      element: <NavLayout />,
      children: [
        { path: '/', element: <SignIn onSuccess={manageTokenSet} /> },
        { path: '/signup', element: <SignUp onSuccess={manageTokenSet} /> },
      ],
    },
    {
      element: <DashboardLayout />,
      children: [
        { path: '/dashboard', element: <Dashboard /> },
        { path: '/edit/:gameId', element: <EditBigBrainGame/> },
      ],
    },
  ])

  return (
    <>
      <AppContext.Provider value={{ token, setToken }}>
        <RouterProvider router={Routers}>
          <Outlet />
        </RouterProvider>
      </AppContext.Provider>
    </>
  )
}

function NavLayout () {
  return (
    <>
      <nav>
        <span>
          <Link to="/">SignIn</Link>
        </span>
        &nbsp;|&nbsp;
        <span>
          <Link to="/signup">SignUp</Link>
        </span>
      </nav>
      <Outlet />
    </>
  )
}

function DashboardLayout () {
  const { setToken } = useContext(AppContext)
  const navigate = useNavigate()

  const logout = () => {
    setToken(null)
    localStorage.removeItem('token')
    navigate('/')
  }

  return (
    <>
      <nav>
        <span>
          <button onClick={logout}>Logout</button>
        </span>
      </nav>
      <Outlet />
    </>
  )
}

export default App
