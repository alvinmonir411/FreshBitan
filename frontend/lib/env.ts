const withFallback = (
  value: string | undefined,
  fallback: string,
  secondaryValue?: string | undefined,
) => value?.trim() || secondaryValue?.trim() || fallback;

export const publicEnv = {
  brandName: withFallback(process.env.NEXT_PUBLIC_BRAND_NAME, "FreshBitan"),
  siteTagline: withFallback(
    process.env.NEXT_PUBLIC_SITE_TAGLINE,
    "Bangladesh mango ecommerce",
  ),
  apiUrl: withFallback(
    process.env.NEXT_PUBLIC_API_URL,
    "http://localhost:4000/api",
    process.env.NEXT_PUBLIC_API_BASE_URL,
  ),
  siteUrl: withFallback(process.env.NEXT_PUBLIC_SITE_URL, "http://localhost:3000"),
} as const;
