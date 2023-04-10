import React from 'react'

function SignIn ({ onSuccess }) {
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')

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

      if (!response.ok) {
        throw new Error(`An error occurred: ${response.statusText}`)
      }

      const data = await response.json()
      onSuccess(data.token)
    } catch (error) {
      // console.error('Error during login:', error)
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
