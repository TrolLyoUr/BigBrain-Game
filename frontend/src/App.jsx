import React, {
  createContext,
  // useContext,
  useEffect,
  useState
} from 'react'
import {
  createBrowserRouter,
  Outlet,
  Link,
  // useNavigate,
  RouterProvider,
} from 'react-router-dom'
// import api from './api'

import SignIn from './components/SignIn'
import SignUp from './components/SignUp'
import Logout from './components/Logout'
//
import Dashboard from './components/Dashboard'
import EditBigBrainGame from './components/EditBigBrainGame'
import EditQuestion from './components/EditQuestion'
//
// import GamePlay from './components/GamePlay'
import GameResults from './components/GameResults'

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
        { path: '/edit/game/:gameId', element: <EditBigBrainGame /> },
        {
          path: '/edit/game/:gameId/question/:questionId',
          element: <EditQuestion />,
        },
        // {
        //   path: '/play/:sessionId', element: <GamePlay />
        // },
        {
          path: '/game/:gameId/session/:sessionId',
          element: <GameResults />,
        },
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
  // const { token, setToken } = useContext(AppContext)
  // const navigate = useNavigate()

  // const logout = () => {
  //   setToken(null)
  //   localStorage.removeItem('token')
  //   navigate('/')
  // }

  return (
    <>
      <nav>
        <span>
          <Logout />
        </span>
      </nav>
      <Outlet />
    </>
  )
}

export default App
