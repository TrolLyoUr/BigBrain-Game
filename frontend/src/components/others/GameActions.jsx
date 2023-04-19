import api from '../../api';
// import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'


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
    const newCopyLink = `${window.location.origin}/player/game/session/${ActiveSessionId}`;
    setCopyLink(newCopyLink);
    setSessionId(ActiveSessionId);
    setShowModal(true);
    setGameStatus((prevGameStatus) => ({
      ...prevGameStatus,
      [gameId]: ActiveSessionId,
    }));
  } catch (error) {
    console.log(error);
  }
};

const stopGame = async (gameId, token, setGameStatus, sessionId, navigate) => {
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

    Swal.fire({
      title: 'View Results?',
      text: 'Would you like to view the results?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        navigate(`/admin/result/game/${gameId}/session/${sessionId}`);
      }
    });
  } catch (error) {
    console.log(error);
  }

  setGameStatus((prevGameStatus) => ({
    ...prevGameStatus,
    [gameId]: false,
  }));
};

const viewResults = async (gameId, sessionId, navigate) => {
  Swal.fire({
    title: 'View Results?',
    text: 'Would you like to view the results?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Yes',
    cancelButtonText: 'No',
  }).then((result) => {
    if (result.isConfirmed) {
      navigate(`/admin/result/game/${gameId}/session/${sessionId}`);
    }
  });
};

export { startGame, stopGame, viewResults };
