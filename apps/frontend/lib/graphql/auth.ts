import { gql } from "@apollo/client";

// ============ Fragments ============

export const USER_FRAGMENT = gql`
  fragment UserFields on UserType {
    id
    email
    name
    role
    createdAt
    updatedAt
  }
`;

export const AUTH_PAYLOAD_FRAGMENT = gql`
  ${USER_FRAGMENT}
  fragment AuthPayloadFields on AuthPayloadType {
    accessToken
    refreshToken
    user {
      ...UserFields
    }
  }
`;

// ============ Mutations ============

export const LOGIN_MUTATION = gql`
  ${AUTH_PAYLOAD_FRAGMENT}
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      ...AuthPayloadFields
    }
  }
`;

export const REFRESH_TOKENS_MUTATION = gql`
  mutation RefreshTokens($input: RefreshTokensInput!) {
    refreshTokens(input: $input) {
      accessToken
      refreshToken
    }
  }
`;

export const LOGOUT_MUTATION = gql`
  mutation Logout($input: LogoutInput!) {
    logout(input: $input)
  }
`;

export const CREATE_USER_MUTATION = gql`
  ${USER_FRAGMENT}
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
      ...UserFields
    }
  }
`;

// ============ Queries ============

export const GET_CURRENT_USER_QUERY = gql`
  ${USER_FRAGMENT}
  query GetCurrentUser($id: ID!) {
    user(id: $id) {
      ...UserFields
    }
  }
`;

export const GET_USERS_QUERY = gql`
  ${USER_FRAGMENT}
  query GetUsers {
    users {
      ...UserFields
    }
  }
`;

export const GET_HOMEOWNERS_QUERY = gql`
  ${USER_FRAGMENT}
  query GetHomeowners {
    homeowners {
      ...UserFields
    }
  }
`;

export const GET_CONTRACTORS_QUERY = gql`
  ${USER_FRAGMENT}
  query GetContractors {
    contractors {
      ...UserFields
    }
  }
`;
