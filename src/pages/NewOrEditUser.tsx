import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Container,
  Paper,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  IconButton,
  Backdrop,
  CircularProgress
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import DayjsAdapter from '@date-io/dayjs';
import { DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Page from '../components/Page';
import TopBar from '../components/TopBar';
import useApi from '../hooks/useApi';
import { ApiError, Role } from '../mocks/types';
import api from '../mocks/userApi';
import LinkBehavior from '../components/LinkBehavior';
import { useAppDispatch } from '../hooks/redux';
import { openNotification } from '../reducers/notification';
import ErrorMessage from '../enums/error';

const dayJs = new DayjsAdapter();

type FormError = {
  name?: string;
  password?: string;
  dateJoined?: string;
  api?: string;
};

function NewOrEditUser() {
  const { userId } = useParams();
  const [name, setName] = useState('');
  const [role, setRole] = useState<Role>(Role.Member);
  const [password, setPassword] = useState('');
  const [dateJoined, setDateJoined] = useState<dayjs.Dayjs | null>(dayJs.date());
  const [error, setError] = useState<FormError | null>(null);
  const [loading, setLoading] = useState(false);

  const token = useApi();

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (userId) {
      setLoading(true);
      api
        .getUser(token, Number(userId))
        .then((u) => {
          setName(u.name);
          setPassword(u.password);
          setRole(u.role);
          setDateJoined(dayJs.date(u.dateJoined));
        })
        .catch(() => {
          dispatch(openNotification({ message: ErrorMessage.unexpectedError, severity: 'error' }));
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [userId]);

  const createOrUpdate = async () => {
    try {
      const validationError: FormError = {};
      if (!name.trim().length || name.trim().length < 4) {
        validationError.name = 'Name must be filled and must be more than 4 characters.';
      }
      if (!password.trim().length || password.trim().length < 4) {
        validationError.password = 'Password must be filled and must be more than 4 characters';
      }

      if (!dateJoined || !dateJoined.isValid() || dateJoined.toDate() > new Date()) {
        validationError.dateJoined = 'Date joined must be filled and must not be future date';
      }

      if (Object.keys(validationError).length > 0) {
        setError(validationError);
        return;
      }

      setError(null);

      const data = {
        name,
        password,
        role,
        dateJoined: dateJoined!.toDate().getTime()
      };
      if (userId) {
        await api.updateUser(token, {
          id: Number(userId),
          ...data
        });
      } else {
        await api.createUser(token, data);
      }

      setError(null);
      navigate('/users');
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
              <IconButton aria-label="back" size="large" component={LinkBehavior} href="/users">
                <ArrowBackIcon htmlColor="black" fontSize="inherit" />
              </IconButton>
              <Typography variant="h5">{userId ? 'Edit' : 'Create'} User</Typography>
            </Box>
            {!!error?.api && (
              <Alert sx={{ marginY: 2, width: '100%', boxSizing: 'border-box' }} severity="error">
                {error.api}
              </Alert>
            )}
            <Box sx={{ mt: 4, display: 'flex', alignItems: 'center' }}>
              <TextField
                autoComplete="off"
                error={!!error?.name || !!error?.api}
                helperText={error?.name}
                label="Name"
                id="new-name"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                sx={{ flexGrow: 1 }}
              />
            </Box>
            <Box sx={{ mt: 4, display: 'flex', alignItems: 'center' }}>
              <TextField
                autoComplete="off"
                error={!!error?.password || !!error?.api}
                helperText={error?.password}
                type="password"
                label="Password"
                id="new-password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                sx={{ flexGrow: 1 }}
              />
            </Box>
            <Box sx={{ mt: 4, display: 'flex', alignItems: 'center' }}>
              <FormControl fullWidth sx={{ textAlign: 'left' }} error={!!error?.api}>
                <InputLabel id="role-label">Role</InputLabel>
                <Select
                  labelId="role-label"
                  id="role"
                  value={role}
                  label="Role"
                  onChange={(e) => setRole(e.target.value as Role)}
                >
                  <MenuItem value={Role.Admin}>Admin</MenuItem>
                  <MenuItem value={Role.Editor}>Editor</MenuItem>
                  <MenuItem value={Role.Member}>Member</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ mt: 4, display: 'flex', alignItems: 'center' }}>
              <LocalizationProvider dateAdapter={DayjsAdapter}>
                <DesktopDatePicker
                  label="Date Joined"
                  inputFormat="DD/MM/YYYY"
                  maxDate={dayJs.date()}
                  value={dateJoined}
                  onChange={(d) => setDateJoined(d)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      error={!!error?.dateJoined || !!error?.api}
                      helperText={error?.dateJoined}
                      sx={{ width: '100%' }}
                    />
                  )}
                />
              </LocalizationProvider>
            </Box>
            <Button
              sx={{ mt: 4 }}
              size="large"
              variant="contained"
              style={{ width: '100%' }}
              onClick={createOrUpdate}
            >
              {userId ? 'Update' : 'Create'}
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

export default NewOrEditUser;
