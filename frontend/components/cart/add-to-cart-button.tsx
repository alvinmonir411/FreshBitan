"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { CartProductInput } from "@/types/cart";
import { cn } from "@/lib/utils";

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

  const isOutOfStock = product.stockQuantity <= 0;

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      onClick={() => {
        addItem(product, quantity);
        setIsAdded(true);
      }}
      disabled={isOutOfStock}
      className={cn(className)}
    >
      {isOutOfStock ? "স্টক শেষ" : isAdded ? "কার্টে যোগ হয়েছে" : "কার্টে যোগ করুন"}
    </Button>
  );
}
