"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@apollo/client/react";
import { gql } from "@apollo/client";
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
import { getUser, clearAuth } from "@/lib/auth";
import { JOB_FRAGMENT } from "@/lib/graphql";

type GQLJob = {
  id: string | number;
  name?: string;
  title?: string;
  status?: string;
  description?: string;
  address?: string;
  cost?: number | string;
  createdAt?: string | null;
  updatedAt?: string | null;
  homeowner?: { id?: string; name?: string; email?: string } | null;
  contractor?: { id?: string; name?: string; email?: string } | null;
};

interface JobDetail {
  id: string;
  title: string;
  status: JobStatus;
  description: string;
  address: string;
  cost: number;
  createdAt: string;
  updatedAt: string;
  homeowner: { id?: string; name: string; email: string };
  contractor: { id?: string; name: string; email: string } | null;
}

interface User {
  name: string;
  email: string;
  role: "contractor" | "homeowner";
}

export default function JobDetailPage() {
  const router = useRouter();
  const params = useParams();
  const jobId = params.id as string;

  const [user, setUser] = useState<User | null>(getUser() as User | null);
  const [job, setJob] = useState<JobDetail | null>(null);
  type Message = {
    id: string;
    senderId: string;
    senderName: string;
    content: string;
    timestamp: string;
    isOwnMessage: boolean;
  };
  const [messages, setMessages] = useState<Message[]>([]);
  const [status, setStatus] = useState<JobStatus>("planning");

  // GraphQL: fetch job by id
  const GET_JOB_QUERY = gql`
    ${JOB_FRAGMENT}
    query GetJob($id: ID!) {
      job(id: $id) {
        ...JobFields
      }
    }
  `;

  const {
    data: jobData,
    loading: jobLoading,
    error: jobError,
  } = useQuery<{
    job?: GQLJob;
  }>(GET_JOB_QUERY, {
    variables: { id: jobId },
    skip: !jobId,
    fetchPolicy: "cache-and-network",
  });

  // when jobData arrives, map fields to UI shape and update state
  useEffect(() => {
    if (jobData?.job) {
      const j = jobData.job;
      const mapped: JobDetail = {
        id: String(j.id),
        title: j.name ?? j.title ?? "Untitled",
        status: (j.status ?? "planning").toString() as JobStatus,
        description: j.description ?? "",
        address: j.address ?? "",
        cost: typeof j.cost === "number" ? j.cost : Number(j.cost) || 0,
        createdAt: j.createdAt ?? "",
        updatedAt: j.updatedAt ?? "",
        homeowner: {
          id: j.homeowner?.id,
          name: j.homeowner?.name ?? "",
          email: j.homeowner?.email ?? "",
        },
        contractor: j.contractor
          ? {
              id: j.contractor.id,
              name: j.contractor.name ?? "",
              email: j.contractor.email ?? "",
            }
          : null,
      };
      setJob(mapped);
      setStatus(mapped.status as JobStatus);
    }
  }, [jobData]);

  useEffect(() => {
    if (!user) {
      clearAuth();
      router.push("/login");
    }
    console.log("User:", user);
  }, [user, router]);

  const handleLogout = () => {
    clearAuth();
    router.push("/login");
  };

  const handleStatusChange = (event: SelectChangeEvent<JobStatus>) => {
    const newStatus = event.target.value as JobStatus;
    setStatus(newStatus);
    if (job) setJob({ ...job, status: newStatus });
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
    if (job) setJob({ ...job, status: "completed" });
    // TODO: GraphQL mutation
  };

  const handleCancelJob = () => {
    setStatus("canceled");
    if (job) setJob({ ...job, status: "canceled" });
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

  // Loading / error states
  if (jobLoading) {
    return (
      <MainLayout user={user} onLogout={handleLogout}>
        <Box sx={{ p: 4 }}>Loading job…</Box>
      </MainLayout>
    );
  }

  if (jobError) {
    return (
      <MainLayout user={user} onLogout={handleLogout}>
        <Box sx={{ p: 4, color: "error.main" }}>Error loading job.</Box>
      </MainLayout>
    );
  }

  if (!job) {
    return null;
  }

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
