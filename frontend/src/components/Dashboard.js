import React, { useState, useEffect } from 'react';
import GameList from './GameList'
import '../css/dashboard.css'
import { v4 as uuidv4 } from 'uuid'
import GameEdit from './GameEdit';
import kahootImage from './kahoot.png'

export const GameContext = React.createContext()
const LOCAL_STORAGE_KEY = 'cookingWithReact.Games'

function App () {
  const [selectedGameId, setSelectedGameId] = useState()
  const [Games, setGames] = useState(sampleGames)

  const selectedGame = Games.find(Game => Game.id === selectedGameId)

  useEffect(() => {
    const GameJSON = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (GameJSON != null) setGames(JSON.parse(GameJSON))
  }, [])

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(Games))
  }, [Games])

  const GameContextValue = {
    handleGameAdd,
    handleGameDelete,
    handleGameSelect,
    handleGameChange
  }

  function handleGameSelect (id) {
    setSelectedGameId(id)
  }

  function handleGameAdd () {
    const newGame = {
      id: uuidv4(),
      name: <input
          type="text"
          name="name"
          id="name"
          />,
      questions: 0,
      totalTime: '',
      thumbnail: kahootImage,
    }

    setSelectedGameId(newGame.id)
    setGames([...Games, newGame])
  }

  function handleGameChange (id, Game) {
    const newGames = [...Games]
    const index = newGames.findIndex(r => r.id === id)
    newGames[index] = Game
    setGames(newGames)
  }

  function handleGameDelete (id) {
    // clear out selectedID
    if (selectedGameId != null && selectedGameId === id) {
      setSelectedGameId(undefined)
    }
    setGames(Games.filter(Game => Game.id !== id))
  }

  return (
    <GameContext.Provider value={GameContextValue}>
      <GameList Games={Games} />
      {/* hidden or not */}
      {selectedGame && <GameEdit Game={selectedGame} />}
    </GameContext.Provider>
  )
}

const sampleGames = [
  {
    id: 1,
    name: 'Game',
    questions: 0,
    totalTime: '0:00',
    thumbnail: kahootImage,
  },
  {
    id: 2,
    name: 'Game',
    questions: 0,
    totalTime: '0:00',
    thumbnail: kahootImage,
  },
]

export default App;
