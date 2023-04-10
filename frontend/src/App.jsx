import React from 'react'
import SignIn from './components/SignIn'
import SignUp from './components/SignUp'
import Dashboard from './components/Dashboard'
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  // useParams,
  // useNavigate,
  // Outlet,
} from 'react-router-dom'

const NavA = () => {
  return (
    <>
      <span>
        <Link to="/">SignIn</Link>
      </span>
      &nbsp;|&nbsp;
      <span>
        <Link to="/signup">SignUp</Link>
      </span>
    </>
  )
}
const NavB = () => {
  return (
    <>
      <span>
        <Link to="/dashboard">Dashboard</Link>
      </span>
    </>
  )
}

function App () {
  // const [page, setPage] = React.useState('signup')
  const [token, setToken] = React.useState(null)

  function manageTokenSet (token) {
    setToken(token)
    localStorage.setItem('token', token)
  }

  function logout () {
    setToken(null)
    localStorage.removeItem('token')
  }

  React.useEffect(function () {
    if (localStorage.getItem('token')) {
      setToken(localStorage.getItem('token'))
    }
  }, [])

  const LogIn = () => {
    return <SignIn onSuccess={manageTokenSet} />
  }
  const Register = () => {
    return <SignUp onSuccess={manageTokenSet} />
  }
  const Home = () => {
    return <Dashboard/>
  }

  return (
    <>
      <header>
        <BrowserRouter>
          {token
            ? (
            <>
              <NavB />
              &nbsp;
              <a href="/" onClick={logout}>
                Logout
              </a>
              <Routes>
                <Route path="/dashboard" element={<Home />} />
              </Routes>
            </>
              )
            : (
            <>
              <NavA />
              <Routes>
                <Route path="/" element={<LogIn />} />
                &nbsp;|&nbsp;
                <Route path="/signup" element={<Register />} />
              </Routes>
            </>
              )}
        </BrowserRouter>
      </header>
    </>
  )
}

export default App
