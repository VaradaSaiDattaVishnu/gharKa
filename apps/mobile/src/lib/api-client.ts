import * as SecureStore from 'expo-secure-store';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3001';

interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
  authenticated?: boolean;
}

interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

let refreshPromise: Promise<TokenPair | null> | null = null;

async function getToken(): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync('accessToken');
  } catch {
    return null;
  }
}

async function getRefreshToken(): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync('refreshToken');
  } catch {
    return null;
  }
}

async function setTokens(tokens: TokenPair): Promise<void> {
  await SecureStore.setItemAsync('accessToken', tokens.accessToken);
  await SecureStore.setItemAsync('refreshToken', tokens.refreshToken);
}

async function clearTokens(): Promise<void> {
  await SecureStore.deleteItemAsync('accessToken');
  await SecureStore.deleteItemAsync('refreshToken');
}

async function refreshAccessToken(): Promise<TokenPair | null> {
  const refreshToken = await getRefreshToken();
  if (!refreshToken) return null;

  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      await clearTokens();
      return null;
    }

    const data = await response.json();
    const tokens: TokenPair = {
      accessToken: data.data.accessToken,
      refreshToken: data.data.refreshToken,
    };
    await setTokens(tokens);
    return tokens;
  } catch {
    await clearTokens();
    return null;
  }
}

export async function apiClient<T = unknown>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { body, authenticated = true, headers: customHeaders, ...restOptions } = options;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(customHeaders as Record<string, string>),
  };

  if (authenticated) {
    const token = await getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;

  let response = await fetch(url, {
    ...restOptions,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (response.status === 401 && authenticated) {
    if (!refreshPromise) {
      refreshPromise = refreshAccessToken();
    }

    const tokens = await refreshPromise;
    refreshPromise = null;

    if (tokens) {
      headers['Authorization'] = `Bearer ${tokens.accessToken}`;
      response = await fetch(url, {
        ...restOptions,
        headers,
        body: body ? JSON.stringify(body) : undefined,
      });
    } else {
      throw new ApiError(401, 'UNAUTHORIZED', 'Session expired. Please log in again.');
    }
  }

  const data = await response.json();

  if (!response.ok) {
    throw new ApiError(
      response.status,
      data?.error?.code ?? 'UNKNOWN',
      data?.error?.message ?? 'Something went wrong',
      data?.error?.details
    );
  }

  return data as T;
}

export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export { getToken, getRefreshToken, setTokens, clearTokens, API_BASE_URL };
