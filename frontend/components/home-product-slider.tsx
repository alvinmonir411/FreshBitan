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

    const firstItem = container.querySelector<HTMLElement>("[data-slider-item]");
    const styles = window.getComputedStyle(container);
    const gap = Number.parseFloat(styles.columnGap || styles.gap || "0");
    const amount = firstItem
      ? firstItem.getBoundingClientRect().width + gap
      : Math.max(container.clientWidth * 0.82, 240);

    container.scrollBy({
      left: direction === "next" ? amount : -amount,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative mt-6 sm:mt-8">
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => scrollByAmount("prev")}
        className="absolute left-0 top-1/2 z-10 hidden h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full p-0 shadow-[0_12px_30px_rgba(142,79,18,0.18)] hover:translate-y-0 hover:border-border hover:bg-white/80 lg:inline-flex"
        aria-label="Previous products"
      >
        <span className="text-xl leading-none">{"<"}</span>
      </Button>
      <Button
        type="button"
        variant="primary"
        size="sm"
        onClick={() => scrollByAmount("next")}
        className="absolute right-0 top-1/2 z-10 hidden h-12 w-12 translate-x-1/2 -translate-y-1/2 rounded-full p-0 shadow-[0_12px_30px_rgba(239,139,30,0.26)] hover:translate-y-0 hover:bg-brand lg:inline-flex"
        aria-label="Next products"
      >
        <span className="text-xl leading-none">{">"}</span>
      </Button>

      <div className="mb-3 flex items-center justify-end gap-2.5 lg:hidden">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => scrollByAmount("prev")}
          aria-label="Previous products"
          className="h-10 min-w-10 px-0 hover:translate-y-0 hover:border-border hover:bg-white/80"
        >
          <span className="text-lg leading-none">{"<"}</span>
        </Button>
        <Button
          type="button"
          variant="primary"
          size="sm"
          onClick={() => scrollByAmount("next")}
          aria-label="Next products"
          className="h-10 min-w-10 px-0 hover:translate-y-0 hover:bg-brand"
        >
          <span className="text-lg leading-none">{">"}</span>
        </Button>
      </div>

      <div
        ref={containerRef}
        className="-mx-1 flex snap-x snap-mandatory gap-4 overflow-x-auto px-1 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:gap-5 lg:mx-0 lg:gap-6 lg:px-3"
      >
        {products.map((product) => (
          <div
            key={product.id}
            data-slider-item
            className="min-w-[88vw] max-w-[22rem] flex-[0_0_88vw] snap-start sm:min-w-[19rem] sm:flex-[0_0_19rem] lg:min-w-[20rem] lg:flex-[0_0_20rem]"
          >
            <ProductCard product={product} className="h-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
