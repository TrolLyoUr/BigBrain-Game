import React from 'react';
import IconButton from '@mui/material/IconButton';
import LinkIcon from '@mui/icons-material/Link';
import { Link as RouterLink } from 'react-router-dom';

const AdminResultButton = ({ gameId, sessionId }) => (
    <IconButton
        aria-label="Admin"
        component={RouterLink}
        to={`/admin/result/game/${gameId}/session/${sessionId}`}
    >
        <LinkIcon />
    </IconButton>
);

export default AdminResultButton;
