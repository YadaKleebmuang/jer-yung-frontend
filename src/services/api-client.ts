import { type ApiErrorResponse } from "@/types/api";

export class ApiError extends Error {
  status: number;
  details?: ApiErrorResponse;

  constructor(
    message: string,
    status: number,
    details?: ApiErrorResponse,
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

export interface ApiRequestOptions
  extends Omit<RequestInit, "body"> {
  body?: unknown;
}

function getApiBaseUrl() {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!baseUrl) {
    throw new Error(
      "NEXT_PUBLIC_API_URL is not configured.",
    );
  }

  return baseUrl.replace(/\/+$/, "");
}

function buildUrl(path: string) {
  const baseUrl = getApiBaseUrl();
  const normalizedPath = path.startsWith("/")
    ? path
    : `/${path}`;

  return `${baseUrl}${normalizedPath}`;
}

export async function apiRequest<T>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<T> {
  const {
    body,
    headers: initialHeaders,
    ...requestOptions
  } = options;

  const headers = new Headers(initialHeaders);

  let requestBody: BodyInit | undefined;

  if (body instanceof FormData) {
    requestBody = body;
  } else if (body !== undefined && body !== null) {
    headers.set("Content-Type", "application/json");
    requestBody = JSON.stringify(body);
  }

  const response = await fetch(buildUrl(path), {
    ...requestOptions,
    credentials: "include",
    headers,
    body: requestBody,
  });

  const contentType =
    response.headers.get("content-type") ?? "";

  const data: unknown = contentType.includes(
    "application/json",
  )
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const details =
      typeof data === "object" && data !== null
        ? (data as ApiErrorResponse)
        : undefined;

    const message =
      details?.message ??
      details?.error ??
      (typeof data === "string" && data
        ? data
        : `Request failed with status ${response.status}`);

    throw new ApiError(
      message,
      response.status,
      details,
    );
  }

  return data as T;
}

export const apiClient = {
  get<T>(
    path: string,
    options?: ApiRequestOptions,
  ) {
    return apiRequest<T>(path, {
      ...options,
      method: "GET",
    });
  },

  post<T>(
    path: string,
    body?: unknown,
    options?: ApiRequestOptions,
  ) {
    return apiRequest<T>(path, {
      ...options,
      method: "POST",
      body,
    });
  },

  put<T>(
    path: string,
    body?: unknown,
    options?: ApiRequestOptions,
  ) {
    return apiRequest<T>(path, {
      ...options,
      method: "PUT",
      body,
    });
  },

  patch<T>(
    path: string,
    body?: unknown,
    options?: ApiRequestOptions,
  ) {
    return apiRequest<T>(path, {
      ...options,
      method: "PATCH",
      body,
    });
  },

  delete<T>(
    path: string,
    options?: ApiRequestOptions,
  ) {
    return apiRequest<T>(path, {
      ...options,
      method: "DELETE",
    });
  },
};
