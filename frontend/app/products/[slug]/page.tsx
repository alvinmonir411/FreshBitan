/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/cards/product-card";
import { ProductPurchasePanel } from "@/components/cart/product-purchase-panel";
import { ReviewCard } from "@/components/cards/review-card";
import { EmptyState } from "@/components/ui/empty-state";
import { SectionHeading } from "@/components/ui/section-heading";
import { getPublicProductBySlug, getPublicProducts } from "@/lib/api";
import { getDictionary } from "@/lib/locale-data";
import { getSiteLocale } from "@/lib/locale-server";
import { buildProductMetadata } from "@/lib/metadata";
import { getSiteContent } from "@/lib/site-content";
import {
  formatCurrency,
  getCompactOptionLabel,
  getDefaultProductOption,
  getDisplayPrice,
  getExpandedOptionDetails,
  getPrimaryProductImage,
} from "@/lib/utils";

interface ProductDetailsPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: ProductDetailsPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const locale = await getSiteLocale();
  const product = await getPublicProductBySlug(resolvedParams.slug);

  if (!product) {
    return {
      title: locale === "en" ? "Product Not Found" : "পণ্য পাওয়া যায়নি",
    };
  }

  const primaryImage = getPrimaryProductImage(product);
  const fallbackDescription =
    locale === "en"
      ? `${product.name} from FreshBitan with delivery support across Bangladesh.`
      : `বাংলাদেশজুড়ে ডেলিভারি সহ ${product.name} এখন FreshBitan-এ।`;

  return buildProductMetadata({
    title: product.name,
    description:
      product.shortDescription ||
      product.description ||
      fallbackDescription,
    slug: product.slug,
    imageUrl: primaryImage?.imageUrl,
    keywords: [
      product.name,
      product.category?.name ?? "",
      locale === "en" ? "FreshBitan mango" : "ফ্রেশবিটান আম",
    ].filter(Boolean),
  });
}

export default async function ProductDetailsPage({
  params,
}: ProductDetailsPageProps) {
  const resolvedParams = await params;
  const locale = await getSiteLocale();
  const t = getDictionary(locale);
  const [siteContent, product] = await Promise.all([
    getSiteContent(locale),
    getPublicProductBySlug(resolvedParams.slug),
  ]);

  if (!product) {
    notFound();
  }

  const primaryImage = getPrimaryProductImage(product);
  const defaultOption = getDefaultProductOption(product);
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
              {product.category?.name || (locale === "en" ? "Premium Mango" : "প্রিমিয়াম আম")}
            </span>
            {product.isFeatured ? (
              <span className="rounded-full bg-brand px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white">
                {locale === "en" ? "Featured" : "ফিচার্ড"}
              </span>
            ) : null}
          </div>
          <h1 className="mt-6 font-display text-4xl text-brand-deep sm:text-5xl">
            {product.name}
          </h1>
          <p className="mt-4 text-base leading-8 text-muted">
            {product.description ||
              product.shortDescription ||
              (locale === "en"
                ? "FreshBitan premium mango collection with orchard-to-home delivery support."
                : "FreshBitan-এর প্রিমিয়াম আমের সংগ্রহ, orchard-to-home ডেলিভারি সহায়তাসহ।")}
          </p>

          <div className="mt-6 flex items-end gap-3">
            <span className="text-3xl font-bold text-foreground">
              {formatCurrency(getDisplayPrice(product))}
            </span>
            {defaultOption?.discountedPrice ? (
              <span className="pb-1 text-base text-muted line-through">
                {formatCurrency(defaultOption.price)}
              </span>
            ) : null}
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-[1.4rem] border border-border bg-white/80 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                {locale === "en" ? "Default pack" : "ডিফল্ট প্যাক"}
              </p>
              <p className="mt-3 text-lg font-semibold text-brand-deep">
                {defaultOption ? getCompactOptionLabel(defaultOption.label) : product.unit}
              </p>
              {defaultOption?.label ? (
                <p className="mt-2 text-sm leading-6 text-muted">
                  {getExpandedOptionDetails(defaultOption.label)}
                </p>
              ) : null}
            </div>
            <div className="rounded-[1.4rem] border border-border bg-white/80 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                {t.common.origin}
              </p>
              <p className="mt-3 text-lg font-semibold text-brand-deep">
                {product.origin || (locale === "en" ? "Bangladesh orchard network" : "বাংলাদেশের orchard network")}
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
          eyebrow={locale === "en" ? "Customer Reviews" : "গ্রাহকের রিভিউ"}
          title={locale === "en" ? `What buyers say about ${product.name}` : `${product.name} সম্পর্কে ক্রেতার মতামত`}
          description={locale === "en" ? "Approved reviews for this product are shown here." : "এই পণ্যের অনুমোদিত রিভিউ এখানে দেখানো হয়েছে।"}
        />
        {product.reviews.length > 0 ? (
          <div className="grid gap-6 lg:grid-cols-3">
            {product.reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        ) : (
          <EmptyState
            title={locale === "en" ? "No published reviews yet" : "এখনো কোনো published review নেই"}
            description={locale === "en" ? "Be the first customer to leave a review after your FreshBitan delivery." : "FreshBitan ডেলিভারির পর প্রথম রিভিউদাতা হোন।"}
            actionHref="/reviews"
            actionLabel={locale === "en" ? "Visit reviews page" : "রিভিউ পেজ দেখুন"}
          />
        )}
      </section>

      {relatedProducts.length > 0 ? (
        <section className="space-y-8">
          <SectionHeading
            eyebrow={locale === "en" ? "Related Picks" : "সম্পর্কিত পছন্দ"}
            title={locale === "en" ? "More seasonal options you may like" : "আপনার পছন্দ হতে পারে এমন আরও মৌসুমি পছন্দ"}
            description={locale === "en" ? "Explore other mango picks from the same category." : "একই ক্যাটাগরির অন্য আম দেখুন।"}
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
