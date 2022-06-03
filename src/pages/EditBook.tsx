import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Container, Paper, TextField } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import Page from '../components/Page';
import TopBar from '../components/TopBar';
import useApi from '../hooks/useApi';
import api from '../mocks/bookApi';

function EditBook() {
  const { bookId } = useParams();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [author, setAuthor] = useState('');
  const [genre, setGenre] = useState('');
  const [copies, setCopies] = useState(0);
  const [yearPublished, setYearPublished] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(false);

  const token = useApi();

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
          setYearPublished(b.yearPublished);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [bookId]);

  if (loading) {
    return <Typography variant="h5">Loading...</Typography>;
  }

  const navigate = useNavigate();

  const update = async () => {
    try {
      await api.updateBook(token, {
        id: Number(bookId),
        title,
        description,
        genre,
        author,
        yearPublished,
        copies
      });

      navigate('/books');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <TopBar />
      <Page>
        <Container>
          <Paper sx={{ mt: 2, p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h5">Edit Book</Typography>
            </Box>
            <Box sx={{ mt: 4, display: 'flex', alignItems: 'center' }}>
              <TextField
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
                type="number"
                label="Year Published"
                id="year-published"
                placeholder="Year Published"
                value={yearPublished}
                onChange={(e) => setYearPublished(Number(e.target.value))}
                sx={{ flexGrow: 1 }}
              />
            </Box>
            <Box sx={{ mt: 4, display: 'flex', alignItems: 'center' }}>
              <TextField
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
              onClick={update}
            >
              Update
            </Button>
          </Paper>
        </Container>
      </Page>
    </>
  );
}

export default EditBook;
