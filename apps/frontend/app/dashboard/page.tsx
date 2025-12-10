"use client";

import { useState } from "react";
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

// Mock data - will be replaced with GraphQL queries
const mockJobs: Job[] = [
  {
    id: "1",
    title: "Kitchen Remodel",
    status: "in_progress",
    homeownerName: "Sarah Williams",
    address: "123 Main Street, Springfield, IL 62701",
    cost: 45000,
    updatedAt: "2025-12-08",
  },
  {
    id: "2",
    title: "Bathroom Renovation",
    status: "planning",
    homeownerName: "David Chen",
    address: "456 Oak Avenue, Springfield, IL 62702",
    cost: 28000,
    updatedAt: "2025-12-05",
  },
  {
    id: "3",
    title: "Basement Finishing",
    status: "completed",
    homeownerName: "Emily Rodriguez",
    address: "789 Elm Street, Springfield, IL 62703",
    cost: 62000,
    updatedAt: "2025-11-30",
  },
  {
    id: "4",
    title: "Deck Addition",
    status: "in_progress",
    homeownerName: "Sarah Williams",
    address: "321 Pine Road, Springfield, IL 62704",
    cost: 18500,
    updatedAt: "2025-12-09",
  },
];

// Mock user - will be replaced with auth integration
const mockUser = {
  name: "Mike Johnson",
  email: "mike@contractor.com",
  role: "contractor" as const,
};

type FilterStatus = "all" | JobStatus;

export default function DashboardPage() {
  const router = useRouter();
  const [jobs] = useState<Job[]>(mockJobs);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");

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

  if (!mockUser) {
    return null;
  }

  return (
    <MainLayout user={mockUser} onLogout={handleLogout}>
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
              Welcome back, {mockUser.name}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
              Manage your renovation projects
            </Typography>
          </Box>
          {mockUser.role === "contractor" && (
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
