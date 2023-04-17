import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
// import api from '../api'
import { AppContext } from '../../App'

export default function Logout () {
  const { setToken } = useContext(AppContext)
  const navigate = useNavigate()
  // console.log(token)

  const logout = async () => {
    // try {
    //   await api.post('/admin/auth/logout', {
    //     headers: {
    //       'Content-type': 'application/json',
    //       Authorization: `Bearer ${token}`,
    //     },
    //   })
    //   //   setToken(null)
    //   //   localStorage.removeItem('token')
    //   navigate('/')
    // } catch (error) {
    //   // error handling code here
    // }
    setToken(null)
    localStorage.removeItem('token')
    navigate('/')
  }

  return <button onClick={logout}>Logout</button>
}
