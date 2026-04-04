"use client";

import { createContext, useEffect, useState } from "react";
import { getPrimaryProductImage } from "@/lib/utils";
import {
  CART_STORAGE_KEY,
  clampCartQuantity,
  getCartItemCount,
  getCartSubtotal,
} from "@/lib/cart";
import { CartContextValue, CartItem, CartProductInput } from "@/types/cart";

export const CartContext = createContext<CartContextValue | null>(null);

const isCartItem = (value: unknown): value is CartItem => {
  if (!value || typeof value !== "object") {
    return false;
  }

  const item = value as Record<string, unknown>;

  return (
    typeof item.productId === "string" &&
    typeof item.slug === "string" &&
    typeof item.name === "string" &&
    typeof item.price === "number" &&
    typeof item.unit === "string" &&
    typeof item.stockQuantity === "number" &&
    typeof item.quantity === "number"
  );
};

const mapProductToCartItem = (product: CartProductInput, quantity: number): CartItem => {
  const primaryImage = getPrimaryProductImage(product);

  return {
    productId: product.id,
    slug: product.slug,
    name: product.name,
    price: product.price,
    discountedPrice: product.discountedPrice,
    unit: product.unit,
    stockQuantity: product.stockQuantity,
    quantity: clampCartQuantity(quantity, product.stockQuantity),
    imageUrl: primaryImage?.imageUrl ?? null,
    imageAlt: primaryImage?.altText ?? product.name,
    categoryName: product.category?.name ?? null,
  };
};

interface CartProviderProps {
  children: React.ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try {
      const storedCart = window.localStorage.getItem(CART_STORAGE_KEY);

      if (!storedCart) {
        setIsHydrated(true);
        return;
      }

      const parsedCart = JSON.parse(storedCart) as unknown;

      if (Array.isArray(parsedCart)) {
        setItems(parsedCart.filter(isCartItem));
      }
    } catch {
      setItems([]);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items, isHydrated]);

  const addItem = (product: CartProductInput, quantity = 1) => {
    setItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.productId === product.id);

      if (!existingItem) {
        return [...currentItems, mapProductToCartItem(product, quantity)];
      }

      return currentItems.map((item) =>
        item.productId === product.id
          ? {
              ...item,
              slug: product.slug,
              name: product.name,
              price: product.price,
              discountedPrice: product.discountedPrice,
              stockQuantity: product.stockQuantity,
              unit: product.unit,
              imageUrl: getPrimaryProductImage(product)?.imageUrl ?? item.imageUrl,
              imageAlt: getPrimaryProductImage(product)?.altText ?? item.imageAlt,
              categoryName: product.category?.name ?? item.categoryName,
              quantity: clampCartQuantity(
                item.quantity + quantity,
                product.stockQuantity,
              ),
            }
          : item,
      );
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.productId === productId
          ? {
              ...item,
              quantity: clampCartQuantity(quantity, item.stockQuantity),
            }
          : item,
      ),
    );
  };

  const removeItem = (productId: string) => {
    setItems((currentItems) =>
      currentItems.filter((item) => item.productId !== productId),
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount: getCartItemCount(items),
        subtotal: getCartSubtotal(items),
        isHydrated,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
