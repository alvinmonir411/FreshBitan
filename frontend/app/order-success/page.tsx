import type { Metadata } from "next";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { getDictionary } from "@/lib/locale-data";
import { getSiteLocale } from "@/lib/locale-server";
import { buildPublicMetadata } from "@/lib/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getSiteLocale();
  const t = getDictionary(locale);
  return buildPublicMetadata({
    title: t.orderSuccess.metaTitle,
    description: t.orderSuccess.metaDescription,
    path: "/order-success",
  });
}

interface OrderSuccessPageProps {
  searchParams: Promise<{
    orderNumber?: string;
  }>;
}

export default async function OrderSuccessPage({
  searchParams,
}: OrderSuccessPageProps) {
  const locale = await getSiteLocale();
  const t = getDictionary(locale);
  const resolvedSearchParams = await searchParams;
  const orderNumber = resolvedSearchParams.orderNumber;

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col items-center justify-center px-6 py-20 text-center sm:px-8">
      <span className="rounded-full border border-accent/20 bg-[#edf6f0] px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-accent">
        {t.orderSuccess.badge}
      </span>
      <h1 className="mt-6 font-display text-4xl text-brand-deep sm:text-5xl">
        {t.orderSuccess.title}
      </h1>
      <p className="mt-4 max-w-2xl text-sm leading-8 text-muted sm:text-base">
        {t.orderSuccess.description}
        {orderNumber ? ` ${t.orderSuccess.refPrefix} ${orderNumber}.` : ""}
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link href="/products" className={buttonVariants({ variant: "primary", size: "lg" })}>
          {t.orderSuccess.browseAction}
        </Link>
        <Link
          href="/contact"
          className={buttonVariants({ variant: "outline", size: "lg" })}
        >
          {t.orderSuccess.contactAction}
        </Link>
      </div>
    </main>
  );
}
