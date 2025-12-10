"use client";

import {
  Card,
  CardContent,
  CardActionArea,
  Box,
  Typography,
} from "@mui/material";
import { Person as PersonIcon, Place as PlaceIcon } from "@mui/icons-material";
import { StatusChip, JobStatus } from "./StatusChip";

export interface Job {
  id: string;
  title: string;
  status: JobStatus;
  homeownerName: string;
  address: string;
  cost: number;
  updatedAt: string;
}

interface JobCardProps {
  job: Job;
  onClick?: (job: Job) => void;
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function JobCard({ job, onClick }: JobCardProps) {
  return (
    <Card
      sx={{
        height: "100%",
        border: 1,
        borderColor: "divider",
      }}
      elevation={1}
    >
      <CardActionArea onClick={() => onClick?.(job)} sx={{ height: "100%" }}>
        <CardContent
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1.5,
            height: "100%",
          }}
        >
          {/* Header */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: 2,
            }}
          >
            <Typography
              variant="body1"
              sx={{
                fontWeight: 400,
                color: "text.primary",
              }}
            >
              {job.title}
            </Typography>
            <StatusChip status={job.status} />
          </Box>

          {/* Info */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <PersonIcon sx={{ fontSize: 16, color: "text.secondary" }} />
              <Typography variant="body2" color="text.secondary">
                {job.homeownerName}
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <PlaceIcon sx={{ fontSize: 16, color: "text.secondary" }} />
              <Typography variant="body2" color="text.secondary">
                {job.address}
              </Typography>
            </Box>
          </Box>

          {/* Footer */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              pt: 1.5,
              mt: "auto",
              borderTop: 1,
              borderColor: "divider",
            }}
          >
            <Box>
              <Typography
                variant="body2"
                sx={{ color: "text.secondary", fontSize: "0.875rem" }}
              >
                Project Cost
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: "primary.main",
                  fontWeight: 400,
                }}
              >
                {formatCurrency(job.cost)}
              </Typography>
            </Box>
            <Box sx={{ textAlign: "right" }}>
              <Typography
                variant="body2"
                sx={{ color: "text.secondary", fontSize: "0.875rem" }}
              >
                Last Updated
              </Typography>
              <Typography variant="body2" sx={{ color: "text.primary" }}>
                {formatDate(job.updatedAt)}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
