"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useDictionary, useSiteLocale } from "@/components/layout/locale-provider";
import { Button } from "@/components/ui/button";
import { createPublicOrder } from "@/lib/api";
import { ProductSummary } from "@/types/api";
import { SiteContent } from "@/types/site";
import { getActiveProductOptions, getDefaultProductOption } from "@/lib/utils";

interface QuickOrderFormProps {
  products: ProductSummary[];
  siteContent: SiteContent;
  initialProductId?: string;
}

const defaultFormValues = {
  productId: "",
  productOptionId: "",
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
  const t = useDictionary();
  const locale = useSiteLocale();
  const initialProduct =
    products.find((product) => product.id === initialProductId) ?? null;
  const initialOption = initialProduct
    ? getDefaultProductOption(initialProduct)
    : null;
  const [formValues, setFormValues] = useState({
    ...defaultFormValues,
    productId: initialProductId ?? "",
    productOptionId: initialOption?.id ?? "",
  });
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const selectedProduct =
    products.find((product) => product.id === formValues.productId) ?? null;
  const selectedProductOptions = selectedProduct
    ? getActiveProductOptions(selectedProduct)
    : [];

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = event.target;
    setFormValues((current) => {
      if (name === "productId") {
        const nextProduct =
          products.find((product) => product.id === value) ?? null;
        const nextDefaultOption = nextProduct
          ? getDefaultProductOption(nextProduct)
          : null;

        return {
          ...current,
          productId: value,
          productOptionId: nextDefaultOption?.id ?? "",
        };
      }

      return { ...current, [name]: value };
    });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!formValues.productId) {
      setError(locale === "en" ? "Please select a mango product." : "একটি আমের পণ্য বেছে নিন।");
      return;
    }

    if (selectedProductOptions.length > 0 && !formValues.productOptionId) {
      setError(locale === "en" ? "Please choose a pack size." : "একটি প্যাক সাইজ বেছে নিন।");
      return;
    }

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
            (locale === "en"
              ? `${siteContent.brandName} website quick order request`
              : `${siteContent.brandName} ওয়েবসাইট quick order request`),
          items: [
            {
              productId: formValues.productId,
              productOptionId: formValues.productOptionId || undefined,
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
            : locale === "en"
              ? "Could not submit the order. Please try again."
              : "অর্ডার পাঠানো যায়নি। আবার চেষ্টা করুন।",
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
            <option value="">{locale === "en" ? "Select a mango product" : "একটি আমের পণ্য বাছুন"}</option>
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name}
              </option>
            ))}
          </select>
        </label>

        {selectedProductOptions.length > 0 ? (
          <label className="space-y-2">
            <span className="text-sm font-medium text-brand-deep">
              {locale === "en" ? "Pack size" : "প্যাক সাইজ"}
            </span>
            <select
              name="productOptionId"
              value={formValues.productOptionId}
              onChange={handleChange}
              required
              className="h-12 w-full rounded-2xl border border-border bg-white px-4 text-sm outline-none focus:border-brand"
            >
              <option value="">
                {locale === "en" ? "Select pack size" : "প্যাক সাইজ বাছুন"}
              </option>
              {selectedProductOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        ) : null}

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
          <span className="text-sm font-medium text-brand-deep">{t.common.phone}</span>
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
          <span className="text-sm font-medium text-brand-deep">{t.common.quantity}</span>
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
          <span className="text-sm font-medium text-brand-deep">{t.common.email}</span>
          <input
            type="email"
            name="customerEmail"
            value={formValues.customerEmail}
            onChange={handleChange}
            className="h-12 w-full rounded-2xl border border-border bg-white px-4 text-sm outline-none focus:border-brand"
            placeholder={locale === "en" ? "Optional" : "ঐচ্ছিক"}
          />
        </label>

        <label className="space-y-2 sm:col-span-2">
          <span className="text-sm font-medium text-brand-deep">{t.common.address}</span>
          <textarea
            name="shippingAddress"
            value={formValues.shippingAddress}
            onChange={handleChange}
            required
            rows={4}
            className="w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm outline-none focus:border-brand"
            placeholder={locale === "en" ? "Enter your full address" : "পূর্ণ ঠিকানা লিখুন"}
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium text-brand-deep">{t.common.district}</span>
          <input
            name="district"
            value={formValues.district}
            onChange={handleChange}
            className="h-12 w-full rounded-2xl border border-border bg-white px-4 text-sm outline-none focus:border-brand"
            placeholder={locale === "en" ? "Dhaka" : "ঢাকা"}
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium text-brand-deep">{t.common.area}</span>
          <input
            name="area"
            value={formValues.area}
            onChange={handleChange}
            className="h-12 w-full rounded-2xl border border-border bg-white px-4 text-sm outline-none focus:border-brand"
            placeholder={locale === "en" ? "Uttara" : "উত্তরা"}
          />
        </label>

        <label className="space-y-2 sm:col-span-2">
          <span className="text-sm font-medium text-brand-deep">{t.common.notes}</span>
          <textarea
            name="notes"
            value={formValues.notes}
            onChange={handleChange}
            rows={3}
            className="w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm outline-none focus:border-brand"
            placeholder={locale === "en" ? "Delivery notes or preferred time" : "ডেলিভারি নোট বা পছন্দের সময়"}
          />
        </label>
      </div>

      {error ? (
        <p className="mt-4 rounded-2xl bg-[#fff0e5] px-4 py-3 text-sm text-[#9a3f0e]">
          {error}
        </p>
      ) : null}

      <Button type="submit" className="mt-5" disabled={isPending}>
        {isPending ? t.common.loadingSubmit : locale === "en" ? "Submit order" : "অর্ডার পাঠান"}
      </Button>
    </form>
  );
}
