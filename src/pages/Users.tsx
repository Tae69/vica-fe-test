import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  Container,
  Paper,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';
import Page from '../components/Page';
import TopBar from '../components/TopBar';
import EnhancedTable from '../components/UserTable';
import useApi from '../hooks/useApi';
import { ApiError, Role, User } from '../mocks/types';
import api from '../mocks/userApi';
import LinkBehavior from '../components/LinkBehavior';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { openNotification } from '../reducers/notification';
import ErrorMessage from '../enums/error';
import { logout, selectCurrentUser } from '../reducers/user';

function Users() {
  const [rows, setRows] = useState<User[]>([]);
  const [keyword, setKeyword] = useState('');

  const [open, setOpen] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [pendingDeletionId, setPendingDeletionId] = useState<number | null>(null);

  const token = useApi();

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectCurrentUser)!;

  useEffect(() => {
    api.listUsers(token, keyword).then((users) => {
      setRows(users);
    });
  }, [keyword]);

  const removeUser = async (id: number) => {
    try {
      const deleteOwnUser = id === user.id;
      if (deleteOwnUser && !confirm) {
        setPendingDeletionId(id);
        setOpen(true);
        return;
      }

      setPendingDeletionId(null);

      await api.removeUser(token, id);
      const index = rows.findIndex((r) => r.id === id);
      if (index > -1) {
        rows.splice(index, 1);
        setRows([...rows]);
      }

      if (deleteOwnUser) {
        dispatch(logout());
        navigate('/');
        return;
      }

      dispatch(openNotification({ message: 'User deleted successfully.' }));
    } catch (err) {
      console.error(err);
      const message = err instanceof ApiError ? err.message : ErrorMessage.unexpectedError;
      dispatch(openNotification({ message, severity: 'error' }));
    }
  };

  const handleClose = (value: boolean = false) => {
    setOpen(false);
    setConfirm(value);
  };

  useEffect(() => {
    if (confirm && pendingDeletionId) {
      removeUser(pendingDeletionId);
    }
  }, [confirm]);

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
        <Dialog
          open={open}
          onClose={() => handleClose()}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            The user you are deleting is the current user you use, are you sure want to delete?
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              When you delete logged in user, you will be logged out when you confirm the deletion.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => handleClose()}>No</Button>
            <Button onClick={() => handleClose(true)} autoFocus>
              Yes
            </Button>
          </DialogActions>
        </Dialog>
      </Page>
    </>
  );
}

export default Users;
