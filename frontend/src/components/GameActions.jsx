import api from '../api';


const startGame = async (gameId, token, setCopyLink, setSessionId, setShowModal, setGameStatus) => {
  try {
    await api.post(
      `/admin/quiz/${gameId}/start`,
      {},
      {
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const gameResponse = await api.get(`/admin/quiz/${gameId}`, {
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const ActiveSessionId = gameResponse.data.active;
    const newCopyLink = `${window.location.origin}/game/${gameId}/session/${ActiveSessionId}`;
    setCopyLink(newCopyLink);
    setSessionId(ActiveSessionId);
    setShowModal(true);
  } catch (error) {
    console.log(error);
  }

  setGameStatus((prevGameStatus) => ({
    ...prevGameStatus,
    [gameId]: true,
  }));
};

const stopGame = async (gameId, token, setGameStatus) => {
  try {
    await api.post(
      `/admin/quiz/${gameId}/end`,
      {},
      {
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (window.confirm('Would you like to view the results?')) {
      // Redirect to the results page
    }
  } catch (error) {
    console.log(error);
  }

  setGameStatus((prevGameStatus) => ({
    ...prevGameStatus,
    [gameId]: false,
  }));
};

export { startGame, stopGame };
