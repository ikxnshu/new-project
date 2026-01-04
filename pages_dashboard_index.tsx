import React from "react";
import { getSession } from "next-auth/react";
import { Layout } from "../../components/Layout";
import { Typography, Grid, Paper } from "@mui/material";
import Link from "next/link";

/**
 * Server-side protection: redirect to /login if not authenticated.
 */
export async function getServerSideProps(context: any) {
  const session = await getSession(context);
  if (!session) {
    return { redirect: { destination: "/login", permanent: false } };
  }
  return { props: {} };
}

export default function DashboardPage() {
  return (
    <Layout>
      <Typography variant="h4" mb={2}>Dashboard</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6"><Link href="/users" passHref legacyBehavior>Users</Link></Typography>
            <Typography variant="body2">Browse and manage users</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6"><Link href="/products" passHref legacyBehavior>Products</Link></Typography>
            <Typography variant="body2">Browse and manage products</Typography>
          </Paper>
        </Grid>
      </Grid>
    </Layout>
  );
}