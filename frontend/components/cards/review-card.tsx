"use client";

import { useDictionary } from "@/components/layout/locale-provider";
import { useSiteLocale } from "@/components/layout/locale-provider";
import { Review } from "@/types/api";
import { formatDate } from "@/lib/utils";

interface ReviewCardProps {
  review: Review;
}

export function ReviewCard({ review }: ReviewCardProps) {
  const t = useDictionary();
  const locale = useSiteLocale();
  return (
    <article className="rounded-[1.5rem] border border-border bg-card p-5 shadow-[0_18px_42px_rgba(142,79,18,0.08)] sm:rounded-[1.75rem]">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex text-brand">
          {Array.from({ length: 5 }).map((_, index) => (
            <span key={index}>{index < review.rating ? "★" : "☆"}</span>
          ))}
        </div>
        <span className="text-xs font-medium uppercase tracking-[0.18em] text-muted">
          {formatDate(review.createdAt)}
        </span>
      </div>

      <p className="mt-4 text-base leading-8 text-foreground">
        {review.comment ||
          (locale === "en"
            ? "FreshBitan delivered dependable support and premium mango quality."
            : "FreshBitan নির্ভরযোগ্য সহায়তা ও প্রিমিয়াম আমের মান দিয়ে সুন্দর অভিজ্ঞতা দিয়েছে।")}
      </p>

      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="font-semibold text-brand-deep">{review.customerName}</h3>
          <p className="text-sm text-muted">
            {review.product?.name || (locale === "en" ? "FreshBitan customer" : "FreshBitan-এর গ্রাহক")}
          </p>
        </div>
        {review.product?.slug ? (
          <a
            href={`/products/${review.product.slug}`}
            className="inline-flex items-center justify-center rounded-full bg-white px-4 py-2 text-sm font-semibold text-accent"
          >
            {t.common.productLink}
          </a>
        ) : null}
      </div>
    </article>
  );
}
