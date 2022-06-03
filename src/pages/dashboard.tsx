import React from 'react';
import { Button, Typography } from '@mui/material';
import Page from '../components/Page';
import { useAppDispatch, useAppSelector } from '../utils/hooks';
import { logout as logoutAction, selectCurrentUser } from '../features/user';
import TopBar from '../components/TopBar';
import LinkBehavior from '../components/LinkBehavior';

function Dashboard() {
  const user = useAppSelector(selectCurrentUser);
  const dispatch = useAppDispatch();

  const logout = () => {
    dispatch(logoutAction());
  };

  return (
    <>
      <TopBar />
      <Page>
        <Typography>
          Hello,
          {user?.name}
        </Typography>
        <Button component={LinkBehavior} href="/" variant="contained">
          Link
        </Button>
        <Button size="large" onClick={logout} variant="contained">
          Logout
        </Button>
      </Page>
    </>
  );
}

export default Dashboard;
