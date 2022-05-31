import { Button, Typography } from "@mui/material";
import Page from "../components/Page";
import { useAppDispatch, useAppSelector } from "../utils/hooks";
import { logout as logoutAction, selectCurrentUser } from '../features/users'

const Dashboard = () => {
  const user = useAppSelector(selectCurrentUser);
  const dispatch = useAppDispatch();

  function logout() {
    dispatch(logoutAction());
  }

  return (
    <Page>
      <Typography>Hello, {user?.name}</Typography>
      <Button size="large" onClick={logout} variant="contained">Logout</Button>
    </Page>
  )
}

export default Dashboard;