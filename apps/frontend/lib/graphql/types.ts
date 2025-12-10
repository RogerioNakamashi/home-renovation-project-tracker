// Shared GraphQL result types used across the frontend

export type GQLUser = {
  id: string;
  name?: string;
  role?: string;
  email?: string;
};

export type GQLJob = {
  id: string;
  name: string;
  status: "COMPLETED" | "CANCELED" | "IN_PROGRESS" | "PLANNING";
  description: string;
  address: string;
  cost: number | string;
  homeowner?: { id?: string; name?: string; email?: string } | null;
  contractor?: { id?: string; name?: string; email?: string } | null;
  updatedAt?: string | null;
  createdAt?: string | null;
};

export type AuthUser = {
  id: string;
  email?: string;
  name?: string;
  role?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type JobDetail = {
  id: string;
  title?: string;
  status?: string;
  description?: string;
  address?: string;
  cost?: number;
  createdAt?: string;
  updatedAt?: string;
  homeowner?: { id?: string; name?: string; email?: string };
  contractor?: { id?: string; name?: string; email?: string } | null;
};
