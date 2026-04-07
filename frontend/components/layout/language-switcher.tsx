"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { localeLabels, SiteLocale } from "@/lib/locale-data";
import { useSiteLocale } from "@/components/layout/locale-provider";
import { cn } from "@/lib/utils";

export function LanguageSwitcher({ className }: { className?: string }) {
  const locale = useSiteLocale();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const setLocale = (nextLocale: SiteLocale) => {
    if (nextLocale === locale) {
      return;
    }

    startTransition(async () => {
      await fetch("/api/locale", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locale: nextLocale }),
      });
      router.refresh();
    });
  };

  return (
    <div className={cn("inline-flex rounded-full border border-border bg-white/75 p-1", className)}>
      {(["bn", "en"] as const).map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => setLocale(option)}
          disabled={isPending}
          className={cn(
            "rounded-full px-3 py-2 text-xs font-semibold",
            option === locale ? "bg-brand text-white" : "text-brand-deep",
          )}
        >
          {localeLabels[option]}
        </button>
      ))}
    </div>
  );
}
