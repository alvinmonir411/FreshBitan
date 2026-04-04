"use client";

import { useState, useTransition } from "react";
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
          "ধন্যবাদ। আপনার review গ্রহণ করা হয়েছে এবং approve হলে সাইটে দেখানো হবে।",
        );
        setFormValues(initialState);
      } catch (submitError) {
        setError(
          submitError instanceof Error
            ? submitError.message
            : "Review submit করা যায়নি। আবার চেষ্টা করুন।",
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
          <span className="text-sm font-medium text-brand-deep">Product</span>
          <select
            name="productId"
            value={formValues.productId}
            onChange={handleChange}
            required
            className="h-12 w-full rounded-2xl border border-border bg-white px-4 text-sm outline-none focus:border-brand"
          >
            <option value="">Choose a product</option>
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium text-brand-deep">Name</span>
          <input
            name="customerName"
            value={formValues.customerName}
            onChange={handleChange}
            required
            className="h-12 w-full rounded-2xl border border-border bg-white px-4 text-sm outline-none focus:border-brand"
            placeholder="আপনার নাম"
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium text-brand-deep">Email</span>
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
          <span className="text-sm font-medium text-brand-deep">Rating</span>
          <select
            name="rating"
            value={formValues.rating}
            onChange={handleChange}
            className="h-12 w-full rounded-2xl border border-border bg-white px-4 text-sm outline-none focus:border-brand"
          >
            {[5, 4, 3, 2, 1].map((value) => (
              <option key={value} value={value}>
                {value} Star
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-2 sm:col-span-2">
          <span className="text-sm font-medium text-brand-deep">Comment</span>
          <textarea
            name="comment"
            value={formValues.comment}
            onChange={handleChange}
            rows={5}
            className="w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm outline-none focus:border-brand"
            placeholder="FreshBitan-এর experience সম্পর্কে লিখুন"
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
        {isPending ? "Submitting..." : "Review পাঠান"}
      </Button>
    </form>
  );
}
