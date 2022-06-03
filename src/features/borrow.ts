import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Book, User } from '../mocks/types';

import type { AppState } from '../store/index';

export interface BorrowState {
  books: {
    [key: number]: User[];
  };
}

const initialState: BorrowState = {
  books: []
};

export const borrowSlice = createSlice({
  name: 'borrow',
  initialState,
  reducers: {
    borrow: (state: BorrowState, action: PayloadAction<{ book: Book; user: User }>) => {
      const { book, user } = action.payload;
      const borrowers = state.books[book.id] || [];
      borrowers.push(user);

      state.books[book.id] = borrowers;
    }
  }
});

export const { borrow } = borrowSlice.actions;

export const selectBooks = (state: AppState) => state.borrow.books;

export default borrowSlice.reducer;
