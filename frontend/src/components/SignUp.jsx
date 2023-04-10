import React from 'react'

function SignUp ({ onSuccess }) {
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [name, setName] = React.useState('')

  async function register () {
    try {
      const response = await fetch(
        'http://localhost:5005/admin/auth/register',
        {
          method: 'POST',
          headers: {
            'Content-type': 'application/json',
          },
          body: JSON.stringify({
            email,
            password,
            name,
          }),
        }
      )

      if (!response.ok) {
        throw new Error(`An error occurred: ${response.statusText}`)
      }

      const data = await response.json()
      onSuccess(data.token)
    } catch (error) {
      // console.error('Error during registration:', error)
      window.alert('Error during registeration: ' + error.message)
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
      Name: <input value={name} onChange={(e) => setName(e.target.value)} />
      <br />
      <button onClick={register}>Sign up</button>
    </>
  )
}

export default SignUp
