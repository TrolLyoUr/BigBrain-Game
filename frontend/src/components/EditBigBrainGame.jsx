import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const EditBigBrainGame = () => {
  const { gameId } = useParams();
  const [game, setGame] = useState(null);

  useEffect(() => {
    fetchGame();
  }, [gameId]);

  const fetchGame = async () => {
    const response = await axios.get(`/api/games/${gameId}`);
    setGame(response.data);
  };

  const updateGame = async (updatedGame) => {
    const response = await axios.put(`/api/games/${gameId}`, updatedGame);
    setGame(response.data);
  };

  const deleteQuestion = async (questionId) => {
    const updatedQuestions = game.questions.filter(
      (question) => question.id !== questionId
    );
    updateGame({ ...game, questions: updatedQuestions });
  };

  const addQuestion = async () => {
    const newQuestion = {
      id: Date.now(), // Generate a unique ID for simplicity
      text: '',
      time: 0
    };
    updateGame({ ...game, questions: [...game.questions, newQuestion] });
  };

  if (!game) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Edit BigBrain Game: {game.title}</h1>
      <label>
        Game Name:
        <input
          type="text"
          value={game.title}
          onChange={(e) => updateGame({ ...game, title: e.target.value })}
        />
      </label>
      <label>
        Thumbnail URL:
        <input
          type="text"
          value={game.thumbnail}
          onChange={(e) => updateGame({ ...game, thumbnail: e.target.value })}
        />
      </label>
      <h2>Questions</h2>
      {game.questions.map((question, index) => (
        <div key={question.id}>
          <h3>Question {index + 1}</h3>
          <label>
            Text:
            <input
              type="text"
              value={question.text}
              onChange={(e) => {
                const updatedQuestions = [...game.questions];
                updatedQuestions[index].text = e.target.value;
                updateGame({ ...game, questions: updatedQuestions });
              }}
            />
          </label>
          <label>
            Time (seconds):
            <input
              type="number"
              value={question.time}
              onChange={(e) => {
                const updatedQuestions = [...game.questions];
                updatedQuestions[index].time = parseInt(e.target.value, 10);
                updateGame({ ...game, questions: updatedQuestions });
              }}
            />
          </label>
          <button onClick={() => deleteQuestion(question.id)}>
            Delete Question
          </button>
        </div>
      ))}
      <button onClick={addQuestion}>Add New Question</button>
    </div>
  );
};

export default EditBigBrainGame;
