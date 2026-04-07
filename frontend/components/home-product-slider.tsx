"use client";

import { useRef } from "react";
import { ProductCard } from "@/components/cards/product-card";
import { Button } from "@/components/ui/button";
import { ProductSummary } from "@/types/api";

interface HomeProductSliderProps {
  products: ProductSummary[];
}

export function HomeProductSlider({ products }: HomeProductSliderProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const scrollByAmount = (direction: "prev" | "next") => {
    const container = containerRef.current;

    if (!container) {
      return;
    }

    const amount = Math.max(container.clientWidth * 0.82, 280);

    container.scrollBy({
      left: direction === "next" ? amount : -amount,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative mt-8">
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => scrollByAmount("prev")}
        className="absolute left-0 top-1/2 z-10 hidden h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full p-0 shadow-[0_12px_30px_rgba(142,79,18,0.18)] lg:inline-flex"
        aria-label="Previous products"
      >
        <span className="text-xl leading-none">‹</span>
      </Button>
      <Button
        type="button"
        variant="primary"
        size="sm"
        onClick={() => scrollByAmount("next")}
        className="absolute right-0 top-1/2 z-10 hidden h-12 w-12 translate-x-1/2 -translate-y-1/2 rounded-full p-0 shadow-[0_12px_30px_rgba(239,139,30,0.26)] lg:inline-flex"
        aria-label="Next products"
      >
        <span className="text-xl leading-none">›</span>
      </Button>

      <div className="mb-4 flex items-center justify-end gap-3 lg:hidden">
        <Button type="button" variant="outline" size="sm" onClick={() => scrollByAmount("prev")} aria-label="Previous products">
          <span className="text-lg leading-none">‹</span>
        </Button>
        <Button type="button" variant="primary" size="sm" onClick={() => scrollByAmount("next")} aria-label="Next products">
          <span className="text-lg leading-none">›</span>
        </Button>
      </div>

      <div
        ref={containerRef}
        className="flex snap-x snap-mandatory gap-6 overflow-x-auto pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:px-3"
      >
        {products.map((product) => (
          <div
            key={product.id}
            className="min-w-[280px] flex-[0_0_280px] snap-start sm:min-w-[320px] sm:flex-[0_0_320px]"
          >
            <ProductCard product={product} className="h-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
