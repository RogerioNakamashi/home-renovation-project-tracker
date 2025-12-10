"use client";

import {
  Card,
  CardContent,
  Box,
  Typography,
  SvgIconProps,
} from "@mui/material";
import {
  Work as WorkIcon,
  PlayCircle as PlayCircleIcon,
  CheckCircle as CheckCircleIcon,
  AttachMoney as AttachMoneyIcon,
} from "@mui/icons-material";
import { ComponentType } from "react";

export type StatsType = "total" | "in_progress" | "completed" | "revenue";

interface StatsCardProps {
  type: StatsType;
  value: string | number;
  label: string;
}

const statsConfig: Record<
  StatsType,
  { icon: ComponentType<SvgIconProps>; bgcolor: string; iconColor: string }
> = {
  total: {
    icon: WorkIcon,
    bgcolor: "#E6F7F0",
    iconColor: "#00A862",
  },
  in_progress: {
    icon: PlayCircleIcon,
    bgcolor: "#FEF3C7",
    iconColor: "#F59E0B",
  },
  completed: {
    icon: CheckCircleIcon,
    bgcolor: "#DCFCE7",
    iconColor: "#22C55E",
  },
  revenue: {
    icon: AttachMoneyIcon,
    bgcolor: "#DBEAFE",
    iconColor: "#0075FF",
  },
};

export function StatsCard({ type, value, label }: StatsCardProps) {
  const config = statsConfig[type];
  const Icon = config.icon;

  return (
    <Card
      sx={{
        height: "100%",
        border: 1,
        borderColor: "divider",
      }}
      elevation={1}
    >
      <CardContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 400,
                color: "text.primary",
                mb: 0.5,
              }}
            >
              {value}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: "text.secondary",
              }}
            >
              {label}
            </Typography>
          </Box>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: "50%",
              bgcolor: config.bgcolor,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon sx={{ color: config.iconColor }} />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
