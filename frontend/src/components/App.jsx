import React from 'react'
import Signin from './signin'
import Signup from './signup'

function Dashboard () {
  return <>Dashboard</>
}

function App () {
  const [page, setPage] = React.useState('signup')
  return (
    <>
      <header>
        <nav>
          <a href="#" onClick={() => setPage('signin')}>signin</a>
          &nbsp;&nbsp;
          <a href="#" onClick={() => setPage('signup')}>signup</a>
        </nav>
      </header>
      <main>
        {
          page === 'signup' ? <Signup/> : page === 'signin' ? <Signin /> : <Dashboard/>
        }
      </main>
    </>
  )
}

export default App
