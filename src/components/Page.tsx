import React from 'react';
import { Container } from '@mui/material';

type Props = {
  children: React.ReactNode;
  center?: boolean;
};

function Page({ children, center = false }: Props) {
  let styles = {};

  if (center) {
    styles = {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    };
  }

  return (
    <Container maxWidth="xl" style={{ minHeight: '100vh', ...styles }}>
      {children}
    </Container>
  );
}

Page.defaultProps = {
  center: false
};

export default Page;
