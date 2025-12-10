"use client";

import { Box, Toolbar } from "@mui/material";
import { AppBar } from "./AppBar";
import { Sidebar, DRAWER_WIDTH } from "./Sidebar";
import { ReactNode } from "react";

interface User {
  name: string;
  email: string;
  role: "contractor" | "homeowner";
}

interface MainLayoutProps {
  children: ReactNode;
  user?: User | null;
  onLogout?: () => void;
  showSidebar?: boolean;
}

export function MainLayout({
  children,
  user,
  onLogout,
  showSidebar = true,
}: MainLayoutProps) {
  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <AppBar user={user} onLogout={onLogout} />
      {showSidebar && <Sidebar />}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: "background.default",
          p: 3,
          ml: showSidebar ? 0 : 0,
          width: showSidebar ? `calc(100% - ${DRAWER_WIDTH}px)` : "100%",
        }}
      >
        <Toolbar /> {/* Spacer for fixed AppBar */}
        {children}
      </Box>
    </Box>
  );
}
