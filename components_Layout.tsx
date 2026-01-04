import React from "react";
import { AppBar, Toolbar, Typography, Container, Button } from "@mui/material";
import Link from "next/link";
import { signOut } from "next-auth/react";

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            DummyJSON Admin
          </Typography>
          <Link href="/users" passHref legacyBehavior><Button color="inherit">Users</Button></Link>
          <Link href="/products" passHref legacyBehavior><Button color="inherit">Products</Button></Link>
          <Button color="inherit" onClick={() => signOut({ callbackUrl: "/login" })}>Sign out</Button>
        </Toolbar>
      </AppBar>
      <Container sx={{ mt: 3 }}>{children}</Container>
    </>
  );
};