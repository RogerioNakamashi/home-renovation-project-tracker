// Authentication token management utilities

const ACCESS_TOKEN_KEY = "home_renovation_access_token";
const REFRESH_TOKEN_KEY = "home_renovation_refresh_token";
const USER_KEY = "home_renovation_user";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: "HOMEOWNER" | "CONTRACTOR";
  createdAt: string;
  updatedAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

/**
 * Save authentication tokens to localStorage
 */
export const saveTokens = (tokens: AuthTokens): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
};

/**
 * Get the access token from localStorage
 */
export const getAccessToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ACCESS_TOKEN_KEY);
};

/**
 * Get the refresh token from localStorage
 */
export const getRefreshToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(REFRESH_TOKEN_KEY);
};

/**
 * Save user data to localStorage
 */
export const saveUser = (user: AuthUser): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

/**
 * Get user data from localStorage
 */
export const getUser = (): AuthUser | null => {
  if (typeof window === "undefined") return null;
  const userData = localStorage.getItem(USER_KEY);
  if (!userData) return null;
  try {
    return JSON.parse(userData) as AuthUser;
  } catch {
    return null;
  }
};

/**
 * Clear all authentication data from localStorage
 */
export const clearAuth = (): void => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  return !!getAccessToken();
};
