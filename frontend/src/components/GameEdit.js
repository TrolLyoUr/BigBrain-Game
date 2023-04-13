import React, { useContext } from 'react'
import { GameContext } from './Dashboard'

export default function GameEdit ({ Game }) {
  const { handleGameChange } = useContext(GameContext)

  function handleChange (changes) {
    handleGameChange(Game.id, { ...Game, ...changes })
  }

  return (
    <div className="Game-edit">
      <div className="Game-edit__details-grid">
        <label
          htmlFor="name"
          className="Game-edit__label">
          Name
        </label>
        <input
          type="text"
          name="name"
          id="name"
          value={Game.name}
          onChange={e => handleChange({ name: e.target.value })}
          className="Game-edit__input" />
        <label
          htmlFor="cookTime"
          className="Game-edit__label">
          Cook Time
        </label>
        <input
          type="text"
          name="cookTime"
          id="cookTime"
          value={Game.cookTime}
          onChange={e => handleChange({ cookTime: e.target.value })}
          className="Game-edit__input" />
        <label
          htmlFor="servings"
          className="Game-edit__label">
          Servings
        </label>
        <input
          type="number"
          min="1"
          name="servings"
          id="servings"
          value={Game.servings}
          onChange={e => handleChange({ servings: parseInt(e.target.value) || '' })}
          className="Game-edit__input" />
      </div>
    </div>
  )
}
