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
