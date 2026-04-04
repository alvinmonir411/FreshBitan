import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col items-center justify-center px-6 py-20 text-center sm:px-8">
      <span className="rounded-full border border-brand/20 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-brand-deep">
        404
      </span>
      <h1 className="mt-6 font-display text-4xl text-brand-deep sm:text-5xl">
        এই পাতাটি পাওয়া যায়নি
      </h1>
      <p className="mt-4 max-w-2xl text-sm leading-8 text-muted sm:text-base">
        The page you are looking for may have moved, or the product is no longer
        available. Let&apos;s take you back to FreshBitan&apos;s main collection.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link href="/" className={buttonVariants({ variant: "primary", size: "lg" })}>
          Home
        </Link>
        <Link
          href="/products"
          className={buttonVariants({ variant: "outline", size: "lg" })}
        >
          Browse products
        </Link>
      </div>
    </main>
  );
}
