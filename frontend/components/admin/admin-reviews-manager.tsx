"use client";

import { useEffect, useState, useTransition } from "react";
import { AdminFeedback } from "@/components/admin/admin-feedback";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminStatusBadge } from "@/components/admin/admin-status-badge";
import { EmptyState } from "@/components/ui/empty-state";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";
import { adminRequest } from "@/lib/admin-client";
import { formatDate } from "@/lib/utils";
import { AdminReview } from "@/types/admin";

export function AdminReviewsManager() {
  const [reviews, setReviews] = useState<AdminReview[]>([]);
  const [feedback, setFeedback] = useState<{
    tone: "success" | "error";
    message: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  const loadReviews = async () => {
    setIsLoading(true);

    try {
      const data = await adminRequest<AdminReview[]>("/api/admin/backend/reviews");
      setReviews(data);
    } catch (error) {
      setFeedback({
        tone: "error",
        message: error instanceof Error ? error.message : "Failed to load reviews.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadReviews();
  }, []);

  const toggleReview = (review: AdminReview) => {
    startTransition(async () => {
      try {
        await adminRequest(`/api/admin/backend/reviews/${review.id}/publish`, {
          method: "PATCH",
          body: {
            isApproved: !review.isApproved,
          },
        });

        setFeedback({
          tone: "success",
          message: review.isApproved ? "Review unpublished." : "Review published.",
        });
        await loadReviews();
      } catch (error) {
        setFeedback({
          tone: "error",
          message: error instanceof Error ? error.message : "Could not update review.",
        });
      }
    });
  };

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Reviews"
        title="Review moderation"
        description="Approve or hide customer reviews before they appear on the public storefront."
      />

      {feedback ? <AdminFeedback tone={feedback.tone} message={feedback.message} /> : null}

      <section className="rounded-[2rem] border border-white/60 bg-white/75 p-6 shadow-[0_18px_50px_rgba(142,79,18,0.08)]">
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <LoadingSkeleton key={index} className="h-22 rounded-3xl" />
            ))}
          </div>
        ) : reviews.length === 0 ? (
          <EmptyState
            title="No reviews found"
            description="Published and pending customer reviews will appear here."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border text-muted">
                  <th className="pb-3 font-semibold">Reviewer</th>
                  <th className="pb-3 font-semibold">Product</th>
                  <th className="pb-3 font-semibold">Rating</th>
                  <th className="pb-3 font-semibold">Comment</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {reviews.map((review) => (
                  <tr key={review.id} className="border-b border-border/70 align-top last:border-b-0">
                    <td className="py-4">
                      <p className="font-semibold text-brand-deep">{review.customerName}</p>
                      <p className="mt-1 text-xs text-muted">{review.customerEmail ?? "No email"}</p>
                      <p className="mt-1 text-xs text-muted">{formatDate(review.createdAt)}</p>
                    </td>
                    <td className="py-4">{review.product?.name ?? "Unknown product"}</td>
                    <td className="py-4">{review.rating}/5</td>
                    <td className="py-4 max-w-sm text-muted">{review.comment ?? "No comment provided."}</td>
                    <td className="py-4">
                      <AdminStatusBadge tone={review.isApproved ? "success" : "warning"}>
                        {review.isApproved ? "published" : "pending"}
                      </AdminStatusBadge>
                    </td>
                    <td className="py-4">
                      <button
                        type="button"
                        className="rounded-full border border-border px-3 py-2 text-xs font-semibold text-brand-deep"
                        onClick={() => toggleReview(review)}
                        disabled={isPending}
                      >
                        {review.isApproved ? "Unpublish" : "Publish"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
