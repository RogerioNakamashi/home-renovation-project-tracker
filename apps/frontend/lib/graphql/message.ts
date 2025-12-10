import { gql } from "@apollo/client";

export const MESSAGE_FRAGMENT = gql`
  fragment MessageFields on MessageType {
    id
    content
    jobId
    senderId
    createdAt
    sender {
      id
      name
      email
      role
    }
  }
`;

export const GET_MESSAGES_BY_JOB_QUERY = gql`
  ${MESSAGE_FRAGMENT}
  query MessagesByJob($jobId: ID!) {
    messagesByJob(jobId: $jobId) {
      ...MessageFields
    }
  }
`;

export const SEND_MESSAGE_MUTATION = gql`
  ${MESSAGE_FRAGMENT}
  mutation SendMessage($input: SendMessageInput!) {
    sendMessage(input: $input) {
      ...MessageFields
    }
  }
`;
