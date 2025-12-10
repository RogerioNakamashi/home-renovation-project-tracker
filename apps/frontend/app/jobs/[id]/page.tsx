"use client";

import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
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
import {
  GET_JOB_QUERY,
  UPDATE_JOB_COST_MUTATION,
  UPDATE_JOB_STATUS_MUTATION,
} from "@/lib/graphql/job";
import {
  GET_MESSAGES_BY_JOB_QUERY,
  SEND_MESSAGE_MUTATION,
} from "@/lib/graphql/message";

import type { GQLJob, AuthUser, GQLMessage } from "@/lib/graphql/types";

export default function JobDetailPage() {
  const router = useRouter();
  const params = useParams();
  const jobId = params.id as string;

  const [user, setUser] = useState<AuthUser | null>(
    getUser() as AuthUser | null
  );
  // derive job from query result (avoid duplicating cache state)
  type Message = {
    id: string;
    senderId: string;
    senderName: string;
    content: string;
    timestamp: string;
    isOwnMessage: boolean;
  };
  const [localMessages, setLocalMessages] = useState<Message[]>([]);
  const [updateCostOpen, setUpdateCostOpen] = useState(false);
  const [newCostInput, setNewCostInput] = useState<string>(String(0));

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

  const { data: messagesData } = useQuery<{ messagesByJob: GQLMessage[] }>(
    GET_MESSAGES_BY_JOB_QUERY,
    {
      variables: { jobId },
      skip: !jobId,
      pollInterval: 3000,
      fetchPolicy: "network-only",
    }
  );

  const [sendMessage] = useMutation<
    { sendMessage: GQLMessage },
    { input: { jobId: string; content: string; senderId: string } }
  >(SEND_MESSAGE_MUTATION);

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

  const handleLogout = () => {
    clearAuth();
    router.push("/login");
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

  if (!jobData?.job) {
    return null;
  }

  const job = jobData.job;

  const handleStatusChange = async (event: SelectChangeEvent<JobStatus>) => {
    const newStatus = event.target.value as JobStatus;
    console.log({ newStatus });
    try {
      if (!jobData.job) return;
      await updateJobStatus({
        variables: {
          input: {
            jobId: job.id,
            status: newStatus,
          },
        },
        refetchQueries: [{ query: GET_JOB_QUERY, variables: { id: job.id } }],
        awaitRefetchQueries: true,
      });
    } catch (err) {
      console.error("update status failed", err);
    }
  };

  const handleSendMessage = async (content: string) => {
    const senderId = getUserId() ?? "";

    const optimistic: Message = {
      id: `local-${Date.now()}`,
      senderId: senderId ?? "",
      senderName: user?.name || "You",
      content,
      timestamp: new Date().toISOString(),
      isOwnMessage: true,
    };
    setLocalMessages((s) => [...s, optimistic]);

    try {
      await sendMessage({
        variables: { input: { jobId: job.id, content, senderId } },
      });
      setLocalMessages((s) => s.filter((m) => !m.id.startsWith("local-")));
    } catch (err) {
      console.error("send message failed", err);
      setLocalMessages((s) => s.filter((m) => !m.id.startsWith("local-")));
    }
  };

  const handleMarkComplete = () => {
    (async () => {
      try {
        const res = await updateJobStatus({
          variables: { input: { jobId: job.id, status: "COMPLETED" } },
          refetchQueries: [{ query: GET_JOB_QUERY, variables: { id: job.id } }],
          awaitRefetchQueries: true,
        });
        if (res?.data?.updateJobStatus) {
        }
      } catch (err) {
        console.error("mark complete failed", err);
      }
    })();
  };

  const handleCancelJob = () => {
    (async () => {
      try {
        const res = await updateJobStatus({
          variables: { input: { jobId: job.id, status: "CANCELED" } },
          refetchQueries: [{ query: GET_JOB_QUERY, variables: { id: job.id } }],
          awaitRefetchQueries: true,
        });
        if (res?.data?.updateJobStatus) {
        }
      } catch (err) {
        console.error("cancel job failed", err);
      }
    })();
  };

  const handleUpdateCost = () => {
    setNewCostInput(String(job?.cost ?? 0));
    setUpdateCostOpen(true);
  };

  const closeUpdateCost = () => {
    setUpdateCostOpen(false);
    setNewCostInput(String(0));
  };

  const submitUpdateCost = async () => {
    const parsed = Number(newCostInput) || 0;
    try {
      const contractorId = getUserId();
      await updateJobCost({
        variables: {
          input: { jobId: job.id, cost: parsed, contractorId },
        },
        refetchQueries: [{ query: GET_JOB_QUERY, variables: { id: job.id } }],
        awaitRefetchQueries: true,
      });
      closeUpdateCost();
    } catch (err) {
      console.error("update cost failed", err);
    }
  };

  const fetchedMessages: Message[] = (messagesData?.messagesByJob ?? []).map(
    (m) => ({
      id: m.id,
      senderId: m.senderId,
      senderName: m.sender?.name ?? "",
      content: m.content,
      timestamp: m.createdAt,
      isOwnMessage: m.senderId === currentUserId,
    })
  );

  const combinedMessages = [...fetchedMessages, ...localMessages].map(
    (msg) => ({
      ...msg,
      isOwnMessage: msg.senderId === currentUserId,
    })
  );

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
              {job.name}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              {isContractor ? (
                <FormControl size="small" sx={{ minWidth: 150 }}>
                  <Select
                    value={job.status}
                    onChange={handleStatusChange}
                    sx={{
                      bgcolor: "background.paper",
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "divider",
                      },
                    }}
                  >
                    <MenuItem value="PLANNING">Planning</MenuItem>
                    <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
                    <MenuItem value="COMPLETED">Completed</MenuItem>
                    <MenuItem value="CANCELED">Canceled</MenuItem>
                  </Select>
                </FormControl>
              ) : (
                <Box
                  sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}
                >
                  <Typography variant="body2" color="text.secondary">
                    Status
                  </Typography>
                  <Typography variant="body1">{status}</Typography>
                </Box>
              )}
            </Box>
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
                createdAt={job.createdAt ?? ""}
                homeowner={{
                  name: job.homeowner?.name ?? "",
                  email: job.homeowner?.email ?? "",
                }}
              />

              {/* Messages */}
              <Box sx={{ minHeight: 400 }}>
                <MessageList
                  messages={combinedMessages}
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
                isCompleted={job.status === "COMPLETED"}
                isCanceled={job.status === "CANCELED"}
              />
            </Box>
          </Grid>
        </Grid>
      </Box>
    </MainLayout>
  );
}
