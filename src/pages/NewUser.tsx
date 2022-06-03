import React, { useState } from 'react';
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
  MenuItem
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import DayjsAdapter from '@date-io/dayjs';
import { DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import Page from '../components/Page';
import TopBar from '../components/TopBar';
import useApi from '../hooks/useApi';
import { Role } from '../mocks/types';
import api from '../mocks/userApi';
import LinkBehavior from '../components/LinkBehavior';

const dayjs = new DayjsAdapter();

function NewUser() {
  const [name, setName] = useState('');
  const [role, setRole] = useState<Role>(Role.Member);
  const [password, setPassword] = useState('');
  const [dateJoined, setDateJoined] = useState(dayjs.date());

  const token = useApi();

  const navigate = useNavigate();

  const create = async () => {
    try {
      await api.createUser(token, {
        name,
        password,
        role,
        dateJoined: dateJoined.toDate().getTime()
      });

      navigate('/');
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
              <Typography variant="h5">Edit User</Typography>
            </Box>
            <Box sx={{ mt: 4, display: 'flex', alignItems: 'center' }}>
              <TextField
                label="Name"
                id="name"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                sx={{ flexGrow: 1 }}
              />
            </Box>
            <Box sx={{ mt: 4, display: 'flex', alignItems: 'center' }}>
              <TextField
                type="password"
                label="Password"
                id="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                sx={{ flexGrow: 1 }}
              />
            </Box>
            <Box sx={{ mt: 4, display: 'flex', alignItems: 'center' }}>
              <FormControl fullWidth sx={{ textAlign: 'left' }}>
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
                  value={dateJoined}
                  onChange={(d) => d && setDateJoined(d)}
                  renderInput={(params) => <TextField sx={{ width: '100%' }} {...params} />}
                />
              </LocalizationProvider>
            </Box>
            <Button
              sx={{ mt: 4 }}
              size="large"
              variant="outlined"
              style={{ width: '100%' }}
              component={LinkBehavior}
              href="/users"
            >
              Back
            </Button>
            <Button
              sx={{ mt: 4 }}
              size="large"
              variant="contained"
              style={{ width: '100%' }}
              onClick={create}
            >
              Create
            </Button>
          </Paper>
        </Container>
      </Page>
    </>
  );
}

export default NewUser;
