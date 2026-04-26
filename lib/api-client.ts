interface ApiClientConfig {
  baseUrl: string;
  getAccessToken: () => string | null;
  setAccessToken: (token: string | null) => void;
  getRefreshToken: () => string | null;
  setRefreshToken: (token: string | null) => void;
  onAuthFailure?: () => void;
}

class ApiError extends Error {
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
  private refreshing: Promise<any> | null = null;

  constructor(config: ApiClientConfig) {
    this.config = config;
  }

  private async request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.config.baseUrl}${path}`;
    const token = this.config.getAccessToken();

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>),
    };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch(url, { ...options, headers });

    if (res.status === 401 && this.config.getRefreshToken()) {
      const data = await this.refresh();
      if (data) {
        headers["Authorization"] = `Bearer ${data.access_token}`;
        const retry = await fetch(url, { ...options, headers });
        return retry.json();
      }
    }

    if (!res.ok) {
      let body: any;
      try { body = await res.json(); } catch { body = {}; }
      throw new ApiError(res.status, body?.error?.code || "UNKNOWN", body?.error?.message || res.statusText);
    }

    return res.json();
  }

  private async refresh() {
    if (this.refreshing) return this.refreshing;
    const rt = this.config.getRefreshToken();
    if (!rt) return null;
    this.refreshing = fetch(`${this.config.baseUrl}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: rt }),
    }).then(r => r.json()).then((data: any) => {
      this.config.setAccessToken(data.access_token);
      this.config.setRefreshToken(data.refresh_token);
      this.refreshing = null;
      return data;
    }).catch(() => {
      this.config.setAccessToken(null);
      this.config.setRefreshToken(null);
      this.config.onAuthFailure?.();
      this.refreshing = null;
      return null;
    });
    return this.refreshing;
  }

  async get<T>(path: string) { return this.request<T>(path); }
  async post<T>(path: string, body: any) { return this.request<T>(path, { method: "POST", body: JSON.stringify(body) }); }
  async put<T>(path: string, body: any) { return this.request<T>(path, { method: "PUT", body: JSON.stringify(body) }); }
  async delete<T>(path: string) { return this.request<T>(path, { method: "DELETE" }); }

  get auth() {
    return {
      login: (data: { email: string; password: string }) =>
        this.post<any>("/auth/login", data),
      register: (data: { email: string; password: string; first_name: string; last_name: string }) =>
        this.post<any>("/auth/register", data),
      me: () => this.get<any>("/auth/me").then((r: any) => r.data || r),
      refresh: (token: string) => this.post<any>("/auth/refresh", { refresh_token: token }),
      logout: (token: string) => this.post<any>("/auth/logout", { refresh_token: token }),
      verifyEmail: (token: string) => this.post<any>("/auth/verify-email", { token }),
      forgotPassword: (email: string) => this.post<any>("/auth/forgot-password", { email }),
      resetPassword: (token: string, password: string) => this.post<any>("/auth/reset-password", { token, password }),
    };
  }
}

export function createApiClient(config: ApiClientConfig) {
  return new ApiClient(config);
}
