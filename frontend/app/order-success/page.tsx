import type { Metadata } from "next";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Order Success",
  description:
    "FreshBitan order confirmation page for successful public order submissions.",
};

interface OrderSuccessPageProps {
  searchParams: Promise<{
    orderNumber?: string;
  }>;
}

export default async function OrderSuccessPage({
  searchParams,
}: OrderSuccessPageProps) {
  const resolvedSearchParams = await searchParams;
  const orderNumber = resolvedSearchParams.orderNumber;

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col items-center justify-center px-6 py-20 text-center sm:px-8">
      <span className="rounded-full border border-accent/20 bg-[#edf6f0] px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-accent">
        Order received
      </span>
      <h1 className="mt-6 font-display text-4xl text-brand-deep sm:text-5xl">
        ধন্যবাদ, আপনার অর্ডার জমা হয়েছে
      </h1>
      <p className="mt-4 max-w-2xl text-sm leading-8 text-muted sm:text-base">
        FreshBitan team আপনার order review করবে এবং প্রয়োজনে যোগাযোগ করবে.
        {orderNumber ? ` Your reference number is ${orderNumber}.` : ""}
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link href="/products" className={buttonVariants({ variant: "primary", size: "lg" })}>
          আরো পণ্য দেখুন
        </Link>
        <Link
          href="/contact"
          className={buttonVariants({ variant: "outline", size: "lg" })}
        >
          Contact FreshBitan
        </Link>
      </div>
    </main>
  );
}
