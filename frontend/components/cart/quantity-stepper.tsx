"use client";

import { cn } from "@/lib/utils";

interface QuantityStepperProps {
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
  className?: string;
}

export function QuantityStepper({
  value,
  min = 1,
  max = 99,
  onChange,
  className,
}: QuantityStepperProps) {
  const decreaseDisabled = value <= min;
  const increaseDisabled = value >= max;

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border border-border bg-white/90 p-1",
        className,
      )}
    >
      <button
        type="button"
        onClick={() => onChange(Math.max(value - 1, min))}
        disabled={decreaseDisabled}
        className="inline-flex h-10 w-10 items-center justify-center rounded-full text-lg font-semibold text-brand-deep disabled:cursor-not-allowed disabled:opacity-35"
        aria-label="Decrease quantity"
      >
        -
      </button>
      <input
        type="number"
        min={min}
        max={max}
        value={value}
        onChange={(event) => {
          const nextValue = Number(event.target.value);
          onChange(Number.isNaN(nextValue) ? min : Math.min(Math.max(nextValue, min), max));
        }}
        className="h-10 w-14 border-0 bg-transparent text-center text-sm font-semibold text-foreground outline-none"
        aria-label="Quantity"
      />
      <button
        type="button"
        onClick={() => onChange(Math.min(value + 1, max))}
        disabled={increaseDisabled}
        className="inline-flex h-10 w-10 items-center justify-center rounded-full text-lg font-semibold text-brand-deep disabled:cursor-not-allowed disabled:opacity-35"
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  );
}
