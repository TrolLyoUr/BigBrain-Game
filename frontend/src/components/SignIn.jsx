import React from 'react'
import { useNavigate } from 'react-router-dom'

function SignIn({ onSuccess }) {
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const navigate = useNavigate()

  async function login() {
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

        // Success: lead to dashboard
        navigate('/dashboard')
        onSuccess(token)
      } else {
        throw new Error(`An error occurred: ${response.statusText}`)
      }
    } catch (error) {
      if (error.response) {
        switch (error.response.status) {
          case 400:
            window.alert(
              `Error: Bad Input (400) ${JSON.stringify(error.response.data)}`
            )
            break
          default:
            window.alert(`Error: ${error.response.status}`)
        }
      } else if (error.request) {
        // The request was made, but no response was received
        window.alert('Error: No response received')
      } else {
        // Something happened in setting up the request that triggered an error
        window.alert(`Error: ${error.message}`)
      }
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
