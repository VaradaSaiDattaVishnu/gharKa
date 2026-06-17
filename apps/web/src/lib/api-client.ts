// NEXT_PUBLIC_* values are inlined at BUILD time. If NEXT_PUBLIC_API_URL is not
// set in the Vercel project, a production build would otherwise bake in
// "http://localhost:3001" and every API call from the deployed site fails
// (looks like "the app doesn't work"). So in production fall back to the real
// Render URL; only local dev falls back to localhost.
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  (process.env.NODE_ENV === "production"
    ? "https://gharka-api.onrender.com"
    : "http://localhost:3001");

interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private getToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("gharka_token");
  }

  private setToken(token: string) {
    localStorage.setItem("gharka_token", token);
  }

  private clearToken() {
    localStorage.removeItem("gharka_token");
    localStorage.removeItem("gharka_refresh");
  }

  private buildUrl(
    path: string,
    params?: Record<string, string | number | boolean | undefined>
  ): string {
    const url = new URL(`${this.baseUrl}${path}`);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          url.searchParams.set(key, String(value));
        }
      });
    }
    return url.toString();
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (response.status === 401) {
      const refreshed = await this.refreshToken();
      if (!refreshed) {
        this.clearToken();
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
        throw new Error("Authentication failed");
      }
      throw new Error("RETRY");
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        error: { message: response.statusText },
      }));
      throw new Error(
        errorData.error?.message || `Request failed: ${response.status}`
      );
    }

    return response.json();
  }

  private async refreshToken(): Promise<boolean> {
    const refreshToken = localStorage.getItem("gharka_refresh");
    if (!refreshToken) return false;

    try {
      const response = await this.fetchWithTimeout(
        `${this.baseUrl}/api/auth/refresh`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refreshToken }),
        }
      );

      if (!response.ok) return false;

      const data = await response.json();
      if (data.data?.accessToken) {
        this.setToken(data.data.accessToken);
        if (data.data.refreshToken) {
          localStorage.setItem("gharka_refresh", data.data.refreshToken);
        }
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }

  private async fetchWithTimeout(
    url: string,
    options: RequestInit,
    timeoutMs = 70000
  ): Promise<Response> {
    // Render's free tier sleeps after ~15 min idle; the first request then
    // waits ~30-60s for a cold start. Allow for that, but never hang forever.
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      return await fetch(url, { ...options, signal: controller.signal });
    } finally {
      clearTimeout(timer);
    }
  }

  private normalizeError(error: unknown): Error {
    if (
      error &&
      typeof error === "object" &&
      "name" in error &&
      (error as { name?: string }).name === "AbortError"
    ) {
      return new Error(
        "The server is taking too long to respond — it may be waking up. Please try again in a moment."
      );
    }
    // fetch() throws a TypeError when the host is unreachable (asleep / offline / CORS).
    if (error instanceof TypeError) {
      return new Error(
        "Couldn't reach the server. It may be waking up — please try again in a moment."
      );
    }
    if (error instanceof Error) return error;
    return new Error("Something went wrong. Please try again.");
  }

  async request<T>(path: string, options: RequestOptions = {}): Promise<T> {
    const { params, ...fetchOptions } = options;
    const url = this.buildUrl(path, params);
    const token = this.getToken();

    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    if (token) {
      (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
    }

    try {
      const response = await this.fetchWithTimeout(url, {
        ...fetchOptions,
        headers,
      });

      return await this.handleResponse<T>(response);
    } catch (error) {
      if (error instanceof Error && error.message === "RETRY") {
        const retryResponse = await this.fetchWithTimeout(url, {
          ...fetchOptions,
          headers: {
            ...headers,
            Authorization: `Bearer ${this.getToken()}`,
          },
        });
        return this.handleResponse<T>(retryResponse);
      }
      throw this.normalizeError(error);
    }
  }

  async get<T>(
    path: string,
    params?: Record<string, string | number | boolean | undefined>
  ): Promise<T> {
    return this.request<T>(path, { method: "GET", params });
  }

  async post<T>(path: string, body?: unknown): Promise<T> {
    return this.request<T>(path, {
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async patch<T>(path: string, body?: unknown): Promise<T> {
    return this.request<T>(path, {
      method: "PATCH",
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async delete<T>(path: string): Promise<T> {
    return this.request<T>(path, { method: "DELETE" });
  }

  async upload<T>(path: string, formData: FormData): Promise<T> {
    const token = this.getToken();
    const headers: Record<string, string> = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    try {
      const response = await this.fetchWithTimeout(
        `${this.baseUrl}${path}`,
        { method: "POST", headers, body: formData },
        120000
      );
      return await this.handleResponse<T>(response);
    } catch (error) {
      throw this.normalizeError(error);
    }
  }

  setAuthTokens(accessToken: string, refreshToken?: string) {
    this.setToken(accessToken);
    if (refreshToken) {
      localStorage.setItem("gharka_refresh", refreshToken);
    }
  }

  logout() {
    this.clearToken();
  }
}

export const api = new ApiClient(API_BASE_URL);
