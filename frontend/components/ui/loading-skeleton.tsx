import { cn } from "@/lib/utils";

function SkeletonBlock({
  className,
}: {
  className?: string;
}) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-3xl bg-white/75 shadow-[0_10px_30px_rgba(142,79,18,0.06)]",
        className,
      )}
    />
  );
}

export function LoadingSkeleton({ className }: { className?: string }) {
  return <SkeletonBlock className={className} />;
}

export function ProductCardSkeleton() {
  return (
    <div className="rounded-[1.75rem] border border-border bg-card p-4">
      <SkeletonBlock className="aspect-[4/3] w-full" />
      <SkeletonBlock className="mt-4 h-4 w-24 rounded-full" />
      <SkeletonBlock className="mt-4 h-6 w-3/4" />
      <SkeletonBlock className="mt-3 h-4 w-full" />
      <SkeletonBlock className="mt-2 h-4 w-2/3" />
      <div className="mt-5 flex gap-3">
        <SkeletonBlock className="h-11 flex-1 rounded-full" />
        <SkeletonBlock className="h-11 flex-1 rounded-full" />
      </div>
    </div>
  );
}

export function ReviewCardSkeleton() {
  return (
    <div className="rounded-[1.75rem] border border-border bg-card p-5">
      <SkeletonBlock className="h-4 w-28 rounded-full" />
      <SkeletonBlock className="mt-4 h-5 w-3/4" />
      <SkeletonBlock className="mt-3 h-4 w-full" />
      <SkeletonBlock className="mt-2 h-4 w-4/5" />
      <SkeletonBlock className="mt-6 h-4 w-1/3" />
    </div>
  );
}

export function PageLoadingSkeleton() {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 py-8 sm:px-8 lg:px-10">
      <SkeletonBlock className="h-56 w-full sm:h-72" />
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}
