"use client";

import { useState } from "react";
import Link from "next/link";
import { useMutation } from "@apollo/client/react";
import type { GQLUser } from "@/lib/graphql/types";
import {
  Box,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  SelectChangeEvent,
} from "@mui/material";
import { CREATE_USER_MUTATION } from "@/lib/graphql/auth";

export default function AdminUsersPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"CONTRACTOR" | "HOMEOWNER">("CONTRACTOR");
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [createUser, { loading, error }] = useMutation<
    { createUser: GQLUser },
    { input: { name: string; email: string; password: string; role: string } }
  >(CREATE_USER_MUTATION);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await createUser({
        variables: {
          input: {
            name: name.trim(),
            email: email.trim(),
            password,
            role,
          },
        },
      });

      const created = res?.data?.createUser;
      if (created) {
        setSuccessMsg(`User created: ${created.email} (${created.role})`);
        setName("");
        setEmail("");
        setPassword("");
        setRole("CONTRACTOR");
      } else {
        setErrorMsg("Error creating user");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Box sx={{ p: 4, maxWidth: 720, mx: "auto" }}>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Admin — Create Users
      </Typography>

      <Typography sx={{ mb: 2 }}>
        To use the app you need two users: one <strong>contractor</strong> and
        one <strong>homeowner</strong>. Create both accounts here, then use the
        <Link href="/login"> login page</Link> to sign in.
      </Typography>

      {successMsg && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {successMsg}
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error.message}
        </Alert>
      )}

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: "grid", gap: 2 }}
      >
        <TextField
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          helperText="Min. 6 characters"
          required
        />

        <FormControl>
          <InputLabel id="role-label">Role</InputLabel>
          <Select
            labelId="role-label"
            value={role}
            label="Role"
            onChange={(e: SelectChangeEvent<string>) =>
              setRole(e.target.value as "CONTRACTOR" | "HOMEOWNER")
            }
          >
            <MenuItem value="CONTRACTOR">Contractor</MenuItem>
            <MenuItem value="HOMEOWNER">Homeowner</MenuItem>
          </Select>
        </FormControl>

        <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? "Creating..." : "Create User"}
          </Button>
          <Button component={Link} href="/login" variant="outlined">
            Go to login
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
