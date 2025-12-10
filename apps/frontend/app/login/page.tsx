"use client";

import { Box, Typography } from "@mui/material";
import { LoginForm } from "@/components/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (email: string, password: string) => {
    setError(null);
    setIsLoading(true);

    try {
      // TODO: Implement actual GraphQL login mutation
      // For now, simulate login
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock validation
      if (!email.includes("@")) {
        throw new Error("Invalid email address");
      }

      // Store token (mock)
      localStorage.setItem("token", "mock-jwt-token");
      localStorage.setItem(
        "user",
        JSON.stringify({
          name: email.includes("mike") ? "Mike Johnson" : "Sarah Williams",
          email,
          role: email.includes("contractor") ? "contractor" : "homeowner",
        })
      );

      // Redirect to dashboard
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setIsLoading(false);
    }
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
