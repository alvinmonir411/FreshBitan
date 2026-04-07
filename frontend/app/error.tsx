"use client";

import { useEffect } from "react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="mx-auto flex min-h-[60vh] w-full max-w-4xl flex-col items-center justify-center px-6 py-20 text-center sm:px-8">
      <span className="rounded-full border border-accent/20 bg-[#edf6f0] px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-accent">
        Something went wrong
      </span>
      <h1 className="mt-6 font-display text-4xl text-brand-deep sm:text-5xl">
        We could not load this page
      </h1>
      <p className="mt-4 max-w-2xl text-sm leading-8 text-muted sm:text-base">
        Please try again, or go back to the storefront if the issue keeps happening.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={reset}
          className={buttonVariants({ variant: "primary", size: "lg" })}
        >
          Try again
        </button>
        <Link href="/" className={buttonVariants({ variant: "outline", size: "lg" })}>
          Back to home
        </Link>
      </div>
    </main>
  );
}
