"use client";

import { Paper, Box, Typography, Avatar } from "@mui/material";
import {
  Place as PlaceIcon,
  CalendarToday as CalendarIcon,
  Person as PersonIcon,
  Email as EmailIcon,
} from "@mui/icons-material";

interface Homeowner {
  name: string;
  email: string;
}

interface ProjectInfoProps {
  description: string;
  address: string;
  createdAt: string;
  homeowner: Homeowner;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function ProjectInfo({
  description,
  address,
  createdAt,
  homeowner,
}: ProjectInfoProps) {
  return (
    <Paper
      sx={{
        p: 3,
        border: 1,
        borderColor: "divider",
      }}
      elevation={1}
    >
      <Typography variant="body1" sx={{ fontWeight: 400, mb: 2 }}>
        Project Information
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {/* Description */}
        <Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
            Description
          </Typography>
          <Typography variant="body1" sx={{ color: "text.primary" }}>
            {description}
          </Typography>
        </Box>

        {/* Address */}
        <Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
            Address
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <PlaceIcon sx={{ fontSize: 18, color: "text.secondary" }} />
            <Typography variant="body1" sx={{ color: "text.primary" }}>
              {address}
            </Typography>
          </Box>
        </Box>

        {/* Created Date */}
        <Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
            Created
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <CalendarIcon sx={{ fontSize: 18, color: "text.secondary" }} />
            <Typography variant="body1" sx={{ color: "text.primary" }}>
              {formatDate(createdAt)}
            </Typography>
          </Box>
        </Box>

        {/* Homeowner */}
        <Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Homeowner
          </Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              p: 2,
              bgcolor: "grey.50",
              borderRadius: 2,
            }}
          >
            <Avatar
              sx={{
                width: 48,
                height: 48,
                bgcolor: "primary.main",
                fontSize: "1rem",
              }}
            >
              {getInitials(homeowner.name)}
            </Avatar>
            <Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <PersonIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                <Typography variant="body1">{homeowner.name}</Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <EmailIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                <Typography variant="body2" color="text.secondary">
                  {homeowner.email}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
}
