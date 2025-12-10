"use client";

import { useEffect, useState } from "react";
import { CircularProgress, Box } from "@mui/material";
import { useRouter } from "next/navigation";
import { getUser } from "@/lib/auth";

export default function DashboardPage() {
  const router = useRouter();
  const [redirecting, setRedirecting] = useState(true);

  useEffect(() => {
    const u = getUser();
    const role = u?.role ? String(u.role).toLowerCase().trim() : null;
    if (role === "contractor") {
      router.replace("/dashboard/contractor");
    } else if (role === "homeowner") {
      router.replace("/dashboard/homeowner");
    } else {
      // fallback to contractor dashboard
      router.replace("/dashboard/contractor");
    }
  }, [router]);

  if (redirecting) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          p: 4,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return null;
}
