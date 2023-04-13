import React, { useContext } from 'react'
import Game from './Game'
import { GameContext } from './Dashboard'

export default function GameList ({ Games }) {
  const { handleGameAdd } = useContext(GameContext)

  return (
    <div className="Game-list">
      <div>
        {Games.map(game => {
          return (
            <Game key={game.id} {...game} />
          )
        })}
      </div>
      <div className="Game-list__add-Game-btn-container">
        <button
          className="btn btn--primary"
          onClick={handleGameAdd}
        >
          Add Game
        </button>
      </div>
    </div>
  )
}
