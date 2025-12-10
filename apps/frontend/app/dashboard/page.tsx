"use client";

import { useState } from "react";
import { useQuery } from "@apollo/client/react";
import {
  Box,
  Typography,
  Button,
  Grid,
  FormControl,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { MainLayout } from "@/components/layout";
import { StatsCard, JobCard, Job, JobStatus } from "@/components/ui";
import { useRouter } from "next/navigation";
import { GET_USER_WITH_JOBS_QUERY } from "@/lib/graphql";
import { getUserId, getUser } from "@/lib/auth";

// Data comes from backend via GraphQL query

type FilterStatus = "all" | JobStatus;

// minimal GraphQL result types for this query
type GQLUser = {
  id: string;
  name?: string;
  role?: string;
  email?: string;
};

type GQLJob = {
  id: string | number;
  name?: string;
  title?: string;
  status?: string;
  homeowner?: { name?: string } | null;
  address?: string;
  cost?: number | string;
  updatedAt?: string | null;
  createdAt?: string | null;
};

export default function DashboardPage() {
  const router = useRouter();

  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");

  const storedUser = getUser();
  const userId = getUserId();
  console.log("User ID:", userId);

  const { data, loading, error } = useQuery<{
    user?: GQLUser;
    jobsByContractor?: GQLJob[];
    jobsByHomeowner?: GQLJob[];
  }>(GET_USER_WITH_JOBS_QUERY, {
    variables: { id: userId },
    skip: !userId,
    fetchPolicy: "cache-and-network",
  });

  const apiUser = data?.user ?? storedUser ?? null;

  // pick the correct job list depending on role
  const rawJobs: GQLJob[] = (() => {
    if (!data) return [];
    if (apiUser?.role === "contractor") return data?.jobsByContractor ?? [];
    if (apiUser?.role === "homeowner") return data?.jobsByHomeowner ?? [];
    // fallback: merge both lists
    return [
      ...(data?.jobsByContractor ?? []),
      ...(data?.jobsByHomeowner ?? []),
    ];
  })();

  // map backend JobType -> UI Job shape
  const jobs: Job[] = rawJobs.map((j) => ({
    id: String(j.id),
    title: j.name ?? j.title ?? "Untitled",
    status: (j.status ?? "planning").toString().toLowerCase() as JobStatus,
    homeownerName: j.homeowner?.name ?? "",
    address: j.address ?? "",
    cost: typeof j.cost === "number" ? j.cost : Number(j.cost) || 0,
    updatedAt: j.updatedAt ?? j.createdAt ?? "",
  }));

  // normalize apiUser to the UI User shape expected by MainLayout
  const layoutUser = apiUser
    ? {
        name: apiUser.name ?? "",
        email: apiUser.email ?? "",
        role: (apiUser.role as "contractor" | "homeowner") ?? "contractor",
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

  const handleCreateJob = () => {
    router.push("/jobs/new");
  };

  // Filter jobs based on selected status
  const filteredJobs =
    filterStatus === "all"
      ? jobs
      : jobs.filter((job) => job.status === filterStatus);

  // Calculate stats
  const stats = {
    total: jobs.length,
    inProgress: jobs.filter((j) => j.status === "in_progress").length,
    completed: jobs.filter((j) => j.status === "completed").length,
    revenue: jobs
      .filter((j) => j.status === "completed")
      .reduce((sum, j) => sum + j.cost, 0),
  };

  if (!apiUser) {
    return null;
  }

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
          {apiUser.role === "contractor" && (
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
      </Box>
    </MainLayout>
  );
}
