import type { Metadata } from "next";
import { ReviewCard } from "@/components/cards/review-card";
import { ReviewSubmissionForm } from "@/components/forms/review-submission-form";
import { EmptyState } from "@/components/ui/empty-state";
import { SectionHeading } from "@/components/ui/section-heading";
import { getPublicProducts, getPublicReviews } from "@/lib/api";
import { getSiteContent } from "@/lib/site-content";

export const metadata: Metadata = {
  title: "Reviews",
  description:
    "Read customer feedback about FreshBitan mangoes and submit your own review.",
};

export default async function ReviewsPage() {
  const [siteContent, reviews, products] = await Promise.all([
    getSiteContent(),
    getPublicReviews(),
    getPublicProducts(),
  ]);

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-12 px-6 py-10 sm:px-8 lg:px-10">
      <section className="rounded-[2.2rem] border border-border bg-card p-8 sm:p-10">
        <SectionHeading
          eyebrow="Customer Voice"
          title="Real review moments from FreshBitan deliveries"
          description={`${siteContent.deliveryPromise}. Published reviews help new visitors build trust before they order.`}
        />
      </section>

      <section className="space-y-8">
        <SectionHeading
          eyebrow="Published Reviews"
          title="Trusted feedback from customers"
          description="The list below is powered by the backend reviews API."
        />
        {reviews.length > 0 ? (
          <div className="grid gap-6 lg:grid-cols-3">
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No public reviews yet"
            description="Once reviews are approved by the team, they will appear here automatically."
            actionHref="/contact"
            actionLabel="Contact FreshBitan"
          />
        )}
      </section>

      {products.length > 0 ? (
        <section className="grid gap-8 rounded-[2.2rem] border border-border bg-card p-8 sm:p-10 lg:grid-cols-[0.9fr_1.1fr]">
          <SectionHeading
            eyebrow="Submit Review"
            title="Share your experience after delivery"
            description="Visitors can submit reviews directly from the public site. Reviews stay unpublished until approved."
          />
          <ReviewSubmissionForm products={products} />
        </section>
      ) : null}
    </main>
  );
}
