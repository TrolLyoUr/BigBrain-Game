import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
    root: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
    },
    questionContainer: {
        backgroundColor: '#ffffff',
        borderRadius: '5px',
        padding: '20px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        marginBottom: '30px',
    },
    questionText: {
        fontWeight: 'bold',
        fontSize: '24px',
        marginBottom: '20px',
    },
    answerButton: {
        backgroundColor: '#2196f3',
        color: '#ffffff',
        fontWeight: 'bold',
        padding: '10px 20px',
        borderRadius: '5px',
        textTransform: 'none',
        marginBottom: '10px',
        '&:hover': {
            backgroundColor: '#1976d2',
        },
    },
    timerProgress: {
        width: '100%',
        marginBottom: '20px',
    },
});

export default useStyles;
