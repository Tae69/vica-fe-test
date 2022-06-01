import React from 'react';
import { Navigate } from 'react-router-dom';
import { selectToken } from '../features/users';
import { useAppSelector } from '../utils/hooks';

type Props = {
  children: JSX.Element;
};

function RequireAuth({ children }: Props) {
  const token = useAppSelector(selectToken);

  return token ? children : <Navigate to="/login" replace />;
}

export default RequireAuth;
