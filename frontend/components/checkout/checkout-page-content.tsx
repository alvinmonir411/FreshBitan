"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { OrderSummaryCard } from "@/components/cart/order-summary-card";
import { useDictionary, useSiteLocale } from "@/components/layout/locale-provider";
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
  const t = useDictionary();
  const locale = useSiteLocale();
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
          title={t.checkoutPage.emptyTitle}
          description={t.checkoutPage.emptyDescription}
          actionHref="/products"
          actionLabel={t.checkoutPage.emptyAction}
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
      setError(t.checkoutPage.errName);
      return;
    }

    if (normalizedPhone.length < 11) {
      setError(t.checkoutPage.errPhone);
      return;
    }

    if (!formValues.address.trim()) {
      setError(t.checkoutPage.errAddress);
      return;
    }

    if (!formValues.area.trim()) {
      setError(t.checkoutPage.errArea);
      return;
    }

    if (!formValues.district.trim()) {
      setError(t.checkoutPage.errDistrict);
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
            : t.checkoutPage.errSubmit,
        );
      }
    });
  };

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 py-10 sm:px-8 lg:px-10">
      <section className="rounded-[2.2rem] border border-border bg-card p-6 sm:p-8">
          <span className="rounded-full bg-[#edf6f0] px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-accent">
          {t.checkoutPage.heroBadge}
          </span>
        <h1 className="mt-5 font-display text-4xl text-brand-deep sm:text-5xl">
          {t.checkoutPage.heroTitle}
        </h1>
        <p className="mt-4 max-w-3xl text-sm leading-8 text-muted sm:text-base">
          {t.checkoutPage.heroDescription}
        </p>
      </section>

      <section className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <form
          onSubmit={handleSubmit}
          className="rounded-[2rem] border border-border bg-card p-6 shadow-[0_18px_42px_rgba(142,79,18,0.08)] sm:p-8"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-2 sm:col-span-2">
              <span className="text-sm font-medium text-brand-deep">{t.checkoutPage.customerName}</span>
              <input
                name="customerName"
                value={formValues.customerName}
                onChange={handleChange}
                required
                className="h-12 w-full rounded-2xl border border-border bg-white px-4 text-sm outline-none focus:border-brand"
                placeholder={t.checkoutPage.customerNamePlaceholder}
              />
            </label>

            <label className="space-y-2 sm:col-span-2">
              <span className="text-sm font-medium text-brand-deep">
                {t.checkoutPage.phoneLabel}
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
                {t.checkoutPage.emailLabel}
              </span>
              <input
                type="email"
                name="email"
                value={formValues.email}
                onChange={handleChange}
                className="h-12 w-full rounded-2xl border border-border bg-white px-4 text-sm outline-none focus:border-brand"
                placeholder={t.checkoutPage.emailPlaceholder}
              />
            </label>

            <label className="space-y-2 sm:col-span-2">
              <span className="text-sm font-medium text-brand-deep">{t.checkoutPage.addressLabel}</span>
              <textarea
                name="address"
                value={formValues.address}
                onChange={handleChange}
                required
                rows={4}
                className="w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm outline-none focus:border-brand"
                placeholder={t.checkoutPage.addressPlaceholder}
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-brand-deep">{t.checkoutPage.areaLabel}</span>
              <input
                name="area"
                value={formValues.area}
                onChange={handleChange}
                required
                className="h-12 w-full rounded-2xl border border-border bg-white px-4 text-sm outline-none focus:border-brand"
                placeholder={t.checkoutPage.areaPlaceholder}
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-brand-deep">{t.checkoutPage.districtLabel}</span>
              <input
                name="district"
                value={formValues.district}
                onChange={handleChange}
                required
                className="h-12 w-full rounded-2xl border border-border bg-white px-4 text-sm outline-none focus:border-brand"
                placeholder={t.checkoutPage.districtPlaceholder}
              />
            </label>

            <label className="space-y-2 sm:col-span-2">
              <span className="text-sm font-medium text-brand-deep">{t.checkoutPage.paymentLabel}</span>
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
                {t.checkoutPage.notesLabel}
              </span>
              <textarea
                name="notes"
                value={formValues.notes}
                onChange={handleChange}
                rows={3}
                className="w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm outline-none focus:border-brand"
                placeholder={t.checkoutPage.notesPlaceholder}
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
              {isPending ? t.checkoutPage.submitting : t.checkoutPage.submit}
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
              {t.checkoutPage.whatsappSupport}
            </a>
          </div>
        </form>

        <OrderSummaryCard
          items={items}
          subtotal={subtotal}
          deliveryCharge={deliveryCharge}
          total={total}
          title={t.checkoutPage.summaryTitle}
          description={t.checkoutPage.summaryDescription}
          footerNote={`${t.checkoutPage.summaryFooterPrefix} ৳${siteContent.deliveryChargeDhaka}${locale === "en" ? " inside Dhaka, and " : ", "}৳${siteContent.deliveryChargeOutsideDhaka}${locale === "en" ? " outside Dhaka." : " ঢাকার বাইরে।"}`}
        >
          <Link
            href="/cart"
            className={buttonVariants({ variant: "outline", size: "lg", fullWidth: true })}
          >
            {t.checkoutPage.backToCart}
          </Link>
        </OrderSummaryCard>
      </section>
    </main>
  );
}
