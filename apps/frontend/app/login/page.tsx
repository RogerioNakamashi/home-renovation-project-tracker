"use client";

import { Box, Typography } from "@mui/material";
import { LoginForm } from "@/components/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { LOGIN_MUTATION } from "@/lib/graphql";
import { saveTokens, saveUser, AuthUser } from "@/lib/auth";

interface LoginResponse {
  login: {
    accessToken: string;
    refreshToken: string;
    user: AuthUser;
  };
}

interface LoginVariables {
  input: {
    email: string;
    password: string;
  };
}

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const [loginMutation, { loading: isLoading }] = useMutation<
    LoginResponse,
    LoginVariables
  >(LOGIN_MUTATION, {
    onCompleted: (data) => {
      console.log("Login successful:", data);
      // Save tokens and user data
      saveTokens({
        accessToken: data.login.accessToken,
        refreshToken: data.login.refreshToken,
      });
      saveUser(data.login.user);

      // Redirect to dashboard
      router.push("/dashboard");
    },
    onError: (error) => {
      console.error("Login error:", error);
      setError(error.message || "Login failed. Please try again.");
    },
  });

  const handleLogin = async (email: string, password: string) => {
    setError(null);

    await loginMutation({
      variables: {
        input: {
          email,
          password,
        },
      },
    });
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
        py: 4,
      }}
    >
      {/* Header */}
      <Box sx={{ textAlign: "center", mb: 4 }}>
        <Typography
          variant="h4"
          sx={{
            color: "primary.main",
            fontWeight: 500,
            mb: 1,
          }}
        >
          RenovateTrack
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Sign in to manage your renovation projects
        </Typography>
      </Box>

      {/* Login Form */}
      <LoginForm onSubmit={handleLogin} error={error} isLoading={isLoading} />

      {/* Footer */}
      <Typography
        variant="body2"
        sx={{
          mt: 4,
          color: "text.secondary",
          textAlign: "center",
        }}
      >
        Secure project management for contractors and homeowners
      </Typography>
    </Box>
  );
}
