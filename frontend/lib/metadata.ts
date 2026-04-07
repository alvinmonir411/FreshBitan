import type { Metadata } from "next";
import { publicEnv } from "@/lib/env";

const normalizeSiteUrl = () => publicEnv.siteUrl.replace(/\/+$/, "");

const toAbsoluteUrl = (path = "/") => {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return new URL(normalizedPath, `${normalizeSiteUrl()}/`).toString();
};

const getMetadataImage = (imageUrl?: string | null) => {
  if (imageUrl && /^https?:\/\//i.test(imageUrl)) {
    return imageUrl;
  }

  return toAbsoluteUrl("/og-default.svg");
};

interface PublicMetadataInput {
  title: string;
  description: string;
  path?: string;
  imageUrl?: string | null;
  keywords?: string[];
}

export const siteMetadataBase = new URL(`${normalizeSiteUrl()}/`);

export const buildPublicMetadata = ({
  title,
  description,
  path = "/",
  imageUrl,
  keywords,
}: PublicMetadataInput): Metadata => {
  const canonicalUrl = toAbsoluteUrl(path);
  const ogImage = getMetadataImage(imageUrl);

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: "website",
      url: canonicalUrl,
      title,
      description,
      siteName: publicEnv.brandName,
      images: [
        {
          url: ogImage,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
};

export const buildProductMetadata = ({
  title,
  description,
  slug,
  imageUrl,
  keywords,
}: PublicMetadataInput & { slug: string }): Metadata => {
  const canonicalUrl = toAbsoluteUrl(`/products/${slug}`);
  const ogImage = getMetadataImage(imageUrl);

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: "article",
      url: canonicalUrl,
      title,
      description,
      siteName: publicEnv.brandName,
      images: [
        {
          url: ogImage,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
};
