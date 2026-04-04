import { Review } from "@/types/api";
import { formatDate } from "@/lib/utils";

interface ReviewCardProps {
  review: Review;
}

export function ReviewCard({ review }: ReviewCardProps) {
  return (
    <article className="rounded-[1.75rem] border border-border bg-card p-5 shadow-[0_18px_42px_rgba(142,79,18,0.08)]">
      <div className="flex items-center justify-between gap-3">
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
          "FreshBitan delivered a neat experience with dependable support and satisfying fruit quality."}
      </p>

      <div className="mt-6 flex items-center justify-between gap-4">
        <div>
          <h3 className="font-semibold text-brand-deep">{review.customerName}</h3>
          <p className="text-sm text-muted">
            {review.product?.name || "FreshBitan customer"}
          </p>
        </div>
        {review.product?.slug ? (
          <a
            href={`/products/${review.product.slug}`}
            className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-accent"
          >
            Product
          </a>
        ) : null}
      </div>
    </article>
  );
}
