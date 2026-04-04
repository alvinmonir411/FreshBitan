import type { Metadata } from "next";
import Link from "next/link";
import { ProductCard } from "@/components/cards/product-card";
import { buttonVariants } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { SectionHeading } from "@/components/ui/section-heading";
import { getPublicCategories, getPublicProducts } from "@/lib/api";
import { getSiteContent } from "@/lib/site-content";

export const metadata: Metadata = {
  title: "Products",
  description:
    "Browse FreshBitan mangoes and seasonal fruits with mobile-friendly filtering and ordering CTAs.",
};

interface ProductsPageProps {
  searchParams: Promise<{
    category?: string;
    featured?: string;
  }>;
}

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  const resolvedSearchParams = await searchParams;
  const categorySlug = resolvedSearchParams.category;
  const featured =
    resolvedSearchParams.featured === "true"
      ? true
      : resolvedSearchParams.featured === "false"
        ? false
        : undefined;

  const [siteContent, categories, products] = await Promise.all([
    getSiteContent(),
    getPublicCategories(),
    getPublicProducts({ categorySlug, featured }),
  ]);

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-6 py-10 sm:px-8 lg:px-10">
      <section className="rounded-[2.2rem] border border-border bg-card p-8 sm:p-10">
        <SectionHeading
          eyebrow="FreshBitan Products"
          title="Premium mangoes and seasonal fruits ready for inquiry or order"
          description={`${siteContent.deliveryPromise}. Filter by category or explore featured varieties below.`}
        />
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/products"
            className={buttonVariants({
              variant: !categorySlug && featured === undefined ? "primary" : "outline",
              size: "sm",
            })}
          >
            All
          </Link>
          <Link
            href="/products?featured=true"
            className={buttonVariants({
              variant: featured === true ? "secondary" : "outline",
              size: "sm",
            })}
          >
            Featured
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
          title="এই filter-এ এখনো কোনো পণ্য নেই"
          description="Try another category or contact FreshBitan on WhatsApp for the latest seasonal availability."
          actionHref="/contact"
          actionLabel="Contact us"
        />
      )}
    </main>
  );
}
