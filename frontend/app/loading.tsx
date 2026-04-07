import { PageLoadingSkeleton } from "@/components/ui/loading-skeleton";

export default function Loading() {
  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-6 py-10 sm:px-8 lg:px-10">
      <div className="max-w-2xl">
        <span className="rounded-full border border-accent/20 bg-[#edf6f0] px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-accent">
          Loading FreshBitan
        </span>
        <h1 className="mt-5 font-display text-4xl text-brand-deep sm:text-5xl">
          Preparing the next section
        </h1>
        <p className="mt-4 text-sm leading-8 text-muted sm:text-base">
          We&apos;re loading products, seasonal content, and checkout details for you.
        </p>
      </div>
      <PageLoadingSkeleton />
    </main>
  );
}
