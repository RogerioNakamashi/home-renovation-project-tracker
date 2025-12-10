"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Box, CircularProgress } from "@mui/material";
import { getUserId } from "@/lib/auth";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated by presence of userId
    const userId = getUserId();
    if (userId) {
      router.push("/dashboard");
    } else {
      router.push("/login");
    }
  }, [router]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "background.default",
      }}
    >
      <CircularProgress color="primary" />
    </Box>
  );
}
