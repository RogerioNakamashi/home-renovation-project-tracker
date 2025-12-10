"use client";

import {
  AppBar as MuiAppBar,
  Toolbar,
  Typography,
  Box,
  Avatar,
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  Divider,
} from "@mui/material";
import { Logout, Person } from "@mui/icons-material";
import { useState } from "react";

interface User {
  name: string;
  email: string;
  role: "contractor" | "homeowner";
}

interface AppBarProps {
  user?: User | null;
  onLogout?: () => void;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function AppBar({ user, onLogout }: AppBarProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleClose();
    onLogout?.();
  };

  return (
    <MuiAppBar
      position="fixed"
      sx={{
        bgcolor: "background.paper",
        borderBottom: 1,
        borderColor: "divider",
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
      elevation={0}
    >
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Typography
          variant="h6"
          component="div"
          sx={{
            color: "primary.main",
            fontWeight: 500,
          }}
        >
          RenovateTrack
        </Typography>

        {user && (
          <>
            <Button
              onClick={handleClick}
              sx={{
                borderRadius: 2,
                px: 1.5,
                py: 0.75,
                textTransform: "none",
                "&:hover": {
                  bgcolor: "grey.100",
                },
              }}
            >
              <Avatar
                sx={{
                  width: 40,
                  height: 40,
                  bgcolor: "primary.main",
                  mr: 1.5,
                  fontSize: "1rem",
                }}
              >
                {getInitials(user.name)}
              </Avatar>
              <Box sx={{ textAlign: "left" }}>
                <Typography
                  variant="body2"
                  sx={{ color: "text.primary", fontWeight: 400 }}
                >
                  {user.name}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: "text.secondary",
                    textTransform: "capitalize",
                  }}
                >
                  {user.role}
                </Typography>
              </Box>
            </Button>
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              transformOrigin={{ horizontal: "right", vertical: "top" }}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
              slotProps={{
                paper: {
                  sx: {
                    mt: 1,
                    minWidth: 200,
                  },
                },
              }}
            >
              <MenuItem onClick={handleClose}>
                <ListItemIcon>
                  <Person fontSize="small" />
                </ListItemIcon>
                Profile
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                  <Logout fontSize="small" />
                </ListItemIcon>
                Logout
              </MenuItem>
            </Menu>
          </>
        )}
      </Toolbar>
    </MuiAppBar>
  );
}
