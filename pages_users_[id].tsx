import React from "react";
import { useRouter } from "next/router";
import { Layout } from "../../components/Layout";
import { Button, Typography, Paper, Grid } from "@mui/material";
import Link from "next/link";
import { useStore } from "../../store/useStore";

/**
 * Single user view. Simple client-side fetch via Zustand action.
 * Could also be SSR'd with getServerSideProps if necessary.
 */
export default function UserDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const [user, setUser] = React.useState<any | null>(null);
  const fetchUserById = useStore((s) => s.fetchUserById);

  React.useEffect(() => {
    if (!id) return;
    (async () => {
      const u = await fetchUserById(id as string);
      setUser(u);
    })();
  }, [id, fetchUserById]);

  if (!user) {
    return (
      <Layout>
        <Typography>Loading...</Typography>
      </Layout>
    );
  }

  return (
    <Layout>
      <Link href="/users" passHref legacyBehavior><Button variant="outlined" sx={{ mb: 2 }}>Back to Users</Button></Link>
      <Paper sx={{ p: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <img src={user.image} alt={`${user.firstName}`} style={{ width: "100%", borderRadius: 8 }} />
          </Grid>
          <Grid item xs={12} md={8}>
            <Typography variant="h5">{user.firstName} {user.lastName}</Typography>
            <Typography>Email: {user.email}</Typography>
            <Typography>Gender: {user.gender}</Typography>
            <Typography>Phone: {user.phone}</Typography>
            <Typography>Company: {user.company?.name}</Typography>
            <Typography>Address: {user.address?.address}, {user.address?.city}</Typography>
            <Typography>Birthdate: {user.birthDate}</Typography>
          </Grid>
        </Grid>
      </Paper>
    </Layout>
  );
}