// import React, { useEffect, useState } from 'react'
// import { useParams } from 'react-router-dom'
// import Button from './Button'

// export default function EditGame ({ token }) {
//   const { quizId } = useParams()
//   const [quiz, setQuiz] = useState(null)
//   const [questions, setQuestions] = useState(null)

//   useEffect(() => {
//     async function fetchQuiz () {
//       const response = await fetch(
//         `http://localhost:5005/admin/quiz/${quizId}`,
//         {
//           method: 'GET',
//           headers: {
//             'Content-type': 'application/json',
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       )
//       const data = await response.json()
//       setQuiz(data)
//       setQuestions(data.questions)
//     }
//     fetchQuiz()
//   }, [quizId])

//   async function deleteQuestion (questionId) {
//     const response = await fetch(
//         `http://localhost:5005/admin/quiz/${quizId}`,
//         {
//           method: 'GET',
//           headers: {
//             'Content-type': 'application/json',
//             Authorization: `Bearer ${token}`,
//           },
//         }
//     )
//     const data = await response.json()
//     updateGameMetadata(() => { data.questions.filter((i) => i.id !== questionId) })
//   }

//   async function addQuestion () {
//     const response = await fetch(
//         `http://localhost:5005/admin/quiz/${quizId}`,
//         {
//           method: 'GET',
//           headers: {
//             'Content-type': 'application/json',
//             Authorization: `Bearer ${token}`,
//           },
//         }
//     )
//     const data = await response.json()
//     const newQuestion = {
//       id: data.questions.length + 1,
//       name: ''
//     }
//     const updatedQuestions = [...questions, newQuestion]
//     const response2 = await fetch(`http://localhost:5005/admin/quiz/${quizId}`, {
//       method: 'PUT',
//       headers: {
//         'Content-type': 'application/json',
//         Authorization: `Bearer ${token}`,
//       },
//       body: JSON.stringify(updatedQuestions), // 在请求体中添加更新后的问题数组
//     })

//     // 检查响应状态
//     if (response2.ok) {
//       // 请求成功，使用新的问题数组更新本地状态
//       setQuestions(updatedQuestions)
//     } else {
//       // 请求失败，处理错误（例如：显示错误消息）
//       console.error(`Error updating quiz: ${response2.statusText}`)
//     }
//   }

//   async function updateGameMetadata (newQuiz) {
//     // const response = await fetch(
//     //       `http://localhost:5005/admin/quiz/${quizId}`,
//     //       {
//     //         method: 'PUT',
//     //         headers: {
//     //           'Content-type': 'application/json',
//     //           Authorization: `Bearer ${token}`,
//     //         },
//     //       }
//     // )
//     // const data = await response.json()
//   }

//   if (!quiz) {
//     return <div>Loading...</div>
//   }

//   return (
//     <>
//       <h1>Edit Game: {quiz.name}</h1>
//       <h3>Questions:</h3>
//       <ul>
//         {quiz.questions.map((question, index) => (
//           <li key={question.id}>
//             Question {index + 1}: {question.question}{' '}
//             <Button
//               variant="contained"
//               onClick={() => deleteQuestion(question.id)}
//             >
//               Delete
//             </Button>
//           </li>
//         ))}
//       </ul>
//       <Button variant="contained" onClick={addQuestion}>
//         Add Question
//       </Button>
//       <h3>Game Metadata:</h3>
//       <form
//         onSubmit={(e) => {
//           e.preventDefault()
//           updateGameMetadata(quiz)
//         }}
//       >
//         <label>
//           Name:
//           <input
//             value={quiz.name}
//             onChange={(e) => setQuiz({ ...quiz, name: e.target.value })}
//           />
//         </label>
//         <br />
//         <label>
//           Thumbnail:
//           <input
//             value={quiz.thumbnail || ''}
//             onChange={(e) => setQuiz({ ...quiz, thumbnail: e.target.value })}
//           />
//         </label>
//         <br />
//         <Button variant="contained" type="submit">
//           Update Game Metadata
//         </Button>
//       </form>
//     </>
//   )
// }
