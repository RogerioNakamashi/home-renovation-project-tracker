"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Grid,
  FormControl,
  Select,
  MenuItem,
  SelectChangeEvent,
  Paper,
} from "@mui/material";
import { ArrowBack as ArrowBackIcon } from "@mui/icons-material";
import { MainLayout } from "@/components/layout";
import { JobStatus } from "@/components/ui";
import {
  MessageList,
  ProjectInfo,
  ProjectCostCard,
  JobActionsCard,
} from "@/components/jobs";
import { useRouter, useParams } from "next/navigation";

// Mock data - will be replaced with GraphQL queries
const mockJobDetail = {
  id: "1",
  title: "Kitchen Remodel",
  status: "in_progress" as JobStatus,
  description:
    "Complete kitchen renovation including new cabinets, countertops, and appliances.",
  address: "123 Main Street, Springfield, IL 62701",
  cost: 45000,
  createdAt: "2025-11-15",
  updatedAt: "2025-12-08",
  homeowner: {
    id: "hw-1",
    name: "Sarah Williams",
    email: "sarah@email.com",
  },
  contractor: {
    id: "c-1",
    name: "Mike Johnson",
    email: "mike@contractor.com",
  },
};

const mockMessages = [
  {
    id: "m1",
    senderId: "c-1",
    senderName: "Mike Johnson",
    content:
      "Good morning! The cabinets arrived today and we'll start installation tomorrow.",
    timestamp: "2025-12-08T06:30:00",
    isOwnMessage: true,
  },
  {
    id: "m2",
    senderId: "hw-1",
    senderName: "Sarah Williams",
    content: "That's great news! Will you need access to the house all day?",
    timestamp: "2025-12-08T07:15:00",
    isOwnMessage: false,
  },
  {
    id: "m3",
    senderId: "c-1",
    senderName: "Mike Johnson",
    content:
      "Yes, we'll be there from 8 AM to 5 PM. Please make sure pets are secured.",
    timestamp: "2025-12-08T07:45:00",
    isOwnMessage: true,
  },
];

interface User {
  name: string;
  email: string;
  role: "contractor" | "homeowner";
}

export default function JobDetailPage() {
  const router = useRouter();
  const params = useParams();
  const jobId = params.id as string;

  const [user, setUser] = useState<User | null>(null);
  const [job, setJob] = useState(mockJobDetail);
  const [messages, setMessages] = useState(mockMessages);
  const [status, setStatus] = useState<JobStatus>(job.status);

  useEffect(() => {
    // Get user from localStorage (mock auth)
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      // setUser(JSON.parse(storedUser));
    } else {
      router.push("/login");
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  const handleStatusChange = (event: SelectChangeEvent<JobStatus>) => {
    const newStatus = event.target.value as JobStatus;
    setStatus(newStatus);
    setJob({ ...job, status: newStatus });
    // TODO: GraphQL mutation to update status
  };

  const handleSendMessage = (content: string) => {
    const newMessage = {
      id: `m${messages.length + 1}`,
      senderId: user?.email.includes("contractor") ? "c-1" : "hw-1",
      senderName: user?.name || "Unknown",
      content,
      timestamp: new Date().toISOString(),
      isOwnMessage: true,
    };
    setMessages([...messages, newMessage]);
    // TODO: GraphQL mutation to send message
  };

  const handleMarkComplete = () => {
    setStatus("completed");
    setJob({ ...job, status: "completed" });
    // TODO: GraphQL mutation
  };

  const handleCancelJob = () => {
    setStatus("canceled");
    setJob({ ...job, status: "canceled" });
    // TODO: GraphQL mutation
  };

  const handleUpdateCost = () => {
    // TODO: Open modal to update cost
    console.log("Update cost");
  };

  if (!user) {
    return null;
  }

  const isContractor = user.role === "contractor";
  const currentUserId = isContractor ? "c-1" : "hw-1";

  // Update message ownership based on current user
  const messagesWithOwnership = messages.map((msg) => ({
    ...msg,
    isOwnMessage: msg.senderId === currentUserId,
  }));

  return (
    <MainLayout user={user} onLogout={handleLogout}>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        {/* Back Button */}
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => router.push("/dashboard")}
          sx={{
            alignSelf: "flex-start",
            color: "text.secondary",
            "&:hover": {
              bgcolor: "transparent",
              color: "text.primary",
            },
          }}
        >
          Back to Dashboard
        </Button>

        {/* Header Card */}
        <Paper
          sx={{
            p: 3,
            border: 1,
            borderColor: "divider",
          }}
          elevation={1}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            <Typography variant="h4" sx={{ fontWeight: 500 }}>
              {job.title}
            </Typography>
            {isContractor && (
              <FormControl size="small" sx={{ minWidth: 150 }}>
                <Select
                  value={status}
                  onChange={handleStatusChange}
                  sx={{
                    bgcolor: "background.paper",
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "divider",
                    },
                  }}
                >
                  <MenuItem value="planning">Planning</MenuItem>
                  <MenuItem value="in_progress">In Progress</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                  <MenuItem value="canceled">Canceled</MenuItem>
                </Select>
              </FormControl>
            )}
          </Box>
        </Paper>

        {/* Main Content */}
        <Grid container spacing={3}>
          {/* Left Column */}
          <Grid size={{ xs: 12, lg: 8 }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {/* Project Info */}
              <ProjectInfo
                description={job.description}
                address={job.address}
                createdAt={job.createdAt}
                homeowner={job.homeowner}
              />

              {/* Messages */}
              <Box sx={{ minHeight: 400 }}>
                <MessageList
                  messages={messagesWithOwnership}
                  currentUserId={currentUserId}
                  onSendMessage={handleSendMessage}
                />
              </Box>
            </Box>
          </Grid>

          {/* Right Column */}
          <Grid size={{ xs: 12, lg: 4 }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {/* Project Cost */}
              <ProjectCostCard
                cost={job.cost}
                onUpdateCost={handleUpdateCost}
                canEdit={isContractor}
              />

              {/* Actions */}
              <JobActionsCard
                onMarkComplete={handleMarkComplete}
                onCancelJob={handleCancelJob}
                canEdit={isContractor}
                isCompleted={status === "completed"}
                isCanceled={status === "canceled"}
              />
            </Box>
          </Grid>
        </Grid>
      </Box>
    </MainLayout>
  );
}
