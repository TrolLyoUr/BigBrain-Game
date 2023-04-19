// App.js
import React, {
  createContext,
  useEffect,
  useState
} from 'react';
import {
  createBrowserRouter,
  Outlet,
  Link,
  RouterProvider,
} from 'react-router-dom';

import SignIn from './components/SignIn'
import SignUp from './components/SignUp'
import Dashboard from './components/Dashboard'
// editGame
import EditBigBrainGame from './components/editGame/EditBigBrainGame'
import EditQuestion from './components/editGame/EditQuestion'
// others
import Logout from './components/others/Logout'
// Admin
import AdminResult from './components/admin/AdminResult'
// player
import PlayerGame from './components/player/PlayerGame'
import PlayerGameNoid from './components/player/playerGameNoid'
import BackToDashboard from './components/others/BackToDashboard';

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
        {
          path: '/admin/result/game/:gameId/session/:sessionId',
          element: <AdminResult />,
        },
      ],
    },
    {
      element: <PlayerLayout />,
      children: [
        {
          path: '/player',
          element: <PlayerGameNoid />,
        },
        {
          path: '/player/game/session/:sessionId',
          element: <PlayerGame />,
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
  return (
    <>
      <nav>
        <span>
          <Logout />
        </span>
        <span>
          <BackToDashboard />
        </span>
      </nav>
      <Outlet />
    </>
  );
}

function PlayerLayout () {
  return (
    <>
      <nav>
        <span>
          {/*  */}
        </span>
      </nav>
      <Outlet />
    </>
  )
}

export default App
