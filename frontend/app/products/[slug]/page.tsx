/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/cards/product-card";
import { ProductPurchasePanel } from "@/components/cart/product-purchase-panel";
import { ReviewCard } from "@/components/cards/review-card";
import { EmptyState } from "@/components/ui/empty-state";
import { SectionHeading } from "@/components/ui/section-heading";
import { getPublicProductBySlug, getPublicProducts } from "@/lib/api";
import { getSiteContent } from "@/lib/site-content";
import { formatCurrency, getDisplayPrice, getPrimaryProductImage } from "@/lib/utils";

interface ProductDetailsPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: ProductDetailsPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const product = await getPublicProductBySlug(resolvedParams.slug);

  if (!product) {
    return {
      title: "Product Not Found",
    };
  }

  return {
    title: product.name,
    description:
      product.shortDescription ||
      product.description ||
      `${product.name} from FreshBitan`,
  };
}

export default async function ProductDetailsPage({
  params,
}: ProductDetailsPageProps) {
  const resolvedParams = await params;
  const [siteContent, product] = await Promise.all([
    getSiteContent(),
    getPublicProductBySlug(resolvedParams.slug),
  ]);

  if (!product) {
    notFound();
  }

  const primaryImage = getPrimaryProductImage(product);
  const relatedProducts = product.category?.slug
    ? (await getPublicProducts({ categorySlug: product.category.slug }))
        .filter((candidate) => candidate.id !== product.id)
        .slice(0, 3)
    : [];

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-12 px-6 py-10 sm:px-8 lg:px-10">
      <section className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-4">
          <div className="overflow-hidden rounded-[2rem] border border-border bg-card shadow-[0_24px_70px_rgba(142,79,18,0.12)]">
            {primaryImage ? (
              <img
                src={primaryImage.imageUrl}
                alt={primaryImage.altText || product.name}
                className="aspect-[4/3] w-full object-cover"
              />
            ) : (
              <div className="flex aspect-[4/3] w-full items-end bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.8),transparent_30%),linear-gradient(135deg,#ffe5ba,#f3ab4d)] p-6">
                <span className="rounded-full bg-white/80 px-4 py-2 text-sm font-semibold text-brand-deep">
                  FreshBitan
                </span>
              </div>
            )}
          </div>
          {product.images.length > 1 ? (
            <div className="grid grid-cols-3 gap-4 sm:grid-cols-4">
              {product.images.map((image) => (
                <div
                  key={image.id}
                  className="overflow-hidden rounded-[1.35rem] border border-border bg-card"
                >
                  <img
                    src={image.imageUrl}
                    alt={image.altText || product.name}
                    className="aspect-square w-full object-cover"
                  />
                </div>
              ))}
            </div>
          ) : null}
        </div>

        <div className="rounded-[2.2rem] border border-border bg-card p-8 sm:p-10">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-brand-deep">
              {product.category?.name || "Seasonal Fruit"}
            </span>
            {product.isFeatured ? (
              <span className="rounded-full bg-brand px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white">
                Featured
              </span>
            ) : null}
          </div>
          <h1 className="mt-6 font-display text-4xl text-brand-deep sm:text-5xl">
            {product.name}
          </h1>
          <p className="mt-4 text-base leading-8 text-muted">
            {product.description ||
              product.shortDescription ||
              "FreshBitan seasonal fruit collection with premium delivery support."}
          </p>

          <div className="mt-6 flex items-end gap-3">
            <span className="text-3xl font-bold text-foreground">
              {formatCurrency(getDisplayPrice(product))}
            </span>
            {product.discountedPrice ? (
              <span className="pb-1 text-base text-muted line-through">
                {formatCurrency(product.price)}
              </span>
            ) : null}
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-[1.4rem] border border-border bg-white/80 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                Unit
              </p>
              <p className="mt-3 text-lg font-semibold text-brand-deep">{product.unit}</p>
            </div>
            <div className="rounded-[1.4rem] border border-border bg-white/80 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                Origin
              </p>
              <p className="mt-3 text-lg font-semibold text-brand-deep">
                {product.origin || "Bangladesh orchard network"}
              </p>
            </div>
          </div>

          <ProductPurchasePanel
            product={product}
            whatsappNumber={siteContent.whatsappNumber}
            whatsappMessage={siteContent.whatsappMessage}
          />
        </div>
      </section>

      <section className="space-y-8">
        <SectionHeading
          eyebrow="Customer Reviews"
          title={`What buyers say about ${product.name}`}
          description="Approved reviews for this product are shown here."
        />
        {product.reviews.length > 0 ? (
          <div className="grid gap-6 lg:grid-cols-3">
            {product.reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No published reviews yet"
            description="Be the first customer to leave a review after your FreshBitan delivery."
            actionHref="/reviews"
            actionLabel="Visit reviews page"
          />
        )}
      </section>

      {relatedProducts.length > 0 ? (
        <section className="space-y-8">
          <SectionHeading
            eyebrow="Related Picks"
            title="More seasonal options you may like"
            description="Explore other fruits from the same category."
          />
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {relatedProducts.map((relatedProduct) => (
              <ProductCard key={relatedProduct.id} product={relatedProduct} />
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}
