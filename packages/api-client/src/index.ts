import { AuthMeResponse } from "@vayva/shared";

// Use relative path to work with Next.js API routes in all environments
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

export interface ApiClientConfig {
  getAccessToken?: () => Promise<string | null>;
}

class ApiClient {
  private config: ApiClientConfig = {};

  configure(config: ApiClientConfig) {
    this.config = { ...this.config, ...config };
  }

  private async request<T>(
    path: string,
    options: RequestInit = {},
  ): Promise<T> {
    const url = `${API_BASE_URL}${path}`;

    const headers = new Headers(options.headers || {});
    headers.set("Content-Type", "application/json");

    // Add Bearer token if provided
    if (this.config.getAccessToken) {
      const token = await this.config.getAccessToken();
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
    }

    // Ensure credentials are sent for httpOnly cookies (Better-Auth)
    options.credentials = "include";
    options.headers = headers;

    const response = await fetch(url, options);

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ error: "Unknown error" }));
      throw new Error(error.error || "Request failed");
    }

    return response.json();
  }

  // Auth
  auth = {
    me: () => this.request<AuthMeResponse>("/auth/merchant/me"),
    logout: () => this.request<any>("/auth/merchant/logout", { method: "POST" }),
  };

  // Onboarding
  onboarding = {
    getState: () => this.request<any>("/onboarding/state"),
    updateState: (data: any) =>
      this.request<any>("/onboarding/state", {
        method: "PATCH",
        body: JSON.stringify(data),
      }),
  };

  // Staff
  staff = {
    list: () => this.request<any[]>("/staff"),
    getInvites: () => this.request<any[]>("/staff/invites"),
    invite: (data: any) =>
      this.request<any>("/staff/invite", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    acceptInvite: (data: any) =>
      this.request<any>("/staff/invites/accept", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    remove: (id: string) =>
      this.request<any>(`/staff/${id}`, { method: "DELETE" }),
  };
}

export const apiClient = new ApiClient();
export type * from "./generated/schema";
