"use client";

import Link from "next/link";
import { OrderSummaryCard } from "@/components/cart/order-summary-card";
import { QuantityStepper } from "@/components/cart/quantity-stepper";
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
          title="আপনার কার্ট এখনো খালি"
          description="পছন্দের আম বা seasonal fruit বেছে কার্টে যোগ করুন, তারপর checkout করে অর্ডার কনফার্ম করুন।"
          actionHref="/products"
          actionLabel="পণ্য দেখুন"
        />
        <section className="rounded-[2rem] border border-border bg-card p-6 text-center shadow-[0_18px_42px_rgba(142,79,18,0.08)]">
          <p className="text-xl font-semibold text-brand-deep">দ্রুত সাহায্য দরকার?</p>
          <p className="mt-3 text-sm leading-7 text-muted">
            চাইলে WhatsApp-এ message করে variety, delivery, বা bulk order নিয়ে কথা বলতে পারেন।
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
            WhatsApp সহায়তা
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
            Shopping Cart
          </span>
          <h1 className="mt-5 font-display text-4xl text-brand-deep sm:text-5xl">
            আপনার নির্বাচিত FreshBitan পণ্য
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-8 text-muted sm:text-base">
            Quantity আপডেট করুন, delivery মোটামুটি হিসাব দেখুন, তারপর checkout-এ গিয়ে অর্ডার সম্পন্ন করুন।
          </p>
        </div>
        <Button
          type="button"
          variant="ghost"
          onClick={clearCart}
          className="rounded-full"
        >
          Clear cart
        </Button>
      </section>

      <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4">
          {items.map((item) => (
            <article
              key={item.productId}
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
                        {item.categoryName || "Seasonal Fruit"} · {item.unit}
                      </p>
                    </div>
                    <p className="text-base font-bold text-foreground">
                      {formatCurrency(item.discountedPrice ?? item.price)}
                    </p>
                  </div>

                  <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <QuantityStepper
                      value={item.quantity}
                      max={item.stockQuantity > 0 ? item.stockQuantity : 99}
                      onChange={(value) => updateQuantity(item.productId, value)}
                    />
                    <div className="flex items-center justify-between gap-4 sm:justify-end">
                      <p className="text-sm font-semibold text-brand-deep">
                        Line total:{" "}
                        {formatCurrency(
                          (item.discountedPrice ?? item.price) * item.quantity,
                        )}
                      </p>
                      <button
                        type="button"
                        onClick={() => removeItem(item.productId)}
                        className="text-sm font-semibold text-[#a9481c] hover:text-[#8f3911]"
                      >
                        Remove
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
          title={`${itemCount} item ready for checkout`}
          description="Delivery charge checkout page-এ district অনুযায়ী হিসাব হবে।"
          footerNote={`ঢাকার ভিতরে ৳${siteContent.deliveryChargeDhaka} এবং ঢাকার বাইরে ৳${siteContent.deliveryChargeOutsideDhaka} delivery charge ধরা হয়েছে।`}
        >
          <Link
            href="/checkout"
            className={buttonVariants({ variant: "primary", size: "lg", fullWidth: true })}
          >
            Checkout করুন
          </Link>
          <Link
            href="/products"
            className={buttonVariants({ variant: "outline", size: "lg", fullWidth: true })}
          >
            আরও পণ্য যোগ করুন
          </Link>
          <a
            href={buildWhatsappLink(
              siteContent.whatsappNumber,
              `${siteContent.whatsappMessage} Cart items: ${items
                .map((item) => `${item.name} x${item.quantity}`)
                .join(", ")}`,
            )}
            target="_blank"
            rel="noreferrer"
            className={buttonVariants({ variant: "whatsapp", size: "lg", fullWidth: true })}
          >
            WhatsApp-এ অর্ডার আলোচনা
          </a>
        </OrderSummaryCard>
      </section>
    </main>
  );
}
