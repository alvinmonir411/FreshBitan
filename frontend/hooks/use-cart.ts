"use client";

import { useContext } from "react";
import { CartContext } from "@/components/cart/cart-provider";

export const useCart = () => {
  const cart = useContext(CartContext);

  if (!cart) {
    throw new Error("useCart must be used within a CartProvider.");
  }

  return cart;
};
