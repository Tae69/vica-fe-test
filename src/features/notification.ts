import { AlertColor } from '@mui/material';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import type { AppState } from '../store/index';

export interface SnackbarMessage {
  message: string;
  key: number;
}

export interface State {
  message: SnackbarMessage;
  open: boolean;
  severity: AlertColor;
}

const initialState: State = {
  message: { key: 0, message: '' },
  open: false,
  severity: 'success'
};

export const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    openNotification: (
      state: State,
      action: PayloadAction<{ message: string; severity?: AlertColor }>
    ) => {
      const { message, severity } = action.payload;

      state.message = { key: new Date().getTime(), message };
      state.severity = severity || 'success';
      state.open = true;
    },
    closeNotification: (state: State) => {
      state.open = false;
      state.message = { key: 0, message: '' };
    }
  }
});

export const { openNotification, closeNotification } = notificationSlice.actions;

export const selectNotification = (state: AppState) => state.notification;

export default notificationSlice.reducer;
