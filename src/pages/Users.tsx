import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Container, Paper, TextField } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import Page from '../components/Page';
import TopBar from '../components/TopBar';
import EnhancedTable from '../components/Table';
import useApi from '../hooks/useApi';
import { ApiError, Role, User } from '../mocks/types';
import api from '../mocks/userApi';
import LinkBehavior from '../components/LinkBehavior';
import { useAppDispatch, useAppSelector } from '../utils/hooks';
import { openNotification } from '../features/notification';
import ErrorMessage from '../enums/error';
import { selectCurrentUser } from '../features/user';

function Users() {
  const [rows, setRows] = useState<User[]>([]);
  const [keyword, setKeyword] = useState('');

  const token = useApi();

  const dispatch = useAppDispatch();
  const user = useAppSelector(selectCurrentUser)!;

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

      dispatch(openNotification({ message: 'User deleted successfully.' }));
    } catch (err) {
      console.error(err);
      const message = err instanceof ApiError ? err.message : ErrorMessage.unexpectedError;
      dispatch(openNotification({ message, severity: 'error' }));
    }
  };

  return (
    <>
      <TopBar />
      <Page>
        <Container sx={{ p: 0 }}>
          <Paper sx={{ mt: 2, p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h5">Users</Typography>
              {user.role === Role.Admin && (
                <Button
                  component={LinkBehavior}
                  href="/users/create"
                  variant="contained"
                  endIcon={<AddIcon />}
                >
                  Add
                </Button>
              )}
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
            <EnhancedTable rows={rows} onRemove={removeUser} canModify={user.role === Role.Admin} />
          </Paper>
        </Container>
      </Page>
    </>
  );
}

export default Users;
