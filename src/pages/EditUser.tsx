import React, { useState, useEffect } from 'react';
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
import { useNavigate, useParams } from 'react-router-dom';
import DayjsAdapter from '@date-io/dayjs';
import { DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import Page from '../components/Page';
import TopBar from '../components/TopBar';
import useApi from '../hooks/useApi';
import { Role } from '../mocks/types';
import api from '../mocks/userApi';

const dayjs = new DayjsAdapter();

function EditUser() {
  const { userId } = useParams();
  const [name, setName] = useState('');
  const [role, setRole] = useState<Role>(Role.Member);
  const [password, setPassword] = useState('');
  const [dateJoined, setDateJoined] = useState(dayjs.date());
  const [loading, setLoading] = useState(false);

  const token = useApi();

  useEffect(() => {
    if (userId) {
      setLoading(true);
      api
        .getUser(token, Number(userId))
        .then((u) => {
          setName(u.name);
          setPassword(u.password);
          setRole(u.role);
          setDateJoined(dayjs.date(u.dateJoined));
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [userId]);

  if (loading) {
    return <Typography variant="h5">Loading...</Typography>;
  }

  const navigate = useNavigate();

  const update = async () => {
    try {
      await api.updateUser(token, {
        id: Number(userId),
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

export default EditUser;
