"use client";

import { Chip, ChipProps } from "@mui/material";

export type JobStatus = "planning" | "in_progress" | "completed" | "canceled";

interface StatusChipProps {
  status: JobStatus;
  size?: ChipProps["size"];
}

const statusConfig: Record<
  JobStatus,
  { label: string; bgcolor: string; color: string }
> = {
  planning: {
    label: "Planning",
    bgcolor: "#EFF6FF",
    color: "#1D4ED8",
  },
  in_progress: {
    label: "In Progress",
    bgcolor: "#FFFBEB",
    color: "#B45309",
  },
  completed: {
    label: "Completed",
    bgcolor: "#F0FDF4",
    color: "#15803D",
  },
  canceled: {
    label: "Canceled",
    bgcolor: "#FEF2F2",
    color: "#B91C1C",
  },
};

export function StatusChip({ status, size = "small" }: StatusChipProps) {
  const config = statusConfig[status];

  return (
    <Chip
      label={config.label}
      size={size}
      sx={{
        bgcolor: config.bgcolor,
        color: config.color,
        fontWeight: 400,
        fontSize: "0.75rem",
        borderRadius: "9999px",
        "& .MuiChip-label": {
          px: 1,
        },
      }}
    />
  );
}
