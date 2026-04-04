"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { createPublicOrder } from "@/lib/api";
import { ProductSummary } from "@/types/api";
import { SiteContent } from "@/types/site";

interface QuickOrderFormProps {
  products: ProductSummary[];
  siteContent: SiteContent;
  initialProductId?: string;
}

const defaultFormValues = {
  productId: "",
  quantity: "1",
  customerName: "",
  customerEmail: "",
  customerPhone: "",
  shippingAddress: "",
  district: "",
  area: "",
  notes: "",
};

export function QuickOrderForm({
  products,
  siteContent,
  initialProductId,
}: QuickOrderFormProps) {
  const router = useRouter();
  const [formValues, setFormValues] = useState({
    ...defaultFormValues,
    productId: initialProductId ?? "",
  });
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

    startTransition(async () => {
      try {
        const order = await createPublicOrder({
          customerName: formValues.customerName,
          customerEmail: formValues.customerEmail || undefined,
          customerPhone: formValues.customerPhone,
          shippingAddress: formValues.shippingAddress,
          district: formValues.district || undefined,
          area: formValues.area || undefined,
          notes:
            formValues.notes ||
            `${siteContent.brandName} website quick order request`,
          items: [
            {
              productId: formValues.productId,
              quantity: Number(formValues.quantity),
            },
          ],
        });

        router.push(
          `/order-success?orderNumber=${encodeURIComponent(order.orderNumber)}`,
        );
      } catch (submitError) {
        setError(
          submitError instanceof Error
            ? submitError.message
            : "Order submit করা যায়নি। আবার চেষ্টা করুন।",
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
            <option value="">Select a product</option>
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
          <span className="text-sm font-medium text-brand-deep">Phone</span>
          <input
            name="customerPhone"
            value={formValues.customerPhone}
            onChange={handleChange}
            required
            className="h-12 w-full rounded-2xl border border-border bg-white px-4 text-sm outline-none focus:border-brand"
            placeholder="+8801..."
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium text-brand-deep">Quantity</span>
          <input
            type="number"
            min="1"
            name="quantity"
            value={formValues.quantity}
            onChange={handleChange}
            required
            className="h-12 w-full rounded-2xl border border-border bg-white px-4 text-sm outline-none focus:border-brand"
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
            placeholder="Optional"
          />
        </label>

        <label className="space-y-2 sm:col-span-2">
          <span className="text-sm font-medium text-brand-deep">Address</span>
          <textarea
            name="shippingAddress"
            value={formValues.shippingAddress}
            onChange={handleChange}
            required
            rows={4}
            className="w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm outline-none focus:border-brand"
            placeholder="পূর্ণ ঠিকানা লিখুন"
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium text-brand-deep">District</span>
          <input
            name="district"
            value={formValues.district}
            onChange={handleChange}
            className="h-12 w-full rounded-2xl border border-border bg-white px-4 text-sm outline-none focus:border-brand"
            placeholder="Dhaka"
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium text-brand-deep">Area</span>
          <input
            name="area"
            value={formValues.area}
            onChange={handleChange}
            className="h-12 w-full rounded-2xl border border-border bg-white px-4 text-sm outline-none focus:border-brand"
            placeholder="Uttara"
          />
        </label>

        <label className="space-y-2 sm:col-span-2">
          <span className="text-sm font-medium text-brand-deep">Notes</span>
          <textarea
            name="notes"
            value={formValues.notes}
            onChange={handleChange}
            rows={3}
            className="w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm outline-none focus:border-brand"
            placeholder="Delivery notes or preferred time"
          />
        </label>
      </div>

      {error ? (
        <p className="mt-4 rounded-2xl bg-[#fff0e5] px-4 py-3 text-sm text-[#9a3f0e]">
          {error}
        </p>
      ) : null}

      <Button type="submit" className="mt-5" disabled={isPending}>
        {isPending ? "Submitting..." : "Order submit করুন"}
      </Button>
    </form>
  );
}
