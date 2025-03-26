import React from "react";
import { Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { ErrorOutline } from "@mui/icons-material";

const ErrorModal = ({ showError, error, onClose }) => {

  return (
    <Dialog
      open={showError}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title" sx={{display: 'flex', gap: 2, alignItems: 'center'}}>
        <ErrorOutline fontSize="large" sx={{ color: '#ff2424' }}/>
        <div>{"Something went wrong"}</div>
      </DialogTitle>
      <DialogContent>
        {"An unexpected error occurred. Please try again later."}
        {error?.message && <div>{`Error: ${error.message}`}</div>}
        {error?.code && <div>{`Code: ${error.code}`}</div>}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}

export default ErrorModal;