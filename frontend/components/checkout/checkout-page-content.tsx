"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { OrderSummaryCard } from "@/components/cart/order-summary-card";
import { Button, buttonVariants } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";
import { useCart } from "@/hooks/use-cart";
import { buildOrderPayload, checkoutPaymentOptions, getDeliveryCharge } from "@/lib/cart";
import { createPublicOrder } from "@/lib/api";
import { buildWhatsappLink, normalizePhoneNumber } from "@/lib/utils";
import { CheckoutFormValues } from "@/types/cart";
import { SiteContent } from "@/types/site";

interface CheckoutPageContentProps {
  siteContent: SiteContent;
}

const defaultFormValues: CheckoutFormValues = {
  customerName: "",
  phone: "",
  email: "",
  address: "",
  area: "",
  district: "",
  notes: "",
  paymentMethod: "cash_on_delivery",
};

export function CheckoutPageContent({ siteContent }: CheckoutPageContentProps) {
  const router = useRouter();
  const { items, subtotal, clearCart, isHydrated } = useCart();
  const [formValues, setFormValues] = useState<CheckoutFormValues>(defaultFormValues);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  if (!isHydrated) {
    return (
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 py-10 sm:px-8 lg:px-10">
        <LoadingSkeleton className="h-12 max-w-md rounded-full" />
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <LoadingSkeleton className="h-[42rem] rounded-[2rem]" />
          <LoadingSkeleton className="h-[34rem] rounded-[2rem]" />
        </div>
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-6 py-12 sm:px-8">
        <EmptyState
          title="Checkout করার আগে কার্টে পণ্য যোগ করুন"
          description="প্রথমে আপনার পছন্দের পণ্য কার্টে যোগ করুন, তারপর এখান থেকে delivery details দিয়ে অর্ডার সম্পন্ন করুন।"
          actionHref="/products"
          actionLabel="পণ্য দেখুন"
        />
      </main>
    );
  }

  const deliveryCharge = getDeliveryCharge(formValues.district, siteContent);
  const total = subtotal + deliveryCharge;

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = event.target;
    setFormValues((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const normalizedPhone = normalizePhoneNumber(formValues.phone);

    if (!formValues.customerName.trim()) {
      setError("আপনার নাম লিখুন।");
      return;
    }

    if (normalizedPhone.length < 11) {
      setError("সঠিক ফোন নম্বর লিখুন, যাতে আমরা সহজে যোগাযোগ করতে পারি।");
      return;
    }

    if (!formValues.address.trim()) {
      setError("পূর্ণ ঠিকানা লিখুন।");
      return;
    }

    if (!formValues.area.trim()) {
      setError("এরিয়া বা থানা লিখুন।");
      return;
    }

    if (!formValues.district.trim()) {
      setError("জেলা লিখুন।");
      return;
    }

    startTransition(async () => {
      try {
        const order = await createPublicOrder(
          buildOrderPayload({
            formValues,
            items,
            siteContent,
          }),
        );

        clearCart();
        router.push(
          `/order-success?orderNumber=${encodeURIComponent(order.orderNumber)}`,
        );
      } catch (submitError) {
        setError(
          submitError instanceof Error
            ? submitError.message
            : "অর্ডার পাঠানো যায়নি। কিছুক্ষণ পর আবার চেষ্টা করুন।",
        );
      }
    });
  };

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 py-10 sm:px-8 lg:px-10">
      <section className="rounded-[2.2rem] border border-border bg-card p-6 sm:p-8">
        <span className="rounded-full bg-[#edf6f0] px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-accent">
          Checkout
        </span>
        <h1 className="mt-5 font-display text-4xl text-brand-deep sm:text-5xl">
          সহজ checkout, দ্রুত কনফার্মেশন
        </h1>
        <p className="mt-4 max-w-3xl text-sm leading-8 text-muted sm:text-base">
          ফোন নম্বরটি ঠিকভাবে দিন। FreshBitan team order verify করে delivery
          timing ও payment support জানিয়ে দেবে।
        </p>
      </section>

      <section className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <form
          onSubmit={handleSubmit}
          className="rounded-[2rem] border border-border bg-card p-6 shadow-[0_18px_42px_rgba(142,79,18,0.08)] sm:p-8"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-2 sm:col-span-2">
              <span className="text-sm font-medium text-brand-deep">আপনার নাম</span>
              <input
                name="customerName"
                value={formValues.customerName}
                onChange={handleChange}
                required
                className="h-12 w-full rounded-2xl border border-border bg-white px-4 text-sm outline-none focus:border-brand"
                placeholder="যেমন: মো. রাকিব হাসান"
              />
            </label>

            <label className="space-y-2 sm:col-span-2">
              <span className="text-sm font-medium text-brand-deep">
                ফোন নম্বর
              </span>
              <input
                name="phone"
                value={formValues.phone}
                onChange={handleChange}
                required
                className="h-14 w-full rounded-2xl border border-brand bg-[#fff8ef] px-4 text-base font-semibold outline-none focus:border-brand-deep"
                placeholder="+8801..."
              />
            </label>

            <label className="space-y-2 sm:col-span-2">
              <span className="text-sm font-medium text-brand-deep">
                ইমেইল (ঐচ্ছিক)
              </span>
              <input
                type="email"
                name="email"
                value={formValues.email}
                onChange={handleChange}
                className="h-12 w-full rounded-2xl border border-border bg-white px-4 text-sm outline-none focus:border-brand"
                placeholder="Optional"
              />
            </label>

            <label className="space-y-2 sm:col-span-2">
              <span className="text-sm font-medium text-brand-deep">পূর্ণ ঠিকানা</span>
              <textarea
                name="address"
                value={formValues.address}
                onChange={handleChange}
                required
                rows={4}
                className="w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm outline-none focus:border-brand"
                placeholder="বাড়ি/রোড/গ্রাম/পোস্ট অফিসসহ পূর্ণ ঠিকানা লিখুন"
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-brand-deep">এরিয়া / থানা</span>
              <input
                name="area"
                value={formValues.area}
                onChange={handleChange}
                required
                className="h-12 w-full rounded-2xl border border-border bg-white px-4 text-sm outline-none focus:border-brand"
                placeholder="যেমন: উত্তরা"
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-brand-deep">জেলা</span>
              <input
                name="district"
                value={formValues.district}
                onChange={handleChange}
                required
                className="h-12 w-full rounded-2xl border border-border bg-white px-4 text-sm outline-none focus:border-brand"
                placeholder="যেমন: ঢাকা"
              />
            </label>

            <label className="space-y-2 sm:col-span-2">
              <span className="text-sm font-medium text-brand-deep">পেমেন্ট পদ্ধতি</span>
              <div className="grid gap-3">
                {checkoutPaymentOptions.map((option) => (
                  <label
                    key={option.value}
                    className="flex cursor-pointer items-start gap-3 rounded-[1.5rem] border border-border bg-white px-4 py-4"
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={option.value}
                      checked={formValues.paymentMethod === option.value}
                      onChange={handleChange}
                      className="mt-1 h-4 w-4 accent-brand"
                    />
                    <span>
                      <span className="block font-semibold text-brand-deep">
                        {option.label}
                      </span>
                      <span className="mt-1 block text-sm leading-6 text-muted">
                        {option.description}
                      </span>
                    </span>
                  </label>
                ))}
              </div>
            </label>

            <label className="space-y-2 sm:col-span-2">
              <span className="text-sm font-medium text-brand-deep">
                অতিরিক্ত নোট (ঐচ্ছিক)
              </span>
              <textarea
                name="notes"
                value={formValues.notes}
                onChange={handleChange}
                rows={3}
                className="w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm outline-none focus:border-brand"
                placeholder="যেমন: বিকেলে ডেলিভারি হলে ভালো হয়"
              />
            </label>
          </div>

          {error ? (
            <p className="mt-5 rounded-[1.4rem] bg-[#fff0e5] px-4 py-3 text-sm text-[#9a3f0e]">
              {error}
            </p>
          ) : null}

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <Button type="submit" disabled={isPending} fullWidth size="lg">
              {isPending ? "অর্ডার পাঠানো হচ্ছে..." : "অর্ডার কনফার্ম করুন"}
            </Button>
            <a
              href={buildWhatsappLink(
                siteContent.whatsappNumber,
                `${siteContent.whatsappMessage} Checkout support দরকার।`,
              )}
              target="_blank"
              rel="noreferrer"
              className={buttonVariants({ variant: "whatsapp", size: "lg", fullWidth: true })}
            >
              WhatsApp সহায়তা
            </a>
          </div>
        </form>

        <OrderSummaryCard
          items={items}
          subtotal={subtotal}
          deliveryCharge={deliveryCharge}
          total={total}
          title="আপনার অর্ডারের হিসাব"
          description="এই মোট টাকার মধ্যে delivery charge district অনুযায়ী automatically ধরা হয়েছে।"
          footerNote={`ঢাকার ভিতরে ৳${siteContent.deliveryChargeDhaka}, ঢাকার বাইরে ৳${siteContent.deliveryChargeOutsideDhaka} delivery charge ধরা হয়।`}
        >
          <Link
            href="/cart"
            className={buttonVariants({ variant: "outline", size: "lg", fullWidth: true })}
          >
            কার্টে ফিরে যান
          </Link>
        </OrderSummaryCard>
      </section>
    </main>
  );
}
