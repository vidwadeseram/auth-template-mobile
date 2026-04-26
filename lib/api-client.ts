interface ApiClientConfig {
  baseUrl: string;
  getAccessToken: () => string | null;
  setAccessToken: (token: string | null) => void;
  getRefreshToken: () => string | null;
  setRefreshToken: (token: string | null) => void;
  onAuthFailure?: () => void;
}

export class ApiError extends Error {
  status: number;
  code: string;
  constructor(status: number, code: string, message: string) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

export class ApiClient {
  private config: ApiClientConfig;
  private refreshInFlight: Promise<string | null> | null = null;

  constructor(config: ApiClientConfig) {
    this.config = config;
  }

  private async request<T>(method: string, path: string, body?: unknown, opts?: { skipAuth?: boolean; rawResponse?: boolean }): Promise<T> {
    const url = `${this.config.baseUrl}${path}`;
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (!opts?.skipAuth) {
      const token = this.config.getAccessToken();
      if (token) headers["Authorization"] = `Bearer ${token}`;
    }

    const fetchOpts: RequestInit = { method, headers };
    if (body !== undefined) fetchOpts.body = JSON.stringify(body);

    const res = await fetch(url, fetchOpts);

    if (res.status === 401 && !opts?.skipAuth) {
      const newToken = await this.refresh();
      if (newToken) {
        headers["Authorization"] = `Bearer ${newToken}`;
        const retry = await fetch(url, { method, headers, body: body !== undefined ? JSON.stringify(body) : undefined });
        return this.handleResponse<T>(retry, opts?.rawResponse);
      }
    }

    return this.handleResponse<T>(res, opts?.rawResponse);
  }

  private async handleResponse<T>(res: Response, raw?: boolean): Promise<T> {
    const text = await res.text();
    if (!text) {
      if (!res.ok) throw new ApiError(res.status, "UNKNOWN", `HTTP ${res.status}`);
      return undefined as T;
    }
    let json: any;
    try { json = JSON.parse(text); } catch { throw new ApiError(res.status, "PARSE_ERROR", text); }
    if (!res.ok) {
      const err = json?.error;
      throw new ApiError(res.status, err?.code || "UNKNOWN", err?.message || `HTTP ${res.status}`);
    }
    if (raw) return json as T;
    return (json?.data ?? json) as T;
  }

  private async refresh(): Promise<string | null> {
    if (this.refreshInFlight) return this.refreshInFlight;

    const rt = this.config.getRefreshToken();
    if (!rt) {
      this.config.onAuthFailure?.();
      return null;
    }

    this.refreshInFlight = (async () => {
      try {
        const res = await fetch(`${this.config.baseUrl}/api/v1/auth/refresh`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refresh_token: rt }),
        });
        const json = await res.json();
        if (!res.ok || !json?.data) {
          this.config.setAccessToken(null);
          this.config.setRefreshToken(null);
          this.config.onAuthFailure?.();
          return null;
        }
        this.config.setAccessToken(json.data.access_token);
        this.config.setRefreshToken(json.data.refresh_token);
        return json.data.access_token as string;
      } catch (err) {
        console.warn("Token refresh failed:", err);
        this.config.onAuthFailure?.();
        return null;
      } finally {
        this.refreshInFlight = null;
      }
    })();

    return this.refreshInFlight;
  }

  get<T = any>(path: string) { return this.request<T>("GET", path, undefined, { rawResponse: true }); }
  post<T = any>(path: string, body?: unknown) { return this.request<T>("POST", path, body, { rawResponse: true }); }
  put<T = any>(path: string, body?: unknown) { return this.request<T>("PUT", path, body, { rawResponse: true }); }
  patch<T = any>(path: string, body?: unknown) { return this.request<T>("PATCH", path, body, { rawResponse: true }); }
  delete<T = any>(path: string, body?: unknown) { return this.request<T>("DELETE", path, body, { rawResponse: true }); }

  get auth() {
    return {
      register: (data: { email: string; password: string; first_name: string; last_name: string }) =>
        this.request<any>("POST", "/api/v1/auth/register", data, { skipAuth: true }),
      login: (data: { email: string; password: string }) =>
        this.request<any>("POST", "/api/v1/auth/login", data, { skipAuth: true }),
      logout: (refreshToken: string) =>
        this.request<any>("POST", "/api/v1/auth/logout", { refresh_token: refreshToken }),
      refresh: (refreshToken: string) =>
        this.request<any>("POST", "/api/v1/auth/refresh", { refresh_token: refreshToken }, { skipAuth: true }),
      me: () => this.request<any>("GET", "/api/v1/auth/me"),
      verifyEmail: (token: string) =>
        this.request<any>("POST", "/api/v1/auth/verify-email", { token }, { skipAuth: true }),
      forgotPassword: (email: string) =>
        this.request<any>("POST", "/api/v1/auth/forgot-password", { email }, { skipAuth: true }),
      resetPassword: (token: string, newPassword: string) =>
        this.request<any>("POST", "/api/v1/auth/reset-password", { token, new_password: newPassword }, { skipAuth: true }),
    };
  }
}

export function createApiClient(config: ApiClientConfig) {
  return new ApiClient(config);
}
