import { LoadingSkeleton } from "@/components/ui/loading-skeleton";

export default function CartLoading() {
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
