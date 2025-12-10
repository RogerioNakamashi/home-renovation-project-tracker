"use client";

import { useState } from "react";
import { useMutation, useQuery } from "@apollo/client/react";
import {
  Box,
  Typography,
  Button,
  Grid,
  FormControl,
  Select,
  MenuItem,
  SelectChangeEvent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
} from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { MainLayout } from "@/components/layout";
import { StatsCard, JobCard, Job, JobStatus } from "@/components/ui";
import { useRouter } from "next/navigation";
import { GET_USER_WITH_JOBS_QUERY } from "@/lib/graphql";
import { CREATE_JOB_MUTATION } from "@/lib/graphql/job";
import { GET_HOMEOWNERS_QUERY } from "@/lib/graphql/auth";
import { getUserId, getUser } from "@/lib/auth";
import type { GQLUser, GQLJob } from "@/lib/graphql/types";

type FilterStatus = "all" | JobStatus;

export default function DashboardContent() {
  const router = useRouter();

  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");

  const storedUser = getUser();
  const userId = getUserId();

  const { data } = useQuery<{
    user?: GQLUser;
    jobsByContractor?: GQLJob[];
    jobsByHomeowner?: GQLJob[];
  }>(GET_USER_WITH_JOBS_QUERY, {
    variables: { id: userId },
    skip: !userId,
    fetchPolicy: "cache-and-network",
  });

  // Merge storedUser with server user so we don't lose fields when server
  // returns a partial user object. Server role may be uppercase (eg. "CONTRACTOR").
  const apiUser: GQLUser | null = (() => {
    if (!storedUser && !data?.user) return null;
    return {
      ...(storedUser ?? {}),
      ...(data?.user ?? {}),
    } as GQLUser;
  })();

  const normalizedRole = apiUser?.role
    ? String(apiUser.role).toLowerCase().trim()
    : null;
  const isContractor = normalizedRole === "contractor";

  const rawJobs: GQLJob[] = (() => {
    if (!data) return [];
    if (normalizedRole === "contractor") return data?.jobsByContractor ?? [];
    if (normalizedRole === "homeowner") return data?.jobsByHomeowner ?? [];
    return [
      ...(data?.jobsByContractor ?? []),
      ...(data?.jobsByHomeowner ?? []),
    ];
  })();

  const jobs: Job[] = rawJobs.map((j) => ({
    id: String(j.id),
    title: j.name,
    status: j.status,
    homeownerName: j.homeowner?.name ?? "",
    address: j.address ?? "",
    cost: typeof j.cost === "number" ? j.cost : Number(j.cost) || 0,
    updatedAt: j.updatedAt ?? j.createdAt ?? "",
  }));

  const layoutUser = apiUser
    ? {
        name: apiUser.name ?? "",
        email: apiUser.email ?? "",
        role: (normalizedRole as "contractor" | "homeowner") ?? "contractor",
      }
    : null;

  const handleLogout = () => {
    router.push("/login");
  };

  const handleFilterChange = (event: SelectChangeEvent<FilterStatus>) => {
    setFilterStatus(event.target.value as FilterStatus);
  };

  const handleJobClick = (job: Job) => {
    router.push(`/jobs/${job.id}`);
  };

  // Create job modal state
  const [createOpen, setCreateOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [homeownerId, setHomeownerId] = useState<string | null>(null);
  const [costInput, setCostInput] = useState<string>("");

  // fetch homeowners for selection
  const { data: homeownersData, loading: homeownersLoading } = useQuery<{
    homeowners: Array<{ id: string; name: string }>;
  }>(GET_HOMEOWNERS_QUERY);

  const [createJob, { loading: creating }] = useMutation(CREATE_JOB_MUTATION, {
    refetchQueries: [
      { query: GET_USER_WITH_JOBS_QUERY, variables: { id: userId } },
    ],
    awaitRefetchQueries: true,
  });

  const closeCreate = () => {
    setCreateOpen(false);
    setName("");
    setDescription("");
    setAddress("");
    setHomeownerId(null);
    setCostInput("");
  };

  const handleSubmitCreate = async () => {
    if (!userId) return;
    const parsedCost = Number(costInput) || 0;

    try {
      await createJob({
        variables: {
          input: {
            name,
            description,
            address,
            contractorId: userId,
            homeownerId: homeownerId ?? userId,
            cost: parsedCost,
          },
        },
      });

      closeCreate();
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("create job failed", err);
    }
  };

  const handleCreateJob = () => {
    setCreateOpen(true);
  };

  const filteredJobs =
    filterStatus === "all"
      ? jobs
      : jobs.filter((job) => job.status === filterStatus);

  const stats = {
    total: jobs.length,
    inProgress: jobs.filter((j) => j.status === "IN_PROGRESS").length,
    completed: jobs.filter((j) => j.status === "COMPLETED").length,
    revenue: jobs
      .filter((j) => j.status === "COMPLETED")
      .reduce((sum, j) => sum + j.cost, 0),
  };

  if (!apiUser) return null;

  return (
    <MainLayout user={layoutUser} onLogout={handleLogout}>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 500,
                color: "text.primary",
              }}
            >
              Welcome back, {apiUser.name}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
              Manage your renovation projects
            </Typography>
          </Box>
          {isContractor && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleCreateJob}
              sx={{ px: 3 }}
            >
              Create New Job
            </Button>
          )}
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatsCard type="total" value={stats.total} label="Total Jobs" />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatsCard
              type="in_progress"
              value={stats.inProgress}
              label="In Progress"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatsCard
              type="completed"
              value={stats.completed}
              label="Completed"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatsCard
              type="revenue"
              value={`$${stats.revenue.toLocaleString()}`}
              label="Total Revenue"
            />
          </Grid>
        </Grid>

        {/* Projects Section */}
        <Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: 500 }}>
              Projects
            </Typography>
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <Select
                value={filterStatus}
                onChange={handleFilterChange}
                sx={{
                  bgcolor: "background.paper",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "divider",
                  },
                }}
              >
                <MenuItem value="all">All Projects</MenuItem>
                <MenuItem value="planning">Planning</MenuItem>
                <MenuItem value="in_progress">In Progress</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
                <MenuItem value="canceled">Canceled</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* Job Cards Grid */}
          <Grid container spacing={3}>
            {filteredJobs.map((job) => (
              <Grid key={job.id} size={{ xs: 12, md: 6 }}>
                <JobCard job={job} onClick={handleJobClick} />
              </Grid>
            ))}
          </Grid>

          {filteredJobs.length === 0 && (
            <Box
              sx={{
                textAlign: "center",
                py: 8,
                color: "text.secondary",
              }}
            >
              <Typography variant="body1">
                No projects found with the selected filter.
              </Typography>
            </Box>
          )}
        </Box>

        {/* Create Job Modal */}
        <Dialog open={createOpen} onClose={closeCreate} fullWidth maxWidth="sm">
          <DialogTitle>Create New Job</DialogTitle>
          <DialogContent dividers>
            <Box
              sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
            >
              <TextField
                label="Project name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                fullWidth
              />
              <TextField
                label="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                fullWidth
                multiline
                minRows={3}
              />
              <TextField
                label="Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                fullWidth
              />

              <FormControl fullWidth>
                <Select
                  value={homeownerId ?? ""}
                  onChange={(e) => setHomeownerId(e.target.value as string)}
                  displayEmpty
                >
                  <MenuItem value="">Select homeowner</MenuItem>
                  {homeownersLoading ? (
                    <MenuItem disabled>Loading...</MenuItem>
                  ) : (
                    (homeownersData?.homeowners ?? []).map((h) => (
                      <MenuItem key={h.id} value={h.id}>
                        {h.name}
                      </MenuItem>
                    ))
                  )}
                </Select>
              </FormControl>

              <TextField
                label="Estimated cost"
                value={costInput}
                onChange={(e) => setCostInput(e.target.value)}
                fullWidth
                type="number"
                inputProps={{ min: 0 }}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeCreate} disabled={creating}>
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleSubmitCreate}
              disabled={creating || !name}
            >
              {creating ? <CircularProgress size={20} /> : "Create"}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </MainLayout>
  );
}
