import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../mocks/types';

import type { AppState } from '../store/index';

export interface UserState {
  token: string;
  user: User | null;
}

const initialState: UserState = {
  token: '',
  user: null,
};

export const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    loggedIn: (state: UserState, action: PayloadAction<{ token: string; user: User }>) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
    },
    logout: (state: UserState) => {
      state.token = '';
      state.user = null;
    },
  },
});

export const { loggedIn, logout } = usersSlice.actions;

export const selectToken = (state: AppState) => state.user.token;
export const selectCurrentUser = (state: AppState) => state.user.user;

export default usersSlice.reducer;
