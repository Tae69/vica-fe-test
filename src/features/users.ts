import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../mocks/types';

import type { AppState } from '../store/index';

export interface UsersState {
  token: string;
  user: User | null;
}

const initialState: UsersState = {
  token: '',
  user: null,
};

export const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    loggedIn: (state: UsersState, action: PayloadAction<{ token: string; user: User }>) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
    },
    logout: (state: UsersState) => {
      state.token = '';
      state.user = null;
    },
  },
});

export const { loggedIn, logout } = usersSlice.actions;

export const selectToken = (state: AppState) => state.users.token;
export const selectCurrentUser = (state: AppState) => state.users.user;

export default usersSlice.reducer;
