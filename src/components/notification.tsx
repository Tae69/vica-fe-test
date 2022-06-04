import React from 'react';
import { Alert, Snackbar } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { closeNotification, selectNotification } from '../reducers/notification';

function Notification() {
  const { open, message, severity } = useAppSelector(selectNotification);
  const dispatch = useAppDispatch();

  const handleClose = () => {
    dispatch(closeNotification());
  };

  return (
    <Snackbar
      key={message.key}
      open={open}
      autoHideDuration={3000}
      onClose={handleClose}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
    >
      <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
        {message.message}
      </Alert>
    </Snackbar>
  );
}

export default Notification;
