import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import userReducer from '../reducers/user';
import borrowReducer from '../reducers/borrow';
import notificationReducer from '../reducers/notification';

export function makeStore() {
  return configureStore({
    reducer: { user: userReducer, borrow: borrowReducer, notification: notificationReducer }
  });
}

const store = makeStore();

export type AppState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  AppState,
  unknown,
  Action<string>
>;

export default store;
