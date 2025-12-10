"use client";

import { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  InputAdornment,
  IconButton,
  Alert,
  CircularProgress,
} from "@mui/material";
import {
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";

interface LoginFormProps {
  onSubmit: (email: string, password: string) => Promise<void>;
  error?: string | null;
  isLoading?: boolean;
}

const demoAccounts = [
  { role: "Contractor", email: "mike@contractor.com" },
  { role: "Homeowner", email: "sarah@email.com" },
];

export function LoginForm({
  onSubmit,
  error,
  isLoading = false,
}: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(email, password);
  };

  const handleDemoLogin = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword("demo123");
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        width: "100%",
        maxWidth: 448,
      }}
    >
      <Card
        sx={{
          border: 1,
          borderColor: "divider",
        }}
        elevation={1}
      >
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {/* Email Field */}
            <Box>
              <Typography
                component="label"
                variant="body2"
                sx={{
                  display: "block",
                  mb: 1,
                  color: "text.primary",
                }}
              >
                Email Address
              </Typography>
              <TextField
                fullWidth
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                disabled={isLoading}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon sx={{ color: "text.secondary" }} />
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Box>

            {/* Password Field */}
            <Box>
              <Typography
                component="label"
                variant="body2"
                sx={{
                  display: "block",
                  mb: 1,
                  color: "text.primary",
                }}
              >
                Password
              </Typography>
              <TextField
                fullWidth
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                disabled={isLoading}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon sx={{ color: "text.secondary" }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          disabled={isLoading}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Box>

            {/* Error Alert */}
            {error && (
              <Alert severity="error" sx={{ mt: 1 }}>
                {error}
              </Alert>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={isLoading || !email || !password}
              sx={{ mt: 1 }}
            >
              {isLoading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Sign In"
              )}
            </Button>
          </Box>

          {/* Demo Accounts Section */}
          <Box
            sx={{
              mt: 4,
              pt: 3,
              borderTop: 1,
              borderColor: "divider",
            }}
          >
            <Typography
              variant="body2"
              sx={{
                textAlign: "center",
                color: "text.secondary",
                mb: 2,
              }}
            >
              Demo Accounts:
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {demoAccounts.map((account) => (
                <Box
                  key={account.email}
                  onClick={() => handleDemoLogin(account.email)}
                  sx={{
                    p: 1.5,
                    bgcolor: "grey.50",
                    borderRadius: 2,
                    cursor: "pointer",
                    "&:hover": {
                      bgcolor: "grey.100",
                    },
                  }}
                >
                  <Typography variant="caption" component="span">
                    <strong>{account.role}:</strong> {account.email}
                  </Typography>
                </Box>
              ))}
              <Typography
                variant="caption"
                sx={{
                  textAlign: "center",
                  color: "text.secondary",
                  mt: 1,
                }}
              >
                Password: any value
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
