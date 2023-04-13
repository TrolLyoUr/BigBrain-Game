import React from 'react'
import { useNavigate } from 'react-router-dom'

function SignIn ({ onSuccess }) {
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const navigate = useNavigate()

  async function login () {
    try {
      const response = await fetch('http://localhost:5005/admin/auth/login', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      })

      if (response.ok) {
        const { token } = await response.json()
        onSuccess(token)
        // Success: lead to dashboard
        navigate('/dashboard')
      } else {
        throw new Error(`An error occurred: ${response.statusText}`)
      }
    } catch (error) {
      window.alert('Error during login: ' + error.message)
    }
  }

  return (
    <>
      <br />
      Email: <input value={email} onChange={(e) => setEmail(e.target.value)} />
      <br />
      Password:{' '}
      <input value={password} onChange={(e) => setPassword(e.target.value)} />
      <br />
      <button onClick={login}>Sign in</button>
    </>
  )
}

export default SignIn