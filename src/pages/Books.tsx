/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  Container,
  Paper,
  TextField,
  Snackbar,
  Alert,
  AlertProps,
  AlertColor
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import Page from '../components/Page';
import TopBar from '../components/TopBar';
import EnhancedTable from '../components/BookTable';
import useApi from '../hooks/useApi';
import { Book, User } from '../mocks/types';
import api from '../mocks/bookApi';
import LinkBehavior from '../components/LinkBehavior';
import { useAppDispatch, useAppSelector } from '../utils/hooks';
import { borrow, selectBooks, returnBook as returnBookAction } from '../features/borrow';
import { selectCurrentUser } from '../features/user';

export type BookRow = Book & { borrowers: User[] };

function Books() {
  const [rows, setRows] = useState<Book[]>([]);
  const [keyword, setKeyword] = useState('');
  const [open, setOpen] = useState(false);
  const [msg, setMsg] = useState('');
  const [severity, setSeverity] = useState<AlertColor>('success');

  const token = useApi();

  useEffect(() => {
    api.listBooks(token, keyword).then((books) => {
      setRows(books);
    });
  }, [keyword]);

  const borrowedBooks = useAppSelector(selectBooks);

  const removeBook = async (id: number) => {
    try {
      if (borrowedBooks[id]?.length) {
        const error = 'Can not remove book that is being borrowed';
        setMsg(error);
        setSeverity('error');
        setOpen(true);
        throw new Error(error);
      }

      await api.deleteBook(token, id);
      const index = rows.findIndex((r) => r.id === id);
      if (index > -1) {
        rows.splice(index, 1);
        setRows([...rows]);
      }
      setMsg('Book deleted successfully');
      setSeverity('success');
      setOpen(true);
    } catch (err) {
      console.error(err);
    }
  };

  const dispatch = useAppDispatch();
  const user = useAppSelector(selectCurrentUser) as User;

  const borrowBook = async (book: Book) => {
    dispatch(borrow({ book, user }));
  };

  const returnBook = async (book: Book) => {
    dispatch(returnBookAction({ book, user }));
  };

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
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
          <Snackbar
            open={open}
            autoHideDuration={6000}
            onClose={handleClose}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
              {msg}
            </Alert>
          </Snackbar>
        </Container>
      </Page>
    </>
  );
}

export default Books;
