"use client";

import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Box,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  Work as WorkIcon,
} from "@mui/icons-material";
import { usePathname, useRouter } from "next/navigation";

const DRAWER_WIDTH = 240;

interface SidebarProps {
  open?: boolean;
}

const menuItems = [
  {
    label: "Dashboard",
    icon: DashboardIcon,
    path: "/dashboard",
  },
];

export function Sidebar({ open = true }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: DRAWER_WIDTH,
          boxSizing: "border-box",
          borderRight: 1,
          borderColor: "divider",
          display: open ? "block" : "none",
        },
      }}
    >
      <Toolbar />
      <Box sx={{ overflow: "auto" }}>
        <Box
          sx={{
            px: 3,
            py: 2,
            borderBottom: 1,
            borderColor: "divider",
          }}
        >
          <Typography
            variant="body1"
            sx={{
              color: "primary.main",
              fontWeight: 500,
            }}
          >
            Menu
          </Typography>
        </Box>
        <List sx={{ px: 2, py: 2 }}>
          {menuItems.map((item) => {
            const isActive =
              pathname === item.path || pathname?.startsWith(`${item.path}/`);
            const Icon = item.icon;

            return (
              <ListItem key={item.path} disablePadding sx={{ mb: 1 }}>
                <ListItemButton
                  onClick={() => handleNavigation(item.path)}
                  sx={{
                    borderRadius: 2,
                    bgcolor: isActive ? "primary.main" : "transparent",
                    color: isActive ? "common.white" : "text.secondary",
                    "&:hover": {
                      bgcolor: isActive ? "primary.dark" : "grey.100",
                    },
                    "& .MuiListItemIcon-root": {
                      color: isActive ? "common.white" : "text.secondary",
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <Icon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      fontSize: "1rem",
                      fontWeight: isActive ? 500 : 400,
                    }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>
    </Drawer>
  );
}

export { DRAWER_WIDTH };
