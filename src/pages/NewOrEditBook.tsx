import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Container,
  Paper,
  TextField,
  IconButton,
  Alert,
  Backdrop,
  CircularProgress
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Page from '../components/Page';
import TopBar from '../components/TopBar';
import useApi from '../hooks/useApi';
import api from '../mocks/bookApi';
import { useAppDispatch } from '../hooks/redux';
import { openNotification } from '../features/notification';
import ErrorMessage from '../enums/error';
import { ApiError } from '../mocks/types';
import LinkBehavior from '../components/LinkBehavior';

type FormError = {
  title?: string;
  description?: string;
  author?: string;
  genre?: string;
  copies?: string;
  yearPublished?: string;
  api?: string;
};

function NewBook() {
  const { bookId } = useParams();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [author, setAuthor] = useState('');
  const [genre, setGenre] = useState('');
  const [copies, setCopies] = useState(0);
  const [yearPublished, setYearPublished] = useState<string>(new Date().getFullYear().toString());
  const [error, setError] = useState<FormError | null>(null);
  const [loading, setLoading] = useState(false);

  const token = useApi();

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (bookId) {
      setLoading(true);
      api
        .getBook(token, Number(bookId))
        .then((b) => {
          setTitle(b.title);
          setDescription(b.description);
          setAuthor(b.author);
          setGenre(b.genre);
          setCopies(b.copies);
          setYearPublished(b.yearPublished.toString());
        })
        .catch(() => {
          dispatch(openNotification({ message: ErrorMessage.unexpectedError, severity: 'error' }));
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [bookId]);

  const updateOrCreate = async () => {
    try {
      const validationError: FormError = {};

      if (!title.trim().length || title.trim().length < 4) {
        validationError.title = 'Title must be filled and must be more than 4 characters.';
      }
      if (!author.trim().length || author.trim().length < 4) {
        validationError.author = 'Author must be filled and must be more than 4 characters.';
      }
      if (!genre.trim().length || genre.trim().length < 4) {
        validationError.genre = 'Genre must be filled and must be more than 4 characters.';
      }
      if (description.trim().length > 400) {
        validationError.description = 'Description must maximum 400 characters.';
      }
      if (!copies || copies < 0) {
        validationError.copies = 'Copies must be minimum 1.';
      }

      if (
        !yearPublished ||
        Number.isNaN(yearPublished) ||
        Number(yearPublished) < 100 ||
        Number(yearPublished) > new Date().getFullYear()
      ) {
        validationError.yearPublished = 'Year published must be > 100 and not future year';
      }

      if (Object.keys(validationError).length > 0) {
        setError(validationError);
        return;
      }

      setError(null);

      const data = {
        title,
        description,
        genre,
        author,
        yearPublished: Number(yearPublished),
        copies
      };

      if (bookId) {
        await api.updateBook(token, {
          id: Number(bookId),
          ...data
        });
      } else {
        await api.createBook(token, data);
      }

      setError(null);
      navigate('/books');
    } catch (err) {
      if (err instanceof ApiError) {
        setError({
          api: err.message
        });
      } else {
        console.error(err);
        dispatch(openNotification({ message: ErrorMessage.unexpectedError, severity: 'error' }));
      }
    }
  };

  return (
    <>
      <TopBar />
      <Page>
        <Container sx={{ p: 0 }}>
          <Paper sx={{ mt: 2, p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton aria-label="back" size="large" component={LinkBehavior} href="/books">
                <ArrowBackIcon htmlColor="black" fontSize="inherit" />
              </IconButton>
              <Typography variant="h5">{bookId ? 'Edit' : 'Create'} Book</Typography>
            </Box>
            {!!error?.api && (
              <Alert sx={{ marginY: 2, width: '100%', boxSizing: 'border-box' }} severity="error">
                {error.api}
              </Alert>
            )}
            <Box sx={{ mt: 4, display: 'flex', alignItems: 'center' }}>
              <TextField
                autoComplete="off"
                error={!!error?.title || !!error?.api}
                helperText={error?.title}
                label="Title"
                id="title"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                sx={{ flexGrow: 1 }}
              />
            </Box>
            <Box sx={{ mt: 4, display: 'flex', alignItems: 'center' }}>
              <TextField
                autoComplete="off"
                error={!!error?.author || !!error?.api}
                helperText={error?.author}
                label="Author"
                id="author"
                placeholder="Author"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                sx={{ flexGrow: 1 }}
              />
            </Box>
            <Box sx={{ mt: 4, display: 'flex', alignItems: 'center' }}>
              <TextField
                autoComplete="off"
                error={!!error?.genre || !!error?.api}
                helperText={error?.genre}
                label="Genre"
                id="genre"
                placeholder="Genre"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                sx={{ flexGrow: 1 }}
              />
            </Box>
            <Box sx={{ mt: 4, display: 'flex', alignItems: 'center' }}>
              <TextField
                autoComplete="off"
                error={!!error?.yearPublished || !!error?.api}
                helperText={error?.yearPublished}
                type="number"
                label="Year Published"
                id="year-published"
                placeholder="Year Published"
                value={yearPublished}
                onChange={(e) => setYearPublished(e.target.value)}
                sx={{ flexGrow: 1 }}
              />
            </Box>
            <Box sx={{ mt: 4, display: 'flex', alignItems: 'center' }}>
              <TextField
                autoComplete="off"
                error={!!error?.copies || !!error?.api}
                helperText={error?.copies}
                type="number"
                label="Copies"
                id="copies"
                placeholder="Copies"
                value={copies}
                onChange={(e) => setCopies(Number(e.target.value))}
                sx={{ flexGrow: 1 }}
              />
            </Box>
            <Box sx={{ mt: 4, display: 'flex', alignItems: 'center' }}>
              <TextField
                autoComplete="off"
                error={!!error?.description || !!error?.api}
                helperText={error?.description}
                fullWidth
                rows={5}
                multiline
                type="description"
                label="Description"
                id="description"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                sx={{ flexGrow: 1 }}
              />
            </Box>
            <Button
              sx={{ mt: 4 }}
              size="large"
              variant="contained"
              style={{ width: '100%' }}
              onClick={updateOrCreate}
            >
              {bookId ? 'Update' : 'Create'}
            </Button>
          </Paper>
          <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={loading}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
        </Container>
      </Page>
    </>
  );
}

export default NewBook;
