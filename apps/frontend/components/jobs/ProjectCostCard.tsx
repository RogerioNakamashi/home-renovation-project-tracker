"use client";

import { Paper, Box, Typography, Button } from "@mui/material";
import { AttachMoney as MoneyIcon } from "@mui/icons-material";

interface ProjectCostCardProps {
  cost: number;
  onUpdateCost?: () => void;
  canEdit?: boolean;
  jobStatus?: string;
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function ProjectCostCard({
  cost,
  onUpdateCost,
  canEdit = false,
  jobStatus,
}: ProjectCostCardProps) {
  const disabled =
    !canEdit || jobStatus === "COMPLETED" || jobStatus === "CANCELED";

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
        Project Cost
      </Typography>

      <Box
        sx={{
          p: 3,
          borderRadius: 3,
          background: "linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%)",
          mb: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
          <MoneyIcon sx={{ fontSize: 20, color: "text.secondary" }} />
          <Typography variant="body2" color="text.secondary">
            Current Cost
          </Typography>
        </Box>
        <Typography
          variant="h4"
          sx={{
            color: "success.dark",
            fontWeight: 400,
          }}
        >
          {formatCurrency(cost)}
        </Typography>
      </Box>

      {canEdit && (
        <Button
          variant="outlined"
          fullWidth
          onClick={onUpdateCost}
          disabled={disabled}
          sx={{
            borderColor: "divider",
            color: "text.primary",
            "&:hover": {
              borderColor: "text.secondary",
              bgcolor: "grey.50",
            },
          }}
        >
          Update Cost
        </Button>
      )}
    </Paper>
  );
}
