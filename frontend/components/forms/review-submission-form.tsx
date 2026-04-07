"use client";

import { useState, useTransition } from "react";
import { useDictionary, useSiteLocale } from "@/components/layout/locale-provider";
import { Button } from "@/components/ui/button";
import { createPublicReview } from "@/lib/api";
import { ProductSummary } from "@/types/api";

interface ReviewSubmissionFormProps {
  products: ProductSummary[];
}

const initialState = {
  productId: "",
  customerName: "",
  customerEmail: "",
  rating: "5",
  comment: "",
};

export function ReviewSubmissionForm({
  products,
}: ReviewSubmissionFormProps) {
  const t = useDictionary();
  const locale = useSiteLocale();
  const [formValues, setFormValues] = useState(initialState);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = event.target;
    setFormValues((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setMessage(null);

    startTransition(async () => {
      try {
        await createPublicReview({
          productId: formValues.productId,
          customerName: formValues.customerName,
          customerEmail: formValues.customerEmail || undefined,
          rating: Number(formValues.rating),
          comment: formValues.comment || undefined,
        });

        setMessage(
          locale === "en"
            ? "Thank you. Your review has been received and will appear once approved."
            : "ধন্যবাদ। আপনার রিভিউ গ্রহণ করা হয়েছে এবং অনুমোদন পেলে সাইটে দেখানো হবে।",
        );
        setFormValues(initialState);
      } catch (submitError) {
        setError(
          submitError instanceof Error
            ? submitError.message
            : locale === "en"
            ? "Could not submit the review. Please try again."
              : "রিভিউ পাঠানো যায়নি। আবার চেষ্টা করুন।",
        );
      }
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-[2rem] border border-border bg-card p-6 shadow-[0_18px_42px_rgba(142,79,18,0.08)]"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-2 sm:col-span-2">
          <span className="text-sm font-medium text-brand-deep">{t.common.product}</span>
          <select
            name="productId"
            value={formValues.productId}
            onChange={handleChange}
            required
            className="h-12 w-full rounded-2xl border border-border bg-white px-4 text-sm outline-none focus:border-brand"
          >
            <option value="">{locale === "en" ? "Choose a product" : "একটি পণ্য বাছুন"}</option>
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium text-brand-deep">{t.common.name}</span>
          <input
            name="customerName"
            value={formValues.customerName}
            onChange={handleChange}
            required
            className="h-12 w-full rounded-2xl border border-border bg-white px-4 text-sm outline-none focus:border-brand"
            placeholder={locale === "en" ? "Your name" : "আপনার নাম"}
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium text-brand-deep">{t.common.email}</span>
          <input
            type="email"
            name="customerEmail"
            value={formValues.customerEmail}
            onChange={handleChange}
            className="h-12 w-full rounded-2xl border border-border bg-white px-4 text-sm outline-none focus:border-brand"
            placeholder="you@example.com"
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium text-brand-deep">{t.common.rating}</span>
          <select
            name="rating"
            value={formValues.rating}
            onChange={handleChange}
            className="h-12 w-full rounded-2xl border border-border bg-white px-4 text-sm outline-none focus:border-brand"
          >
            {[5, 4, 3, 2, 1].map((value) => (
              <option key={value} value={value}>
                {value} {t.common.star}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-2 sm:col-span-2">
          <span className="text-sm font-medium text-brand-deep">{t.common.comment}</span>
          <textarea
            name="comment"
            value={formValues.comment}
            onChange={handleChange}
            rows={5}
            className="w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm outline-none focus:border-brand"
            placeholder={locale === "en" ? "Write about your FreshBitan experience" : "FreshBitan-এর অভিজ্ঞতা সম্পর্কে লিখুন"}
          />
        </label>
      </div>

      {message ? (
        <p className="mt-4 rounded-2xl bg-[#edf6f0] px-4 py-3 text-sm text-accent">
          {message}
        </p>
      ) : null}
      {error ? (
        <p className="mt-4 rounded-2xl bg-[#fff0e5] px-4 py-3 text-sm text-[#9a3f0e]">
          {error}
        </p>
      ) : null}

      <Button type="submit" className="mt-5" disabled={isPending}>
        {isPending ? t.common.loadingSubmit : locale === "en" ? "Submit review" : "রিভিউ পাঠান"}
      </Button>
    </form>
  );
}
