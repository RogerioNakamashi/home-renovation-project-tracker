import { gql } from "@apollo/client";

export const JOB_FRAGMENT = gql`
  fragment JobFields on JobType {
    id
    name
    description
    address
    status
    cost
    contractorId
    homeownerId
    createdAt
    updatedAt
    contractor {
      id
      name
      email
      role
    }
    homeowner {
      id
      name
      email
      role
    }
  }
`;

export const GET_ALL_JOBS_QUERY = gql`
  ${JOB_FRAGMENT}
  query GetAllJobs {
    jobs {
      ...JobFields
    }
  }
`;

export const GET_JOBS_BY_CONTRACTOR_QUERY = gql`
  ${JOB_FRAGMENT}
  query JobsByContractor($contractorId: ID!) {
    jobsByContractor(contractorId: $contractorId) {
      ...JobFields
    }
  }
`;

export const GET_JOBS_BY_HOMEOWNER_QUERY = gql`
  ${JOB_FRAGMENT}
  query JobsByHomeowner($homeownerId: ID!) {
    jobsByHomeowner(homeownerId: $homeownerId) {
      ...JobFields
    }
  }
`;

export const CREATE_JOB_MUTATION = gql`
  ${JOB_FRAGMENT}
  mutation CreateJob($input: CreateJobInput!) {
    createJob(input: $input) {
      ...JobFields
    }
  }
`;

export const UPDATE_JOB_COST_MUTATION = gql`
  ${JOB_FRAGMENT}
  mutation UpdateJobCost($input: UpdateJobCostInput!) {
    updateJobCost(input: $input) {
      ...JobFields
    }
  }
`;

export const UPDATE_JOB_STATUS_MUTATION = gql`
  ${JOB_FRAGMENT}
  mutation UpdateJobStatus($input: UpdateJobStatusInput!) {
    updateJobStatus(input: $input) {
      ...JobFields
    }
  }
`;
