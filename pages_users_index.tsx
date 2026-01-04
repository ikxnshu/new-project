import React from "react";
import { Layout } from "../../components/Layout";
import { Box, TextField, Pagination, CircularProgress, Grid } from "@mui/material";
import { useStore } from "../../store/useStore";
import { UserTable } from "../../components/UserTable";

/**
 * Users list page:
 * - Pagination via limit/skip
 * - Search
 * - Uses Zustand fetchUsers action with simple cache (see store)
 *
 * useCallback/useMemo used to improve render stability for child components.
 */
export default function UsersPage() {
  const [query, setQuery] = React.useState("");
  const [page, setPage] = React.useState(1);
  const limit = 10;
  const skip = (page - 1) * limit;

  const fetchUsers = useStore((s) => s.fetchUsers);
  const users = useStore((s) => s.users);
  const total = useStore((s) => s.usersTotal);
  const loading = useStore((s) => s.usersLoading);

  React.useEffect(() => {
    fetchUsers({ q: query || undefined, limit, skip });
  }, [query, page, fetchUsers]);

  const handleSearch = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setPage(1);
  }, []);

  const pageCount = Math.ceil((total || 0) / limit) || 1;

  return (
    <Layout>
      <Box mb={2} display="flex" gap={2} alignItems="center">
        <TextField placeholder="Search users..." value={query} onChange={handleSearch} />
      </Box>
      {loading ? <CircularProgress /> : <UserTable users={users} />}
      <Grid container justifyContent="center" sx={{ mt: 2 }}>
        <Pagination count={pageCount} page={page} onChange={(_, v) => setPage(v)} />
      </Grid>
    </Layout>
  );
}