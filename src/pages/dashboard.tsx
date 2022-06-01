import React from 'react';
import { Button, Typography } from '@mui/material';
import Page from '../components/Page';
import { useAppDispatch, useAppSelector } from '../utils/hooks';
import { logout as logoutAction, selectCurrentUser } from '../features/users';

function Dashboard() {
  const user = useAppSelector(selectCurrentUser);
  const dispatch = useAppDispatch();

  const logout = () => {
    dispatch(logoutAction());
  };

  return (
    <Page>
      <Typography>
        Hello,
        {user?.name}
      </Typography>
      <Button size="large" onClick={logout} variant="contained">
        Logout
      </Button>
    </Page>
  );
}

export default Dashboard;
