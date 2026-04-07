import {
  Category,
  CreateOrderPayload,
  CreateReviewPayload,
  HealthResponse,
  Order,
  Product,
  Review,
  SiteSetting,
} from "@/types/api";
import { publicEnv } from "@/lib/env";

const baseUrl = `${publicEnv.apiUrl.replace(/\/+$/, "")}/`;

class ApiRequestError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = "ApiRequestError";
  }
}

type Primitive = string | number | boolean;

interface ApiRequestOptions {
  method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  body?: unknown;
  searchParams?: Record<string, Primitive | undefined>;
  cache?: RequestCache;
  next?: {
    revalidate?: number;
    tags?: string[];
  };
}

const buildUrl = (
  path: string,
  searchParams?: Record<string, Primitive | undefined>,
) => {
  const url = new URL(path.replace(/^\/+/, ""), baseUrl);

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

const requestJson = async <T>(
  path: string,
  {
    method = "GET",
    body,
    searchParams,
    cache,
    next,
  }: ApiRequestOptions = {},
) => {
  const response = await fetch(buildUrl(path, searchParams), {
    method,
    cache: cache ?? (method === "GET" ? undefined : "no-store"),
    next: next ?? (method === "GET" ? { revalidate: 300 } : undefined),
    headers: body
      ? {
          "Content-Type": "application/json",
        }
      : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    let errorMessage = "Request failed.";

    try {
      const errorData = (await response.json()) as {
        message?: string | string[];
      };

      if (Array.isArray(errorData.message)) {
        errorMessage = errorData.message.join(", ");
      } else if (errorData.message) {
        errorMessage = errorData.message;
      }
    } catch {
      errorMessage = response.statusText || errorMessage;
    }

    throw new ApiRequestError(errorMessage, response.status);
  }

  return (await response.json()) as T;
};

const safeRequest = async <T>(request: Promise<T>, fallback: T) => {
  try {
    return await request;
  } catch {
    return fallback;
  }
};

export const apiRoutes = {
  health: "health",
  categoriesPublic: "categories/public",
  productsPublic: "products/public",
  productPublicBySlug: (slug: string) => `products/public/${slug}`,
  reviewsPublic: "reviews/public",
  settingsPublic: "settings/public",
  ordersPublic: "orders/public",
} as const;

export const getHealth = () =>
  safeRequest(requestJson<HealthResponse>(apiRoutes.health), null);

export const getPublicSettings = () =>
  safeRequest(requestJson<SiteSetting[]>(apiRoutes.settingsPublic), []);

export const getPublicCategories = () =>
  safeRequest(requestJson<Category[]>(apiRoutes.categoriesPublic), []);

export const getPublicProducts = (filters?: {
  categorySlug?: string;
  featured?: boolean;
}) =>
  safeRequest(
    requestJson<Product[]>(apiRoutes.productsPublic, {
      searchParams: {
        categorySlug: filters?.categorySlug,
        featured: filters?.featured,
      },
    }),
    [],
  );

export const getPublicProductBySlug = async (slug: string) => {
  try {
    return await requestJson<Product>(apiRoutes.productPublicBySlug(slug));
  } catch (error) {
    if (error instanceof ApiRequestError && error.status === 404) {
      return null;
    }

    return null;
  }
};

export const getPublicReviews = () =>
  safeRequest(requestJson<Review[]>(apiRoutes.reviewsPublic), []);

export const createPublicReview = (payload: CreateReviewPayload) =>
  requestJson<Review>(apiRoutes.reviewsPublic, {
    method: "POST",
    body: payload,
    cache: "no-store",
  });

export const createPublicOrder = (payload: CreateOrderPayload) =>
  requestJson<Order>(apiRoutes.ordersPublic, {
    method: "POST",
    body: payload,
    cache: "no-store",
  });
