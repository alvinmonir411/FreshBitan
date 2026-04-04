"use client";

import { useState } from "react";
import { FaqItem } from "@/types/site";
import { cn } from "@/lib/utils";

interface FaqAccordionProps {
  items: FaqItem[];
}

export function FaqAccordion({ items }: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="space-y-4">
      {items.map((item, index) => {
        const isOpen = openIndex === index;

        return (
          <div
            key={item.question}
            className="rounded-[1.5rem] border border-border bg-white/80 p-5"
          >
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : index)}
              className="flex w-full items-start justify-between gap-4 text-left"
            >
              <span className="text-base font-semibold text-foreground sm:text-lg">
                {item.question}
              </span>
              <span
                className={cn(
                  "mt-1 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand/10 text-brand-deep transition",
                  isOpen && "rotate-45 bg-brand text-white",
                )}
              >
                +
              </span>
            </button>
            {isOpen ? (
              <p className="mt-4 pr-10 text-sm leading-7 text-muted">
                {item.answer}
              </p>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
