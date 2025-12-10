import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  from,
} from "@apollo/client/core";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import { CombinedGraphQLErrors } from "@apollo/client/errors";
import { getAccessToken, clearAuth } from "./auth";

const httpLink = new HttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_URL || "http://localhost:4000/graphql",
});

// Auth link to add JWT token to requests
const authLink = setContext((_, { headers }) => {
  const token = getAccessToken();
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

// Error handling link for Apollo Client v4
const errorLink = onError(({ error }) => {
  if (CombinedGraphQLErrors.is(error)) {
    for (const err of error.errors) {
      console.error(`[GraphQL error]: Message: ${err.message}`);
      if (
        err.extensions?.code === "UNAUTHENTICATED" ||
        err.message.includes("Unauthorized")
      ) {
        clearAuth();
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
      }
    }
  } else if (error) {
    // Network or other errors
    console.error(`[Network error]:`, error);
  }
});

export const apolloClient = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: "cache-and-network",
    },
  },
});
