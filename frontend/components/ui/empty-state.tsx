import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

interface EmptyStateProps {
  title: string;
  description: string;
  actionHref?: string;
  actionLabel?: string;
}

export function EmptyState({
  title,
  description,
  actionHref,
  actionLabel,
}: EmptyStateProps) {
  return (
    <div className="rounded-[2rem] border border-dashed border-border bg-white/70 p-8 text-center">
      <h3 className="text-xl font-semibold text-brand-deep">{title}</h3>
      <p className="mt-3 text-sm leading-7 text-muted">{description}</p>
      {actionHref && actionLabel ? (
        <Link
          href={actionHref}
          className={`${buttonVariants({
            variant: "outline",
            size: "md",
          })} mt-6`}
        >
          {actionLabel}
        </Link>
      ) : null}
    </div>
  );
}
