"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
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
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
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
import { getUser, clearAuth, getUserId } from "@/lib/auth";
import { JOB_FRAGMENT } from "@/lib/graphql";
import {
  UPDATE_JOB_COST_MUTATION,
  UPDATE_JOB_STATUS_MUTATION,
} from "@/lib/graphql/job";

import type { GQLJob, JobDetail, AuthUser } from "@/lib/graphql/types";

export default function JobDetailPage() {
  const router = useRouter();
  const params = useParams();
  const jobId = params.id as string;

  const [user, setUser] = useState<AuthUser | null>(
    getUser() as AuthUser | null
  );
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
  const [updateCostOpen, setUpdateCostOpen] = useState(false);
  const [newCostInput, setNewCostInput] = useState<string>(String(0));

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
        status: (j.status ?? "planning").toString(),
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

  const handleStatusChange = async (event: SelectChangeEvent<JobStatus>) => {
    const newStatus = event.target.value as JobStatus;
    setStatus(newStatus);
    if (job) setJob({ ...job, status: newStatus });
    try {
      if (!job) return;
      const enumMap: Record<string, string> = {
        planning: "PLANNING",
        in_progress: "IN_PROGRESS",
        completed: "COMPLETED",
        canceled: "CANCELED",
      };
      const res = await updateJobStatus({
        variables: {
          input: { jobId: job.id, status: enumMap[newStatus] ?? "PLANNING" },
        },
      });
      if (res?.data?.updateJobStatus) {
        const updated = res.data.updateJobStatus;
        setJob((prev) =>
          prev
            ? {
                ...prev,
                status: String(updated.status).toLowerCase() as JobStatus,
              }
            : prev
        );
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("update status failed", err);
    }
  };

  const handleSendMessage = (content: string) => {
    const newMessage = {
      id: `m${messages.length + 1}`,
      senderId:
        user?.email && user.email.includes("contractor") ? "c-1" : "hw-1",
      senderName: user?.name || "Unknown",
      content,
      timestamp: new Date().toISOString(),
      isOwnMessage: true,
    };
    setMessages([...messages, newMessage]);
    // TODO: GraphQL mutation to send message
  };

  const handleMarkComplete = () => {
    // Use mutation to mark as complete
    (async () => {
      if (!job) return;
      try {
        const res = await updateJobStatus({
          variables: { input: { jobId: job.id, status: "COMPLETED" } },
        });
        if (res?.data?.updateJobStatus) {
          const updated = res.data.updateJobStatus;
          const newStatusStr = String(updated.status).toLowerCase();
          setStatus(newStatusStr as JobStatus);
          setJob((prev) =>
            prev ? { ...prev, status: newStatusStr as JobStatus } : prev
          );
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error("mark complete failed", err);
      }
    })();
  };

  const handleCancelJob = () => {
    (async () => {
      if (!job) return;
      try {
        const res = await updateJobStatus({
          variables: { input: { jobId: job.id, status: "CANCELED" } },
        });
        if (res?.data?.updateJobStatus) {
          const updated = res.data.updateJobStatus;
          const newStatusStr = String(updated.status).toLowerCase();
          setStatus(newStatusStr as JobStatus);
          setJob((prev) =>
            prev ? { ...prev, status: newStatusStr as JobStatus } : prev
          );
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error("cancel job failed", err);
      }
    })();
  };

  const handleUpdateCost = () => {
    setNewCostInput(String(job?.cost ?? 0));
    setUpdateCostOpen(true);
  };

  // mutations
  type UpdateJobCostResp = { updateJobCost: GQLJob };
  type UpdateJobCostVars = {
    input: { jobId: string; cost: number; contractorId: string | null };
  };
  const [updateJobCost] = useMutation<UpdateJobCostResp, UpdateJobCostVars>(
    UPDATE_JOB_COST_MUTATION
  );

  type UpdateJobStatusResp = { updateJobStatus: GQLJob };
  type UpdateJobStatusVars = { input: { jobId: string; status: string } };
  const [updateJobStatus] = useMutation<
    UpdateJobStatusResp,
    UpdateJobStatusVars
  >(UPDATE_JOB_STATUS_MUTATION);

  const closeUpdateCost = () => {
    setUpdateCostOpen(false);
    setNewCostInput(String(0));
  };

  const submitUpdateCost = async () => {
    if (!job) return;
    const parsed = Number(newCostInput) || 0;
    try {
      const contractorId = getUserId();
      const res = await updateJobCost({
        variables: { input: { jobId: job.id, cost: parsed, contractorId } },
      });
      if (res?.data?.updateJobCost) {
        const updated = res.data.updateJobCost;
        setJob((prev) =>
          prev ? { ...prev, cost: Number(updated.cost) || parsed } : prev
        );
      }
      closeUpdateCost();
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("update cost failed", err);
    }
  };

  if (!user) {
    return null;
  }

  // normalize role (backend/localStorage may store uppercase enum values)
  const normalizedUserRole = user?.role
    ? String(user.role).toLowerCase().trim()
    : null;
  const isContractor = normalizedUserRole === "contractor";
  const currentUserId = isContractor ? "c-1" : "hw-1";

  const layoutUser = user
    ? {
        name: user.name ?? "",
        email: user.email ?? "",
        role:
          (normalizedUserRole as "contractor" | "homeowner") ?? "contractor",
      }
    : null;

  // Update message ownership based on current user
  const messagesWithOwnership = messages.map((msg) => ({
    ...msg,
    isOwnMessage: msg.senderId === currentUserId,
  }));

  // Loading / error states
  if (jobLoading) {
    return (
      <MainLayout user={layoutUser} onLogout={handleLogout}>
        <Box sx={{ p: 4 }}>Loading job…</Box>
      </MainLayout>
    );
  }

  if (jobError) {
    return (
      <MainLayout user={layoutUser} onLogout={handleLogout}>
        <Box sx={{ p: 4, color: "error.main" }}>Error loading job.</Box>
      </MainLayout>
    );
  }

  if (!job) {
    return null;
  }

  return (
    <MainLayout user={layoutUser} onLogout={handleLogout}>
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
                description={job.description ?? ""}
                address={job.address ?? ""}
                createdAt={job.createdAt ?? ""}
                homeowner={{
                  name: job.homeowner?.name ?? "",
                  email: job.homeowner?.email ?? "",
                }}
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
                cost={Number(job.cost ?? 0)}
                onUpdateCost={handleUpdateCost}
                canEdit={isContractor}
              />

              {/* Update Cost Dialog */}
              <Dialog
                open={updateCostOpen}
                onClose={closeUpdateCost}
                fullWidth
                maxWidth="xs"
              >
                <DialogTitle>Update Project Cost</DialogTitle>
                <DialogContent>
                  <TextField
                    label="Cost"
                    value={newCostInput}
                    onChange={(e) => setNewCostInput(e.target.value)}
                    type="number"
                    fullWidth
                    inputProps={{ min: 0 }}
                  />
                </DialogContent>
                <DialogActions>
                  <Button onClick={closeUpdateCost}>Cancel</Button>
                  <Button variant="contained" onClick={submitUpdateCost}>
                    Save
                  </Button>
                </DialogActions>
              </Dialog>

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
