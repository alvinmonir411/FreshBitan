import type { Metadata } from "next";
import { ReviewCard } from "@/components/cards/review-card";
import { ReviewSubmissionForm } from "@/components/forms/review-submission-form";
import { EmptyState } from "@/components/ui/empty-state";
import { SectionHeading } from "@/components/ui/section-heading";
import { getPublicProducts, getPublicReviews } from "@/lib/api";
import { getDictionary } from "@/lib/locale-data";
import { getSiteLocale } from "@/lib/locale-server";
import { buildPublicMetadata } from "@/lib/metadata";
import { getSiteContent } from "@/lib/site-content";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getSiteLocale();
  const t = getDictionary(locale);

  return buildPublicMetadata({
    title: t.reviewsPage.metaTitle,
    description: t.reviewsPage.metaDescription,
    path: "/reviews",
    keywords:
      locale === "en"
        ? ["customer reviews", "FreshBitan reviews", "mango buyer feedback"]
        : ["গ্রাহক রিভিউ", "ফ্রেশবিটান রিভিউ", "আম ক্রেতার মতামত"],
  });
}

export default async function ReviewsPage() {
  const locale = await getSiteLocale();
  const t = getDictionary(locale);
  const [siteContent, reviews, products] = await Promise.all([
    getSiteContent(locale),
    getPublicReviews(),
    getPublicProducts(),
  ]);

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-12 px-6 py-10 sm:px-8 lg:px-10">
      <section className="rounded-[2.2rem] border border-border bg-card p-8 sm:p-10">
        <SectionHeading
          eyebrow={t.reviewsPage.heroEyebrow}
          title={t.reviewsPage.heroTitle}
          description={`${siteContent.deliveryPromise}. Published reviews help new visitors build trust before they order.`}
        />
      </section>

      <section className="space-y-8">
        <SectionHeading
          eyebrow={t.reviewsPage.listEyebrow}
          title={t.reviewsPage.listTitle}
          description={t.reviewsPage.listDescription}
        />
        {reviews.length > 0 ? (
          <div className="grid gap-6 lg:grid-cols-3">
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        ) : (
            <EmptyState
              title={t.reviewsPage.emptyTitle}
              description={t.reviewsPage.emptyDescription}
              actionHref="/contact"
              actionLabel={t.reviewsPage.emptyAction}
            />
          )}
      </section>

      {products.length > 0 ? (
        <section className="grid gap-8 rounded-[2.2rem] border border-border bg-card p-8 sm:p-10 lg:grid-cols-[0.9fr_1.1fr]">
          <SectionHeading
            eyebrow={t.reviewsPage.submitEyebrow}
            title={t.reviewsPage.submitTitle}
            description={t.reviewsPage.submitDescription}
          />
          <ReviewSubmissionForm products={products} />
        </section>
      ) : null}
    </main>
  );
}
