"use client";

import Link from "next/link";
import { OrderSummaryCard } from "@/components/cart/order-summary-card";
import { QuantityStepper } from "@/components/cart/quantity-stepper";
import { useDictionary, useSiteLocale } from "@/components/layout/locale-provider";
import { Button, buttonVariants } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";
import { useCart } from "@/hooks/use-cart";
import { buildWhatsappLink, cn, formatCurrency } from "@/lib/utils";
import { SiteContent } from "@/types/site";

interface CartPageContentProps {
  siteContent: SiteContent;
}

export function CartPageContent({ siteContent }: CartPageContentProps) {
  const t = useDictionary();
  const locale = useSiteLocale();
  const { items, subtotal, itemCount, isHydrated, updateQuantity, removeItem, clearCart } =
    useCart();

  if (!isHydrated) {
    return (
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 py-10 sm:px-8 lg:px-10">
        <LoadingSkeleton className="h-12 max-w-md rounded-full" />
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-4">
            <LoadingSkeleton className="h-36 rounded-[2rem]" />
            <LoadingSkeleton className="h-36 rounded-[2rem]" />
          </div>
          <LoadingSkeleton className="h-[28rem] rounded-[2rem]" />
        </div>
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-6 py-12 sm:px-8">
        <EmptyState
          title={t.cartPage.emptyTitle}
          description={t.cartPage.emptyDescription}
          actionHref="/products"
          actionLabel={t.cartPage.emptyAction}
        />
        <section className="rounded-[2rem] border border-border bg-card p-6 text-center shadow-[0_18px_42px_rgba(142,79,18,0.08)]">
          <p className="text-xl font-semibold text-brand-deep">{t.cartPage.helpTitle}</p>
          <p className="mt-3 text-sm leading-7 text-muted">
            {t.cartPage.helpDescription}
          </p>
          <a
            href={buildWhatsappLink(
              siteContent.whatsappNumber,
              `${siteContent.whatsappMessage} কার্টে পণ্য যোগ করতে সাহায্য চাই।`,
            )}
            target="_blank"
            rel="noreferrer"
            className={`${buttonVariants({ variant: "whatsapp", size: "lg" })} mt-5`}
          >
            {t.cartPage.helpAction}
          </a>
        </section>
      </main>
    );
  }

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 py-10 sm:px-8 lg:px-10">
      <section className="flex flex-col gap-4 rounded-[2.2rem] border border-border bg-card p-6 sm:p-8 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <span className="rounded-full bg-[#edf6f0] px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-accent">
            {t.cartPage.heroBadge}
          </span>
          <h1 className="mt-5 font-display text-4xl text-brand-deep sm:text-5xl">
            {t.cartPage.heroTitle}
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-8 text-muted sm:text-base">
            {t.cartPage.heroDescription}
          </p>
        </div>
        <Button
          type="button"
          variant="ghost"
          onClick={clearCart}
          className="rounded-full"
        >
          {t.common.clearCart}
        </Button>
      </section>

      <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4">
          {items.map((item) => (
            <article
              key={`${item.productId}-${item.productOptionId}`}
              className="rounded-[2rem] border border-border bg-card p-5 shadow-[0_18px_42px_rgba(142,79,18,0.08)] sm:p-6"
            >
              <div className="flex gap-4">
                <div
                  className={cn(
                    "h-24 w-24 shrink-0 overflow-hidden rounded-[1.35rem] border border-border bg-[#ffe6bc]",
                    !item.imageUrl && "flex items-end justify-start bg-[linear-gradient(135deg,#ffe5ba,#f3ab4d)] p-3",
                  )}
                >
                  {item.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.imageUrl}
                      alt={item.imageAlt || item.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-brand-deep">
                      FreshBitan
                    </span>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <Link
                        href={`/products/${item.slug}`}
                        className="text-lg font-semibold text-brand-deep hover:text-brand"
                      >
                        {item.name}
                      </Link>
                      <p className="mt-2 text-sm text-muted">
                        {item.categoryName || t.cartPage.categoryFallback} · {item.optionLabel}
                      </p>
                    </div>
                    <p className="text-base font-bold text-foreground">
                      {formatCurrency(item.unitPrice)}
                    </p>
                  </div>

                  <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <QuantityStepper
                      value={item.quantity}
                      max={item.stockQuantity > 0 ? item.stockQuantity : 99}
                      onChange={(value) =>
                        updateQuantity(item.productId, item.productOptionId, value)
                      }
                    />
                    <div className="flex items-center justify-between gap-4 sm:justify-end">
                      <p className="text-sm font-semibold text-brand-deep">
                        {t.cartPage.lineTotal}:{" "}
                        {formatCurrency(
                          item.unitPrice * item.quantity,
                        )}
                      </p>
                      <button
                        type="button"
                        onClick={() => removeItem(item.productId, item.productOptionId)}
                        className="text-sm font-semibold text-[#a9481c] hover:text-[#8f3911]"
                      >
                        {t.common.remove}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        <OrderSummaryCard
          items={items}
          subtotal={subtotal}
          total={subtotal}
          title={`${itemCount} ${t.cartPage.summaryTitleSuffix}`}
          description={t.cartPage.summaryDescription}
          footerNote={`${t.cartPage.summaryFooterPrefix} ৳${siteContent.deliveryChargeDhaka} ${locale === "en" ? "inside Dhaka and" : "ঢাকার ভিতরে এবং"} ৳${siteContent.deliveryChargeOutsideDhaka} ${locale === "en" ? "outside Dhaka." : "ঢাকার বাইরে।"}`}
        >
          <Link
            href="/checkout"
            className={buttonVariants({ variant: "primary", size: "lg", fullWidth: true })}
          >
            {t.cartPage.checkoutAction}
          </Link>
          <Link
            href="/products"
            className={buttonVariants({ variant: "outline", size: "lg", fullWidth: true })}
          >
            {t.cartPage.addMoreAction}
          </Link>
          <a
            href={buildWhatsappLink(
              siteContent.whatsappNumber,
              `${siteContent.whatsappMessage} Cart items: ${items
                .map((item) => `${item.name} (${item.optionLabel}) x${item.quantity}`)
                .join(", ")}`,
            )}
            target="_blank"
            rel="noreferrer"
            className={buttonVariants({ variant: "whatsapp", size: "lg", fullWidth: true })}
          >
            {t.cartPage.whatsappAction}
          </a>
        </OrderSummaryCard>
      </section>
    </main>
  );
}
