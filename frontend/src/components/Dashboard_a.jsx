// import React from 'react'
// import Button from './Button'

// function Dashboard ({ token }) {
//   const [newGameShow, setNewGameShow] = React.useState(false)
//   const [quizzes, setQuizzes] = React.useState([])

//   const [newQuizName, setNewQuizName] = React.useState('')

//   async function fetchAllQuizzes () {
//     const response = await fetch('http://localhost:5005/admin/quiz', {
//       method: 'GET',
//       headers: {
//         'Content-type': 'application/json',
//         Authorization: `Bearer ${token}`,
//       },
//     })
//     const data = await response.json()
//     if (Array.isArray(data.quizzes)) {
//       setQuizzes(data.quizzes)
//     } else {
//       console.error('Unexpected data format:', data)
//       setQuizzes([])
//     }
//   }

//   React.useEffect(() => {
//     (async () => {
//       await fetchAllQuizzes()
//     })()
//   }, [newGameShow])

//   async function createNewGame () {
//     await fetch('http://localhost:5005/admin/quiz/new', {
//       method: 'POST',
//       headers: {
//         'Content-type': 'application/json',
//         Authorization: `Bearer ${token}`,
//       },
//       body: JSON.stringify({
//         name: newQuizName,
//       }),
//     })
//     await fetchAllQuizzes()
//   }

//   return (
//     <>
//       Dashboard! list games...
//       <br />
//       {quizzes.map((quiz) => (
//         <React.Fragment key={quiz.id}>
//           <b>{quiz.name}</b>
//           <br />
//         </React.Fragment>
//       ))}
//       <br />
//       <hr />
//       <br />
//       <Button variant="contained" onClick={() => setNewGameShow(!newGameShow)}>
//         {newGameShow ? 'Hide' : 'Show'} Create New Game
//       </Button>
//       {newGameShow && (
//         <>
//           <br />
//           Form here for new game!
//           <br />
//           Name:{' '}
//           <input
//             value={newQuizName}
//             onChange={(e) => setNewQuizName(e.target.value)}
//           />
//           <br />
//           <Button variant="contained" onClick={createNewGame}>
//             Create new game
//           </Button>
//         </>
//       )}
//     </>
//   )
// }

// export default Dashboard
