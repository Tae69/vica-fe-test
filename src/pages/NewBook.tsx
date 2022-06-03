import React, { useState } from 'react';
import { Box, Button, Typography, Container, Paper, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Page from '../components/Page';
import TopBar from '../components/TopBar';
import useApi from '../hooks/useApi';
import api from '../mocks/bookApi';

function NewBook() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [author, setAuthor] = useState('');
  const [genre, setGenre] = useState('');
  const [copies, setCopies] = useState(0);
  const [yearPublished, setYearPublished] = useState(new Date().getFullYear());

  const token = useApi();

  const navigate = useNavigate();

  const update = async () => {
    try {
      await api.createBook(token, {
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
              <Typography variant="h5">Create Book</Typography>
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
              Create
            </Button>
          </Paper>
        </Container>
      </Page>
    </>
  );
}

export default NewBook;
