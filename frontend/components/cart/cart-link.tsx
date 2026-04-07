"use client";

import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { useDictionary } from "@/components/layout/locale-provider";
import { useCart } from "@/hooks/use-cart";
import { cn } from "@/lib/utils";

interface CartLinkProps {
  compact?: boolean;
  onClick?: () => void;
  className?: string;
}

export function CartLink({ compact = false, onClick, className }: CartLinkProps) {
  const { itemCount, isHydrated } = useCart();
  const t = useDictionary();

  return (
    <Link
      href="/cart"
      onClick={onClick}
      className={cn(
        buttonVariants({ variant: "outline", size: compact ? "sm" : "md" }),
        "relative gap-2 rounded-full",
        compact && "min-w-11 px-4",
        className,
      )}
      aria-label={`${t.common.cart}${itemCount > 0 ? ` ${itemCount}` : ""}`}
    >
      <span>{t.common.cart}</span>
      {isHydrated && itemCount > 0 ? (
        <span className="inline-flex min-h-6 min-w-6 items-center justify-center rounded-full bg-brand px-2 text-xs font-bold text-white">
          {itemCount}
        </span>
      ) : null}
    </Link>
  );
}
