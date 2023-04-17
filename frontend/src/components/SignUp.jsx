import React from 'react'

function SignUp({ onSuccess }) {
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [name, setName] = React.useState('')

  async function register() {
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
      if (response.ok) {
        window.alert('Success: Account created')
      }
      else {
        throw new Error(`An error occurred: ${response.statusText}`)
      }

      const data = await response.json()
      onSuccess(data.token)
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
      Name: <input value={name} onChange={(e) => setName(e.target.value)} />
      <br />
      <button onClick={register}>Sign up</button>
    </>
  )
}

export default SignUp
