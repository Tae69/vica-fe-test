import React, { ComponentProps, FC, PropsWithChildren } from "react";
import { Container } from "@mui/material";

type Props = {
  children?: React.ReactNode
  center?: boolean
}

const Page = ({ children, center }: Props) => {
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
  )
};

export default Page;