"use client";

import { Paper, Box, Typography, Button } from "@mui/material";

interface JobActionsCardProps {
  onMarkComplete?: () => void;
  onCancelJob?: () => void;
  canEdit?: boolean;
  isCompleted?: boolean;
  isCanceled?: boolean;
}

export function JobActionsCard({
  onMarkComplete,
  onCancelJob,
  canEdit = false,
  isCompleted = false,
  isCanceled = false,
}: JobActionsCardProps) {
  if (!canEdit || isCanceled) {
    return null;
  }

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
        Actions
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
        {!isCompleted && !isCanceled && (
          <Button
            variant="contained"
            fullWidth
            onClick={onMarkComplete}
            sx={{
              bgcolor: "success.main",
              "&:hover": {
                bgcolor: "success.dark",
              },
            }}
          >
            Mark as Completed
          </Button>
        )}
        {!isCompleted && !isCanceled && (
          <Button
            variant="contained"
            fullWidth
            onClick={onCancelJob}
            sx={{
              bgcolor: "error.main",
              "&:hover": {
                bgcolor: "error.dark",
              },
            }}
          >
            Cancel Job
          </Button>
        )}
      </Box>
    </Paper>
  );
}
