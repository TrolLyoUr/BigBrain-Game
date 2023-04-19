import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import CSVReader from 'react-csv-reader';

const CsvUploadModal = ({ open, gameId, onClose, onUpload, onError }) => {
  const handleCsvUpload = (data) => {
    onUpload(gameId, data);
    onClose();
  };

  const handleFileError = (err) => {
    onError(err);
    onClose();
  };

  return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Upload a CSV file for the new game</DialogTitle>
            <DialogContent>
                <CSVReader
                    onFileLoaded={handleCsvUpload}
                    onError={handleFileError}
                    parserOptions={{
                      header: true,
                      dynamicTyping: true,
                      skipEmptyLines: true,
                      transformHeader: (header) => header.trim().toLowerCase(),
                    }}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    Cancel
                </Button>
            </DialogActions>
        </Dialog>
  );
};

export default CsvUploadModal;
