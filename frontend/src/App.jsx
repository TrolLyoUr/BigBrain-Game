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
import {
  AppBar,
  Box,
  Container,
  CssBaseline,
  IconButton,
  Toolbar,
  Typography,
  useTheme,
} from '@mui/material';
import { Home as HomeIcon } from '@mui/icons-material';

import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import Dashboard from './components/Dashboard';
import EditBigBrainGame from './components/editGame/EditBigBrainGame';
import EditQuestion from './components/editGame/EditQuestion';
import Logout from './components/others/Logout';
import AdminResult from './components/admin/AdminResult';
import PlayerGame from './components/player/PlayerGame';
import PlayerGameNoid from './components/player/playerGameNoid';
import BackToDashboard from './components/others/BackToDashboard';

export const AppContext = createContext();

function App() {
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
          <CssBaseline />
          <Outlet />
        </RouterProvider>
      </AppContext.Provider>
    </>
  );
}

function NavLayout() {
  const theme = useTheme();

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            BigBrain
          </Typography>
          <IconButton color="inherit" edge="end" component={Link} to="/">
            <HomeIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Container>
        <Box sx={{ my: theme.spacing(4) }}>
          <Outlet />
        </Box>
      </Container>
    </>
  );
}

function DashboardLayout() {
  const theme = useTheme();

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            BigBrain
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <BackToDashboard />
            <Logout />
          </Box>
        </Toolbar>
      </AppBar>
      <Container>
        <Box sx={{ my: theme.spacing(4) }}>
          <Outlet />
        </Box>
      </Container>
    </>
  );
}

function PlayerLayout() {
  const theme = useTheme();

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            BigBrain
          </Typography>
        </Toolbar>
      </AppBar>
      <Container>
        <Box sx={{ my: theme.spacing(4) }}>
          <Outlet />
        </Box>
      </Container>
    </>
  );
}

export default App;