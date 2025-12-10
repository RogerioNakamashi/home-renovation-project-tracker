"use client";

import { Chip, ChipProps } from "@mui/material";

export type JobStatus = "PLANNING" | "IN_PROGRESS" | "COMPLETED" | "CANCELED";

interface StatusChipProps {
  status: JobStatus;
  size?: ChipProps["size"];
}

const statusConfig: Record<
  JobStatus,
  { label: string; bgcolor: string; color: string }
> = {
  PLANNING: {
    label: "Planning",
    bgcolor: "#EFF6FF",
    color: "#1D4ED8",
  },
  IN_PROGRESS: {
    label: "In Progress",
    bgcolor: "#FFFBEB",
    color: "#B45309",
  },
  COMPLETED: {
    label: "Completed",
    bgcolor: "#F0FDF4",
    color: "#15803D",
  },
  CANCELED: {
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
