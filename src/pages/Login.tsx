import { Box, Button, Container, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Page from "../components/Page";
import { loggedIn } from "../features/users";
import api from '../mocks/api';
import { ApiError } from "../mocks/types";

type FormError = {
  username?: string
  password?: string
  api?: string
}

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<FormError | null>(null);

  async function login(e: React.MouseEvent<HTMLButtonElement>): Promise<void> {
    try {
      const error: FormError = {};
      if (!username.trim().length) {
        error.username = 'Username must be filled.';
      }
      if (!password.trim().length) {
        error.password = 'Password must be filled.';
      }

      if (Object.keys(error).length > 0) {
        setError(error);
        return;
      }

      setError(null);
      setIsLoading(true);

      const { user, token } = await api.login(username, password)
      dispatch(loggedIn({ user, token }));
      navigate('/dashboard');
      setError(null);
    }
    catch (err) {
      if (err instanceof ApiError) {
        setError({
          api: err.message
        });
      }
      else {
        console.error(err);
      }
    }
    finally {
      setIsLoading(false);
    }

  }

  return (
    <Page center>
      <Box style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
        <Typography variant="h4">Book Management Login</Typography>
        <TextField
          error={!!error?.username || !!error?.api}
          helperText={error?.username}
          value={username}
          onChange={e => setUsername(e.target.value)}
          id="username-required"
          label="Username"
          placeholder="Username"
          style={{ marginTop: 16, width: '100%' }}
        />
        <TextField
          error={!!error?.password || !!error?.api}
          helperText={error?.password}
          value={password}
          onChange={e => setPassword(e.target.value)}
          id="password-required"
          label="Password"
          type="password"
          placeholder="Password"
          style={{ marginTop: 16, marginBottom: 16, width: '100%' }}
        />
        {!!error?.api &&
          <Typography sx={{ color: 'error.main', mb: 2 }}>{error.api}</Typography>
        }
        <Button disabled={isLoading} size="large" onClick={login} variant="contained" style={{ width: '100%' }}>
          {
            isLoading
              ? 'Logging In...'
              : 'Login'
          }
        </Button>
      </Box>
    </Page>
  )
}

export default Login;