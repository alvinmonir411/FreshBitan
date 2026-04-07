"use client";

type RequestMethod = "GET" | "POST" | "PATCH" | "PUT" | "DELETE";

interface AdminRequestOptions {
  method?: RequestMethod;
  body?: unknown;
  searchParams?: Record<string, string | number | boolean | undefined>;
}

export class AdminApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = "AdminApiError";
  }
}

const buildUrl = (
  path: string,
  searchParams?: Record<string, string | number | boolean | undefined>,
) => {
  const url = new URL(path, window.location.origin);

  if (searchParams) {
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value === undefined || value === "") {
        return;
      }

      url.searchParams.set(key, String(value));
    });
  }

  return url.toString();
};

export const adminRequest = async <T>(
  path: string,
  { method = "GET", body, searchParams }: AdminRequestOptions = {},
) => {
  const isFormData =
    typeof FormData !== "undefined" && body instanceof FormData;

  const response = await fetch(buildUrl(path, searchParams), {
    method,
    credentials: "same-origin",
    headers:
      body && !isFormData
        ? { "Content-Type": "application/json" }
        : undefined,
    body:
      body === undefined
        ? undefined
        : isFormData
          ? (body as FormData)
          : JSON.stringify(body),
    cache: "no-store",
  });

  if (!response.ok) {
    let message = "Request failed.";

    try {
      const payload = (await response.json()) as { message?: string | string[] };

      if (Array.isArray(payload.message)) {
        message = payload.message.join(", ");
      } else if (payload.message) {
        message = payload.message;
      }
    } catch {
      message = response.statusText || message;
    }

    throw new AdminApiError(message, response.status);
  }

  if (response.status === 204) {
    return null as T;
  }

  return (await response.json()) as T;
};

export const slugify = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export const isValidUrl = (value: string) => {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
};
