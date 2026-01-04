import React from "react";
import { useRouter } from "next/router";
import { Container, TextField, Button, Box, Typography, Paper } from "@mui/material";
import { signIn, useSession } from "next-auth/react";

/**
 * Login page using NextAuth credentials provider.
 * On successful signIn, NextAuth session will be synced into Zustand by _app's SessionSync.
 */
export default function LoginPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [username, setUsername] = React.useState("kminchelle"); // DummyJSON sample user
  const [password, setPassword] = React.useState("0lelplR");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    if (session) {
      router.replace("/dashboard");
    }
  }, [session, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    // signIn will redirect by default unless redirect: false
    const res = await signIn("credentials", { redirect: false, username, password });
    setLoading(false);
    if (res?.ok) {
      router.replace("/dashboard");
    } else {
      setError("Login failed. Check credentials.");
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper sx={{ mt: 8, p: 4 }}>
        <Typography variant="h5" mb={2}>Admin Login</Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField fullWidth label="Username" value={username} onChange={(e) => setUsername(e.target.value)} margin="normal" />
          <TextField fullWidth label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} margin="normal" />
          {error && <Typography color="error">{error}</Typography>}
          <Button type="submit" variant="contained" sx={{ mt: 2 }} disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}