import React, { useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Page from '../components/Page';
import { loggedIn } from '../features/user';
import api from '../mocks/userApi';
import { ApiError } from '../mocks/types';
import { openNotification } from '../features/notification';
import ErrorMessage from '../enums/error';

type FormError = {
  username?: string;
  password?: string;
  api?: string;
};

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('testing123');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<FormError | null>(null);

  const login = async () => {
    try {
      const validationError: FormError = {};
      if (!username.trim().length) {
        validationError.username = 'Username must be filled.';
      }
      if (!password.trim().length) {
        validationError.password = 'Password must be filled.';
      }

      if (Object.keys(validationError).length > 0) {
        setError(validationError);
        return;
      }

      setError(null);
      setIsLoading(true);

      const { user, token } = await api.login(username, password);
      dispatch(loggedIn({ user, token }));
      navigate('/');
      setError(null);
    } catch (err) {
      if (err instanceof ApiError) {
        setError({
          api: err.message
        });
      } else {
        console.error(err);
        dispatch(openNotification({ message: ErrorMessage.unexpectedError, severity: 'error' }));
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Page center>
      <Box
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column'
        }}
      >
        <Typography variant="h4">Book Management Login</Typography>
        <TextField
          error={!!error?.username || !!error?.api}
          helperText={error?.username}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          id="username-required"
          label="Username"
          placeholder="Username"
          style={{ marginTop: 16, width: '100%' }}
        />
        <TextField
          error={!!error?.password || !!error?.api}
          helperText={error?.password}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          id="password-required"
          label="Password"
          type="password"
          placeholder="Password"
          style={{ marginTop: 16, marginBottom: 16, width: '100%' }}
        />
        {!!error?.api && <Typography sx={{ color: 'error.main', mb: 2 }}>{error.api}</Typography>}
        <Button
          disabled={isLoading}
          size="large"
          onClick={login}
          variant="contained"
          style={{ width: '100%' }}
        >
          {isLoading ? 'Logging In...' : 'Login'}
        </Button>
      </Box>
    </Page>
  );
}

export default Login;
