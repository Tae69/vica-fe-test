import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Container, Paper, TextField } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import Page from '../components/Page';
import TopBar from '../components/TopBar';
import EnhancedTable from '../components/BookTable';
import useApi from '../hooks/useApi';
import { ApiError, Book, User } from '../mocks/types';
import api from '../mocks/bookApi';
import LinkBehavior from '../components/LinkBehavior';
import { useAppDispatch, useAppSelector } from '../utils/hooks';
import { borrow, selectBooks, returnBook as returnBookAction } from '../features/borrow';
import { selectCurrentUser } from '../features/user';
import { openNotification } from '../features/notification';
import ErrorMessage from '../enums/error';

export type BookRow = Book & { borrowers: User[] };

function Books() {
  const [rows, setRows] = useState<Book[]>([]);
  const [keyword, setKeyword] = useState('');

  const token = useApi();

  useEffect(() => {
    api.listBooks(token, keyword).then((books) => {
      setRows(books);
    });
  }, [keyword]);

  const borrowedBooks = useAppSelector(selectBooks);

  const dispatch = useAppDispatch();
  const removeBook = async (id: number) => {
    try {
      if (borrowedBooks[id]?.length) {
        const error = 'Can not remove book that is being borrowed';
        dispatch(openNotification({ message: error, severity: 'error' }));
        return;
      }

      await api.deleteBook(token, id);
      const index = rows.findIndex((r) => r.id === id);
      if (index > -1) {
        rows.splice(index, 1);
        setRows([...rows]);
      }

      dispatch(openNotification({ message: 'Book deleted successfully' }));
    } catch (err) {
      console.error(err);
      const message = err instanceof ApiError ? err.message : ErrorMessage.unexpectedError;
      dispatch(openNotification({ message, severity: 'error' }));
    }
  };

  const user = useAppSelector(selectCurrentUser) as User;

  const borrowBook = async (book: Book) => {
    dispatch(borrow({ book, user }));
  };

  const returnBook = async (book: Book) => {
    dispatch(returnBookAction({ book, user }));
  };

  const bookRows: BookRow[] = rows.map((b) => ({
    ...b,
    borrowers: borrowedBooks[b.id] || []
  }));

  return (
    <>
      <TopBar />
      <Page>
        <Container>
          <Paper sx={{ mt: 2, p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h5">Books</Typography>
              <Button
                component={LinkBehavior}
                href="/books/create"
                variant="contained"
                endIcon={<AddIcon />}
              >
                Add
              </Button>
            </Box>
            <Box sx={{ mt: 4, display: 'flex', alignItems: 'center' }}>
              <TextField
                id="search"
                placeholder="Search"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                sx={{ flexGrow: 1 }}
                InputProps={{
                  startAdornment: <SearchIcon htmlColor="gray" />
                }}
              />
            </Box>
            <EnhancedTable
              rows={bookRows}
              user={user}
              onRemove={removeBook}
              onBorrow={borrowBook}
              onReturn={returnBook}
            />
          </Paper>
        </Container>
      </Page>
    </>
  );
}

export default Books;
