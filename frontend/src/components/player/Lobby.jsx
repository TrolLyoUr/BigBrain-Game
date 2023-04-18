import React, { useState } from 'react';
import { Container, Box, Typography, CircularProgress, Button } from '@mui/material';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
    root: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
        color: 'white',
    },
    progress: {
        margin: '30px',
    },
});

const funFacts = [
    'The Eiffel Tower can be 15 cm taller during the summer.',
    'Honey never spoils.',
    'The average person will spend six months of their life waiting for red lights to turn green.',
    'There are more possible iterations of a game of chess than there are atoms in the known universe.',
    'The Great Wall of China is not visible from space with the naked eye.',
];

function WaitingForGame() {
    const [factIndex, setFactIndex] = useState(Math.floor(Math.random() * funFacts.length));
    const classes = useStyles();

    const handleNextFact = () => {
        setFactIndex((prevIndex) => (prevIndex + 1) % funFacts.length);
    };

    // Waiting for game to start page
    return (
        <Container maxWidth="lg" className={classes.root}>
            <Box>
                <Typography variant="h3" component="h1">
                    Please wait for the game to start...
                </Typography>
            </Box>
            <Box>
                <Typography variant="h5" component="h3">
                    Fun Fact: {funFacts[factIndex]}
                </Typography>
            </Box>
            <Box>
                <Button variant="contained" color="info" onClick={handleNextFact}>
                    Show another fun fact
                </Button>
            </Box>
            <Box>
                <CircularProgress className={classes.progress} />
            </Box>
        </Container>
    );
}

export default WaitingForGame;
