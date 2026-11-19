import type { ApiError, ApiErrorData } from "~/types/api";

import { useStorage } from "~/composables/use-storage";
import { API_ENDPOINTS } from "~/config/constants";
import { useAuthStore } from "~/stores/auth";
import { isApiError } from "~/utils/error";

export type { ApiError } from "~/types/api";

function createApiError(
  message: string,
  status: number,
  statusText: string,
  data?: ApiErrorData,
): ApiError {
  const err = new Error(message) as ApiError;
  err.name = "ApiError";
  err.status = status;
  err.statusText = statusText;
  err.data = data;
  return err;
}

type HttpClientConfig = {
  baseURL: string;
  timeout?: number;
  storage: ReturnType<typeof useStorage>;
};

type ApiRequestOptions = RequestInit & {
  timeoutMs?: number;
};

function createHttpClient(config: HttpClientConfig) {
  const { baseURL, storage } = config;
  const timeout = config.timeout ?? 100000;
  let refreshInFlight: Promise<boolean> | null = null;

  async function refreshAccessToken(): Promise<boolean> {
    const refreshToken = storage.getRefreshToken();
    if (!refreshToken)
      return false;

    if (!refreshInFlight) {
      refreshInFlight = (async () => {
        try {
          const response = await fetch(`${baseURL}${API_ENDPOINTS.AUTH.REFRESH}`, {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refreshToken }),
          });
          if (!response.ok)
            return false;

          const result = await response.json();
          const payload = result?.data ?? result;
          if (!payload?.accessToken)
            return false;

          storage.setTokens(
            payload.accessToken,
            payload.refreshToken || refreshToken,
            storage.isRemembered(),
          );
          return true;
        }
        catch {
          return false;
        }
        finally {
          refreshInFlight = null;
        }
      })();
    }

    return refreshInFlight;
  }

  function getAccessToken(): string | null {
    return storage.getAccessToken();
  }

  async function request<T>(
    endpoint: string,
    options: ApiRequestOptions = {},
    hasRetried = false,
  ): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(
      () => controller.abort(),
      options.timeoutMs ?? timeout,
    );

    try {
      const accessToken = getAccessToken();
      const isFormData = options.body instanceof FormData;
      const headers: Record<string, string> = {
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
        ...(options.headers as Record<string, string>),
      };

      if (accessToken) {
        headers.Authorization = `Bearer ${accessToken}`;
      }

      const response = await fetch(`${baseURL}${endpoint}`, {
        ...options,
        credentials: options.credentials ?? "include",
        signal: controller.signal,
        headers,
      });

      clearTimeout(timeoutId);

      if (
        response.status === 401
        && !hasRetried
        && endpoint !== API_ENDPOINTS.AUTH.LOGIN
        && endpoint !== API_ENDPOINTS.AUTH.REFRESH
        && endpoint !== API_ENDPOINTS.AUTH.LOGOUT
        && await refreshAccessToken()
      ) {
        return request<T>(endpoint, options, true);
      }

      if (!response.ok) {
        let errorData: ApiErrorData = {};
        try {
          errorData = await response.json();
        }
        catch {
          errorData = { message: response.statusText };
        }
        throw createApiError(
          errorData.message || `HTTP ${response.status}: ${response.statusText}`,
          response.status,
          response.statusText,
          errorData,
        );
      }

      return response.json();
    }
    catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error && error.name === "AbortError") {
        throw new Error("Request timeout");
      }
      if (isApiError(error)) {
        if (error.status === 401) {
          useAuthStore().setUnAuthorizedError(true);
        }
        const errorCode = (error.data?.code || "").toLowerCase();
        if (
          errorCode.includes("EMAIL_NOT_VERIFIED")
        ) {
          useAuthStore().setEmailVerificationRequired(true);
        }
      }
      throw error;
    }
  }

  return {
    get<T>(endpoint: string, headers?: Record<string, string>): Promise<T> {
      return request<T>(endpoint, { method: "GET", headers });
    },
    post<T>(
      endpoint: string,
      data: any,
      headers?: Record<string, string>,
      timeoutMs?: number,
    ): Promise<T> {
      const body = data instanceof FormData ? data : JSON.stringify(data);
      return request<T>(endpoint, {
        method: "POST",
        body,
        headers,
        timeoutMs,
      });
    },
    put<T>(
      endpoint: string,
      data: any,
      headers?: Record<string, string>,
    ): Promise<T> {
      const body = data instanceof FormData ? data : JSON.stringify(data);
      return request<T>(endpoint, {
        method: "PUT",
        body,
        headers,
      });
    },
    delete<T>(endpoint: string, headers?: Record<string, string>): Promise<T> {
      return request<T>(endpoint, { method: "DELETE", headers });
    },
    patch<T>(
      endpoint: string,
      data?: any,
      headers?: Record<string, string>,
    ): Promise<T> {
      const body = data instanceof FormData ? data : JSON.stringify(data);
      return request<T>(endpoint, {
        method: "PATCH",
        body,
        headers,
      });
    },
  };
}

export function useApi() {
  const config = useRuntimeConfig();
  const storage = useStorage();

  return createHttpClient({
    baseURL: config.public.apiBase,
    timeout: Number.parseInt(config.public.apiTimeout),
    storage,
  });
}

export const getHttp = () => useApi();
