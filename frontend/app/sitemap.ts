import type { MetadataRoute } from "next";
import { getPublicProducts } from "@/lib/api";
import { publicEnv } from "@/lib/env";

const siteUrl = publicEnv.siteUrl.replace(/\/+$/, "");

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries: MetadataRoute.Sitemap = [
    { url: `${siteUrl}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/about`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${siteUrl}/products`, changeFrequency: "daily", priority: 0.9 },
    { url: `${siteUrl}/reviews`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${siteUrl}/contact`, changeFrequency: "monthly", priority: 0.7 },
  ];

  const products = await getPublicProducts();

  const productEntries: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${siteUrl}/products/${product.slug}`,
    lastModified: product.updatedAt,
    changeFrequency: "weekly",
    priority: product.isFeatured ? 0.9 : 0.8,
  }));

  return [...staticEntries, ...productEntries];
}
