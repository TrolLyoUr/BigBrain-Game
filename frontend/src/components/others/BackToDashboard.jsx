// components/BackToDashboard.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const BackToDashboard = () => {
    return (
        <Link to="/dashboard">
            <button>Back to Dashboard</button>
        </Link>
    );
};

export default BackToDashboard;
