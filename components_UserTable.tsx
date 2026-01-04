import React from "react";
import { Table, TableBody, TableCell, TableHead, TableRow, Paper, TableContainer, IconButton } from "@mui/material";
import { Visibility } from "@mui/icons-material";
import Link from "next/link";

/**
 * Memoized table row component to avoid unnecessary re-renders.
 */
const UserRow = React.memo(function UserRow({ user }: { user: any }) {
  return (
    <TableRow>
      <TableCell>{user.firstName} {user.lastName}</TableCell>
      <TableCell>{user.email}</TableCell>
      <TableCell>{user.gender}</TableCell>
      <TableCell>{user.phone}</TableCell>
      <TableCell>{user.company?.name || "-"}</TableCell>
      <TableCell>
        <Link href={`/users/${user.id}`} passHref legacyBehavior>
          <IconButton size="small" aria-label="view"> <Visibility /> </IconButton>
        </Link>
      </TableCell>
    </TableRow>
  );
});

export const UserTable: React.FC<{ users: any[] }> = ({ users }) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Gender</TableCell>
            <TableCell>Phone</TableCell>
            <TableCell>Company</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((u) => <UserRow key={u.id} user={u} />)}
        </TableBody>
      </Table>
    </TableContainer>
  );
};