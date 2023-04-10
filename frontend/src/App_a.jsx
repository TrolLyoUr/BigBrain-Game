// import React from 'react'
// import SignIn from './components/SignIn'
// import SignUp from './components/SignUp'
// import Dashboard from './components/Dashboard'

// // pages = signup, signin, dashbaord

// function App () {
//   const [page, setPage] = React.useState('signup')
//   const [token, setToken] = React.useState(null)

//   function manageTokenSet (token) {
//     setToken(token)
//     localStorage.setItem('token', token)
//   }

//   function logout () {
//     setToken(null)
//     localStorage.removeItem('token')
//   }

//   React.useEffect(function () {
//     if (localStorage.getItem('token')) {
//       setToken(localStorage.getItem('token'))
//     }
//   }, [])

//   return (
//     <>
//       <header>
//         <nav>
//           {token
//             ? (
//             <>
//               <a href="#" onClick={logout}>
//                 Logout
//               </a>
//             </>
//               )
//             : (
//             <>
//               <a href="#" onClick={() => setPage('signup')}>
//                 Sign Up
//               </a>
//               &nbsp;|&nbsp;
//               <a href="#" onClick={() => setPage('signin')}>
//                 Sign In
//               </a>
//             </>
//               )}
//         </nav>
//         <hr />
//       </header>
//       <main>
//         {token !== null
//           ? (
//           <Dashboard token={token} />
//             )
//           : page === 'signup'
//             ? (
//           <SignUp onSuccess={manageTokenSet} />
//               )
//             : (
//           <SignIn onSuccess={manageTokenSet} />
//               )}
//       </main>
//     </>
//   )
// }

// export default App
