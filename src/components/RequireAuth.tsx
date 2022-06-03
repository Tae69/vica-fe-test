import React from 'react';
import { Navigate } from 'react-router-dom';
import { selectCurrentUser, selectToken } from '../features/user';
import { Role } from '../mocks/types';
import { useAppSelector } from '../utils/hooks';

type Props = {
  onlyStaff?: boolean;
  children: JSX.Element;
};

function RequireAuth({ children, onlyStaff }: Props) {
  const token = useAppSelector(selectToken);
  const user = useAppSelector(selectCurrentUser);

  const hasAccess = token && (!onlyStaff || (!onlyStaff && user!.role !== Role.Member));

  return hasAccess ? children : <Navigate to="/login" replace />;
}

RequireAuth.defaultProps = {
  onlyStaff: false
};

export default RequireAuth;
