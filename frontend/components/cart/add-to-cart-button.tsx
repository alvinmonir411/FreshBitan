"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useSiteLocale } from "@/components/layout/locale-provider";
import { useCart } from "@/hooks/use-cart";
import { CartProductInput } from "@/types/cart";
import { cn, getActiveProductOptions, getDefaultProductOption } from "@/lib/utils";

interface AddToCartButtonProps {
  product: CartProductInput;
  quantity?: number;
  className?: string;
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
}

export function AddToCartButton({
  product,
  quantity = 1,
  className,
  variant = "primary",
  size = "md",
  fullWidth = false,
}: AddToCartButtonProps) {
  const { addItem } = useCart();
  const locale = useSiteLocale();
  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    if (!isAdded) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setIsAdded(false);
    }, 1800);

    return () => window.clearTimeout(timeout);
  }, [isAdded]);

  const activeOptions = getActiveProductOptions(product);
  const selectedOption =
    activeOptions.length === 1 ? activeOptions[0] : getDefaultProductOption(product);
  const isOutOfStock = !selectedOption || selectedOption.stockQuantity <= 0;
  const needsSelection = activeOptions.length > 1;

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      onClick={() => {
        if (!selectedOption || needsSelection) {
          return;
        }

        addItem(product, selectedOption, quantity);
        setIsAdded(true);
      }}
      disabled={isOutOfStock}
      className={cn(className)}
    >
      {isOutOfStock
        ? (locale === "en" ? "Out of stock" : "স্টক শেষ")
        : needsSelection
          ? (locale === "en" ? "Choose pack size" : "প্যাক সাইজ বাছুন")
        : isAdded
          ? (locale === "en" ? "Added to cart" : "কার্টে যোগ হয়েছে")
          : (locale === "en" ? "Add to cart" : "কার্টে যোগ করুন")}
    </Button>
  );
}
