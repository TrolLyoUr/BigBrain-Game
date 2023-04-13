import React, { useContext } from 'react'
import { GameContext } from './Dashboard'
export default function Game (props) {
  const { handleGameDelete, handleGameSelect } = useContext(GameContext)
  const {
    id,
    name,
    questions,
    totalTime,
    thumbnail,
  } = props
  return (
    <div className="Game">
      <div className="Game__header">
        <h3 className="Game__title">{name}</h3>
        <div>
          <button
            className="btn btn--play mr-1"
            // onClick={() => handleGameSelect(id)}
          >
            Play
          </button>
          <button
            className="btn btn--primary mr-1"
            onClick={() => handleGameSelect(id)}
          >
            Edit
          </button>
          <button
            className="btn btn--danger"
            onClick={() => handleGameDelete(id)}
          >
            Delete
          </button>
        </div>
      </div>
      <div className="Game__row">
        <img src = {thumbnail}
        alt={`${name} thumbnail`}
        className="Game__thumbnail"
        />
      </div>
      <div className="Game__row">
        <span className="Game__label">questions:</span>
        <span className="Game__value">{questions}</span>
      </div>
      <div className="Game__row">
        <span className="Game__label">totalTime:</span>
        <span className="Game__value">{totalTime}</span>
      </div>
    </div>
  )
}
