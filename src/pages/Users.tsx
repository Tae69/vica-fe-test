import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  Container,
  Paper,
  TextField,
  Snackbar,
  Alert
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import Page from '../components/Page';
import TopBar from '../components/TopBar';
import EnhancedTable from '../components/Table';
import useApi from '../hooks/useApi';
import { User } from '../mocks/types';
import api from '../mocks/userApi';
import LinkBehavior from '../components/LinkBehavior';

function Users() {
  const [rows, setRows] = useState<User[]>([]);
  const [keyword, setKeyword] = useState('');
  const [open, setOpen] = useState(false);

  const token = useApi();

  useEffect(() => {
    api.listUsers(token, keyword).then((users) => {
      setRows(users);
    });
  }, [keyword]);

  const removeUser = async (id: number) => {
    try {
      await api.removeUser(token, id);
      const index = rows.findIndex((r) => r.id === id);
      if (index > -1) {
        rows.splice(index, 1);
        setRows([...rows]);
      }
      setOpen(true);
    } catch (err) {
      console.error(err);
    }
  };

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  return (
    <>
      <TopBar />
      <Page>
        <Container>
          <Paper sx={{ mt: 2, p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h5">Users</Typography>
              <Button
                component={LinkBehavior}
                href="/users/create"
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
            <EnhancedTable rows={rows} onRemove={removeUser} />
          </Paper>
          <Snackbar
            open={open}
            autoHideDuration={6000}
            onClose={handleClose}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
              User deleted successfully
            </Alert>
          </Snackbar>
        </Container>
      </Page>
    </>
  );
}

export default Users;
