import type { Metadata } from "next";
import Link from "next/link";
import { ProductCard } from "@/components/cards/product-card";
import { buttonVariants } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { SectionHeading } from "@/components/ui/section-heading";
import { getPublicCategories, getPublicProducts } from "@/lib/api";
import { getDictionary } from "@/lib/locale-data";
import { getSiteLocale } from "@/lib/locale-server";
import { buildPublicMetadata } from "@/lib/metadata";
import { getSiteContent } from "@/lib/site-content";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getSiteLocale();
  const t = getDictionary(locale);

  return buildPublicMetadata({
    title: t.productsPage.metaTitle,
    description: t.productsPage.metaDescription,
    path: "/products",
    keywords:
      locale === "en"
        ? ["fresh mangoes", "mango varieties", "featured mangoes", "order mango online"]
        : ["তাজা আম", "আমের ধরন", "featured আম", "অনলাইনে আম অর্ডার"],
  });
}

interface ProductsPageProps {
  searchParams: Promise<{
    category?: string;
    featured?: string;
  }>;
}

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  const locale = await getSiteLocale();
  const t = getDictionary(locale);
  const resolvedSearchParams = await searchParams;
  const categorySlug = resolvedSearchParams.category;
  const featured =
    resolvedSearchParams.featured === "true"
      ? true
      : resolvedSearchParams.featured === "false"
        ? false
        : undefined;

  const [siteContent, categories, products] = await Promise.all([
    getSiteContent(locale),
    getPublicCategories(),
    getPublicProducts({ categorySlug, featured }),
  ]);

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-6 py-10 sm:px-8 lg:px-10">
      <section className="rounded-[2.2rem] border border-border bg-card p-8 sm:p-10">
        <SectionHeading
          eyebrow={t.productsPage.eyebrow}
          title={t.productsPage.title}
          description={`${siteContent.deliveryPromise}. ${locale === "en" ? "Filter by category or explore featured varieties below." : "Category অনুযায়ী filter করুন বা নিচে featured variety দেখুন।"}`}
        />
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/products"
            className={buttonVariants({
              variant: !categorySlug && featured === undefined ? "primary" : "outline",
              size: "sm",
            })}
          >
            {t.common.all}
          </Link>
          <Link
            href="/products?featured=true"
            className={buttonVariants({
              variant: featured === true ? "secondary" : "outline",
              size: "sm",
            })}
          >
            {t.common.featured}
          </Link>
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/products?category=${category.slug}`}
              className={buttonVariants({
                variant: categorySlug === category.slug ? "primary" : "outline",
                size: "sm",
              })}
            >
              {category.name}
            </Link>
          ))}
        </div>
      </section>

      {products.length > 0 ? (
        <section className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </section>
      ) : (
        <EmptyState
          title={t.productsPage.emptyTitle}
          description={t.productsPage.emptyDescription}
          actionHref="/contact"
          actionLabel={t.productsPage.emptyAction}
        />
      )}
    </main>
  );
}
